import { z } from 'zod';

export type TenantStatus = 'active' | 'paused';
export type TenantPlan = 'free' | 'pro' | 'enterprise';
export type TenantCategory = 'Business School' | 'Engineering' | 'Arts' | 'Test Tenants' | 'Other';

export interface NewTenantInput {
  name: string;
  slug: string; // subdomain
  adminEmail: string;
  adminPhone?: string;
  plan: TenantPlan;
  status: TenantStatus;
  accountQuota: number;
  category: TenantCategory;
}

export interface Tenant extends NewTenantInput {
  id: string;
  createdAt: string;
  usedSeats: number;
  notes?: string;
  requirePasswordReset?: boolean;
  lastCredentialsSentAt?: string;
}

const STORAGE_KEY = 'platform.tenants';

export const newTenantSchema = z.object({
  name: z.string().min(2, 'Tenant name is required'),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use kebab-case, lowercase letters, numbers, dashes'),
  adminEmail: z.string().email('Invalid email'),
  adminPhone: z
    .string()
    .optional()
    .refine((v) => !v || /[0-9()+\-\s]{7,}/.test(v), 'Enter a valid phone'),
  plan: z.enum(['free', 'pro', 'enterprise']),
  status: z.enum(['active', 'paused']),
  accountQuota: z
    .number({ required_error: 'Accounts Requested is required' })
    .int('Enter a whole number')
    .min(1, 'Must be at least 1')
    .max(10000, 'Too large'),
  category: z.enum(['Business School', 'Engineering', 'Arts', 'Test Tenants', 'Other']),
});

function normalizeTenant(t: any): Tenant {
  return {
    id: t.id,
    createdAt: t.createdAt ?? new Date().toISOString(),
    name: t.name,
    slug: t.slug,
    adminEmail: t.adminEmail,
    adminPhone: t.adminPhone,
    plan: t.plan,
    status: t.status,
    accountQuota: typeof t.accountQuota === 'number' ? t.accountQuota : 5,
    usedSeats: typeof t.usedSeats === 'number' ? t.usedSeats : 0,
    category: ((): TenantCategory => {
      const c = t.category;
      const allowed: TenantCategory[] = ['Business School', 'Engineering', 'Arts', 'Test Tenants', 'Other'];
      return allowed.includes(c) ? c : 'Other';
    })(),
    notes: typeof t.notes === 'string' ? t.notes : undefined,
    requirePasswordReset: !!t.requirePasswordReset,
    lastCredentialsSentAt: t.lastCredentialsSentAt,
  };
}

function loadTenants(): Tenant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as any[];
    return parsed.map(normalizeTenant);
  } catch {
    return [];
  }
}

