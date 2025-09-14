// Minimal reader for skills stored by Platform Owner SkillManagement
// This mirrors the localStorage key used there and exposes a read-only getter.

export type StoredSkill = {
  id: string;
  name: string;
  scope?: 'Global' | 'Tenant';
  tenantId?: string;
};

const SKILLS_STORAGE_KEY = 'platform.skills';

export function getAllSkills(): StoredSkill[] {
  try {
    const raw = localStorage.getItem(SKILLS_STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as any[];
    return arr.map((s) => ({ id: String(s.id), name: String(s.name), scope: s.scope, tenantId: s.tenantId }));
  } catch {
    return [];
  }
}

