import { z } from 'zod';

export type TenantStatus = 'active' | 'paused';
export type TenantPlan = 'free' | 'pro' | 'enterprise';

export interface NewTenantInput {
  name: string;
  slug: string; // subdomain
  adminEmail: string;
  adminPhone?: string;
  plan: TenantPlan;
  status: TenantStatus;
  accountQuota: number;
}

export interface Tenant extends NewTenantInput {
  id: string;
  createdAt: string;
  usedSeats: number;
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
  // Simulate latency
  await new Promise((r) => setTimeout(r, 250));
  return loadTenants();
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

  // Simulate latency
  await new Promise((r) => setTimeout(r, 400));

  const existing = loadTenants();
  const duplicate = existing.some((t) => t.slug.toLowerCase() === input.slug.toLowerCase());
  if (duplicate) {
    // 409 Conflict for duplicate slug
    throw new ApiError('Slug already in use', 409);
  }

  const tenant: Tenant = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    createdAt: new Date().toISOString(),
    ...input,
    usedSeats: 0,
  };
  const next = [tenant, ...existing];
  saveTenants(next);
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