function saveTenants(list: Tenant[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export async function fetchTenants(): Promise<Tenant[]> {
  const { supabase } = await import('@/integrations/supabase/client');
  
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new ApiError(error.message, 500);

  // Count users per tenant
  const { data: profiles } = await supabase
    .from('profiles')
    .select('tenant_id, id');

  const usedSeatsMap = new Map<string, number>();
  profiles?.forEach(p => {
    if (p.tenant_id) {
      usedSeatsMap.set(p.tenant_id, (usedSeatsMap.get(p.tenant_id) || 0) + 1);
    }
  });

  const tenants: Tenant[] = (data || []).map(t => {
    const settings = (t.settings as any) || {};
    return {
      id: t.id,
      createdAt: t.created_at,
      name: t.name,
      slug: t.domain,
      adminEmail: settings.adminEmail || '',
      adminPhone: settings.adminPhone,
      plan: settings.plan || 'pro',
      status: t.is_active ? 'active' : 'paused',
      accountQuota: settings.accountQuota || 5,
      usedSeats: usedSeatsMap.get(t.id) || 0,
      category: settings.category || 'Other',
    };
  });

  return tenants;
}

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

export async function createTenant(input: NewTenantInput): Promise<Tenant> {
  const parsed = newTenantSchema.safeParse(input);
  if (!parsed.success) {
    throw new ApiError('Validation failed', 400);
  }

  // Import Supabase client dynamically
  const { supabase } = await import('@/integrations/supabase/client');

  // Check for duplicate slug
  const { data: existing } = await supabase
    .from('tenants')
    .select('id')
    .eq('domain', input.slug)
    .single();

  if (existing) {
    throw new ApiError('Slug already in use', 409);
  }

  // Create tenant
  const { data: tenantData, error: tenantError } = await supabase
    .from('tenants')
    .insert({
      name: input.name,
      domain: input.slug,
      is_active: input.status === 'active',
      settings: {
        plan: input.plan,
        accountQuota: input.accountQuota,
        category: input.category,
        adminPhone: input.adminPhone,
      },
    })
    .select()
    .single();

  if (tenantError) throw new ApiError(tenantError.message, 500);

  // Create admin user
  const temporaryPassword = Math.random().toString(36).slice(-8) + 'A1!';
  
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: input.adminEmail,
    password: temporaryPassword,
    email_confirm: false,
    user_metadata: {
      name: input.name + ' Admin',
    },
  });

  if (authError) {
    // Rollback tenant creation
    await supabase.from('tenants').delete().eq('id', tenantData.id);
    throw new ApiError(authError.message, 500);
  }

  if (!authData.user) {
    await supabase.from('tenants').delete().eq('id', tenantData.id);
    throw new ApiError('Failed to create admin user', 500);
  }

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email: input.adminEmail,
      name: input.name + ' Admin',
      tenant_id: tenantData.id,
      is_active: true,
    });

  if (profileError) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    await supabase.from('tenants').delete().eq('id', tenantData.id);
    throw new ApiError(profileError.message, 500);
  }

  // Assign tenant_admin role
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({
      user_id: authData.user.id,
      role: 'tenant_admin',
      tenant_id: tenantData.id,
    });

  if (roleError) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    await supabase.from('tenants').delete().eq('id', tenantData.id);
    throw new ApiError(roleError.message, 500);
  }

  // Send welcome email with credentials
  try {
    const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-tenant-welcome', {
      body: {
        tenantId: tenantData.id,
        adminEmail: input.adminEmail,
        adminName: input.name + ' Admin',
        tenantName: input.name,
        temporaryPassword,
      },
    });

    if (emailError) {
      console.error('Failed to send welcome email:', emailError);
    } else {
      console.log('Welcome email sent:', emailResponse);
    }
  } catch (emailErr) {
    console.error('Failed to send welcome email:', emailErr);
    // Don't fail the entire operation if email fails
  }

  const tenant: Tenant = {
    id: tenantData.id,
    createdAt: tenantData.created_at,
    name: input.name,
    slug: input.slug,
    adminEmail: input.adminEmail,
    adminPhone: input.adminPhone,
    plan: input.plan,
    status: input.status,
    accountQuota: input.accountQuota,
    usedSeats: 1, // Admin user counts as 1 seat
    category: input.category,
  };
  
  return tenant;
}

export function getTenantUsage(tenantId: string) {
  const tenants = loadTenants();
  const t = tenants.find((x) => x.id === tenantId);
  if (!t) throw new ApiError('Tenant not found', 404);
  const remaining = Math.max(0, t.accountQuota - t.usedSeats);
  return { account_quota: t.accountQuota, used_seats: t.usedSeats, remaining };
}

export function canCreateMore(tenantId: string) {
  const { remaining } = getTenantUsage(tenantId);
  return remaining > 0;
}

export function incrementUsedSeats(tenantId: string, by = 1) {
  const tenants = loadTenants();
  const idx = tenants.findIndex((x) => x.id === tenantId);
  if (idx === -1) throw new ApiError('Tenant not found', 404);
  const t = tenants[idx];
  if (t.usedSeats + by > t.accountQuota) {
    const err: any = new ApiError('Seat limit reached. Please request more seats.', 409);
    err.code = 'QUOTA_EXCEEDED';
    throw err;
  }
  tenants[idx] = { ...t, usedSeats: t.usedSeats + by };
  saveTenants(tenants);
  return tenants[idx];
}

