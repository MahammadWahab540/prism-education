import { useEffect, useMemo, useState } from 'react';
import type { CareersState, CareerCategory, CareerGoal, DifficultyLevel } from '@/types/careers';

const LS_KEY = 'platform.careers';

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS<T>(key: string, val: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(val));
}

const defaultState: CareersState = { categories: [], goals: [] };

function nowIso() { return new Date().toISOString(); }

function uniqBy<T>(arr: T[], key: (v: T) => string) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const v of arr) {
    const k = key(v);
    if (!seen.has(k)) { seen.add(k); out.push(v); }
  }
  return out;
}

export function useCareers() {
  const [state, setState] = useState<CareersState>(() => readLS(LS_KEY, defaultState));

  useEffect(() => { writeLS(LS_KEY, state); }, [state]);

  // CRUD: Categories
  const createCategory = (input: { name: string; description?: string; icon?: string; isGlobal: boolean; tenantId?: string }) => {
    const id = `cat_${Date.now()}`;
    const cat: CareerCategory = { id, name: input.name.trim(), description: input.description, icon: input.icon, isGlobal: !!input.isGlobal, tenantId: input.isGlobal ? undefined : input.tenantId, createdAt: nowIso(), updatedAt: nowIso() };
    // uniqueness: name scoped by tenant/global
    const exists = state.categories.some(c => c.name.toLowerCase() === cat.name.toLowerCase() && ((c.isGlobal && cat.isGlobal) || (!c.isGlobal && !cat.isGlobal && c.tenantId === cat.tenantId)));
    if (exists) throw new Error('Category already exists for this scope');
    setState(prev => ({ ...prev, categories: [...prev.categories, cat] }));
    return cat;
  };

  const updateCategory = (id: string, patch: Partial<CareerCategory>) => {
    setState(prev => ({ ...prev, categories: prev.categories.map(c => c.id === id ? { ...c, ...patch, updatedAt: nowIso() } : c) }));
  };
  const deleteCategory = (id: string) => {
    setState(prev => ({ ...prev, categories: prev.categories.filter(c => c.id !== id), goals: prev.goals.filter(g => g.categoryId !== id) }));
  };

  // CRUD: Goals
  const validateDuration = (min: number, max: number) => {
    if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max <= 0) throw new Error('Duration must be positive numbers');
    if (min > max) throw new Error('Min duration cannot exceed max');
  };

  const createGoal = (input: { categoryId: string; name: string; icon?: string; shortDescription?: string; longDescription?: string; durationMinMonths: number; durationMaxMonths: number; difficulty: DifficultyLevel; isGlobal: boolean; tenantId?: string; linkedSkillIds?: string[]; isActive?: boolean; }) => {
    validateDuration(input.durationMinMonths, input.durationMaxMonths);
    const id = `goal_${Date.now()}`;
    const goal: CareerGoal = {
      id,
      categoryId: input.categoryId,
      name: input.name.trim(),
      icon: input.icon,
      shortDescription: input.shortDescription,
      longDescription: input.longDescription,
      durationMinMonths: input.durationMinMonths,
      durationMaxMonths: input.durationMaxMonths,
      difficulty: input.difficulty,
      isGlobal: !!input.isGlobal,
      tenantId: input.isGlobal ? undefined : input.tenantId,
      linkedSkillIds: uniqBy((input.linkedSkillIds || []).map(String), (x) => x),
      isActive: input.isActive ?? true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    // name uniqueness per scope within category
    const exists = state.goals.some(g => g.name.toLowerCase() === goal.name.toLowerCase() && g.categoryId === goal.categoryId && ((g.isGlobal && goal.isGlobal) || (!g.isGlobal && !goal.isGlobal && g.tenantId === goal.tenantId)));
    if (exists) throw new Error('Goal already exists in this category and scope');
    setState(prev => ({ ...prev, goals: [...prev.goals, goal] }));
    return goal;
  };

  const updateGoal = (id: string, patch: Partial<CareerGoal>) => {
    setState(prev => ({ ...prev, goals: prev.goals.map(g => g.id === id ? { ...g, ...patch, updatedAt: nowIso() } : g) }));
  };
  const deleteGoal = (id: string) => {
    setState(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
  };
  const linkGoalSkills = (id: string, skillIds: string[]) => {
    setState(prev => ({ ...prev, goals: prev.goals.map(g => g.id === id ? { ...g, linkedSkillIds: uniqBy(skillIds.map(String), (x) => x), updatedAt: nowIso() } : g) }));
  };

  // Queries
  const listCategoriesForTenant = (tenantId?: string) => {
    return state.categories.filter(c => c.isGlobal || (!!tenantId && c.tenantId === tenantId));
  };
  const listGoalsForTenant = (tenantId?: string) => {
    return state.goals.filter(g => g.isActive && (g.isGlobal || (!!tenantId && g.tenantId === tenantId)));
  };
  const listGoalsByCategoryForTenant = (categoryId: string, tenantId?: string) => {
    return listGoalsForTenant(tenantId).filter(g => g.categoryId === categoryId);
  };

  return {
    state,
    // Category API
    createCategory,
    updateCategory,
    deleteCategory,
    listCategoriesForTenant,
    // Goal API
    createGoal,
    updateGoal,
    deleteGoal,
    linkGoalSkills,
    listGoalsForTenant,
    listGoalsByCategoryForTenant,
  };
}