// Optional: track seat requests (for demo)
const REQUESTS_KEY = 'platform.seatRequests';
export function requestMoreSeats(tenantId: string, requestedDelta: number) {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    const list = raw ? (JSON.parse(raw) as any[]) : [];
    const item = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), tenantId, requestedDelta, createdAt: new Date().toISOString() };
    list.push(item);
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(list));
    return item;
  } catch {
    return null;
  }
}

// Settings storage for the platform owner settings drawer
const SETTINGS_KEY = 'platform.settings';

export type SettingsSections = 'general' | 'billing' | 'theme' | 'roles';

export interface PlatformSettings {
  general: {
    companyName: string;
    supportEmail: string;
  };
  billing: {
    invoiceEmail?: string;
  };
  theme: {
    primaryColor: string;
    logoUrl?: string;
  };
  roles: {
    allowSelfSignup: boolean;
  };
}

export function getDefaultSettings(): PlatformSettings {
  return {
    general: { companyName: 'EduPlatform', supportEmail: 'support@example.com' },
    billing: { invoiceEmail: 'billing@example.com' },
    theme: { primaryColor: '#4f46e5', logoUrl: '' },
    roles: { allowSelfSignup: false },
  };
}

export async function fetchSettings(): Promise<PlatformSettings> {
  await new Promise((r) => setTimeout(r, 150));
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? (JSON.parse(raw) as PlatformSettings) : getDefaultSettings();
  } catch {
    return getDefaultSettings();
  }
}

export async function patchSettings(partial: Partial<PlatformSettings>): Promise<PlatformSettings> {
  await new Promise((r) => setTimeout(r, 250));
  const current = await fetchSettings();
  const merged: PlatformSettings = {
    general: { ...current.general, ...partial.general },
    billing: { ...current.billing, ...partial.billing },
    theme: { ...current.theme, ...partial.theme },
    roles: { ...current.roles, ...partial.roles },
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  return merged;
}

export const TenantsQueryKey = ['platform', 'tenants'] as const;
export const SettingsQueryKey = ['platform', 'settings'] as const;

// -------- Extensions for management actions --------

export interface UpdateTenantInput {
  name?: string;
  slug?: string;
  adminEmail?: string;
  status?: TenantStatus;
  accountQuota?: number;
  notes?: string;
  requirePasswordReset?: boolean;
  category?: TenantCategory;
}

export const updateTenantSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use kebab-case, lowercase letters, numbers, dashes')
    .min(2)
    .max(30)
    .optional(),
  adminEmail: z.string().email('Invalid email').optional(),
  status: z.enum(['active', 'paused']).optional(),
  accountQuota: z.number().int().min(1).max(10000).optional(),
  notes: z.string().max(5000).optional(),
  requirePasswordReset: z.boolean().optional(),
  category: z.enum(['Business School', 'Engineering', 'Arts', 'Test Tenants', 'Other']).optional(),
});

function findTenantIndex(tenants: Tenant[], tenantId: string) {
  const idx = tenants.findIndex((x) => x.id === tenantId);
  if (idx === -1) throw new ApiError('Tenant not found', 404);
  return idx;
}

export async function updateTenant(tenantId: string, input: UpdateTenantInput): Promise<Tenant> {
  const parsed = updateTenantSchema.safeParse(input);
  if (!parsed.success) throw new ApiError('Validation failed', 400);

  await new Promise((r) => setTimeout(r, 300));
  const tenants = loadTenants();
  const idx = findTenantIndex(tenants, tenantId);
  const current = tenants[idx];

  // If changing slug, check uniqueness
  if (input.slug && input.slug !== current.slug) {
    const duplicate = tenants.some((t) => t.slug.toLowerCase() === input.slug!.toLowerCase());
    if (duplicate) throw new ApiError('Slug already in use', 409);
  }

  // If switching to active, require adminEmail present
  if (input.status === 'active' && !(input.adminEmail ?? current.adminEmail)) {
    throw new ApiError('Admin email required to activate tenant', 400);
  }

  const updated: Tenant = normalizeTenant({ ...current, ...input });
  tenants[idx] = updated;
  saveTenants(tenants);
  logAudit({
    type: 'TENANT_UPDATED',
    tenantId,
    before: current,
    after: updated,
  });
  return updated;
}

export interface DeleteTenantOptions { hard?: boolean; actorId?: string }

export async function deleteTenant(tenantId: string, options?: DeleteTenantOptions): Promise<{ ok: true }>
{
  const { hard = false } = options || {};
  await new Promise((r) => setTimeout(r, 250));
  const tenants = loadTenants();
  const idx = findTenantIndex(tenants, tenantId);
  const t = tenants[idx];
  if (!hard) {
    // Soft delete constraints: block if active and has users
    if (t.status === 'active' && t.usedSeats > 0) {
      const err: any = new ApiError('Cannot delete active tenant with users. Choose hard delete.', 400);
      err.code = 'BLOCKED_SOFT_DELETE';
      throw err;
    }
  }
  const removed = tenants.splice(idx, 1)[0];
  saveTenants(tenants);
  logAudit({ type: 'TENANT_DELETED', tenantId, hard, snapshot: removed });
  return { ok: true } as const;
}

export type CredentialMethod = 'email' | 'copy';
export interface CredentialPayload {
  to: string;
  cc?: string;
  subject: string;
  message: string;
  method: CredentialMethod;
  actorId?: string;
}

export async function sendCredentials(
  tenantId: string,
  payload: CredentialPayload
): Promise<{ ok: true; link?: string; info?: string }>
{
  const { to, cc, subject, message, method } = payload;
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    throw new ApiError('Invalid recipient email', 400);
  }
  if (!subject?.trim() || !message?.trim()) {
    throw new ApiError('Subject and message are required', 400);
  }

  await new Promise((r) => setTimeout(r, 400));
  const tenants = loadTenants();
  const idx = findTenantIndex(tenants, tenantId);
  const t = tenants[idx];

  if (t.status !== 'active') {
    throw new ApiError('Activate tenant to send credentials', 400);
  }

  let info: string | undefined;
  if (t.lastCredentialsSentAt) {
    const last = new Date(t.lastCredentialsSentAt).getTime();
    const now = Date.now();
    if (now - last < 10 * 60 * 1000) {
      info = 'Credentials were sent recently (within 10 minutes).';
    }
  }

  // Generate a credential link token
  const token = Math.random().toString(36).slice(2);
  const link = `https://${t.slug}.example.com/login?token=${token}`;

  tenants[idx] = { ...t, lastCredentialsSentAt: new Date().toISOString() };
  saveTenants(tenants);

  logAudit({
    type: 'TENANT_CREDENTIALS_SENT',
    tenantId,
    to,
    cc,
    method,
    link,
  });

  // We don't actually send email in this demo; we just return the link for copy method
  return { ok: true, link: method === 'copy' ? link : undefined, info } as const;
}

// ---------- Audit log (local) ----------
type AuditEvent =
  | { type: 'TENANT_CREDENTIALS_SENT'; tenantId: string; to: string; cc?: string; method: CredentialMethod; link?: string }
  | { type: 'TENANT_UPDATED'; tenantId: string; before: Tenant; after: Tenant }
  | { type: 'TENANT_DELETED'; tenantId: string; hard: boolean; snapshot: Tenant };

const AUDIT_KEY = 'platform.auditLog';

function logAudit(evt: AuditEvent) {
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    const list = raw ? (JSON.parse(raw) as any[]) : [];
    list.push({ ...evt, at: new Date().toISOString() });
    localStorage.setItem(AUDIT_KEY, JSON.stringify(list));
  } catch {
    // noop
  }
}

export function fetchAuditLog(): Array<AuditEvent & { at: string }> {
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    return raw ? (JSON.parse(raw) as any[]) : [];
  } catch {
    return [];
  }
}
