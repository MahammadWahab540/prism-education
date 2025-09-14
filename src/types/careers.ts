export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CareerCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string; // simple emoji or icon tag
  isGlobal: boolean;
  tenantId?: string; // present when isGlobal=false
  createdAt: string;
  updatedAt: string;
}

export interface CareerGoal {
  id: string;
  categoryId: string;
  name: string;
  icon?: string; // emoji or simple icon tag
  shortDescription?: string;
  longDescription?: string;
  durationMinMonths: number;
  durationMaxMonths: number;
  difficulty: DifficultyLevel;
  isGlobal: boolean;
  tenantId?: string; // present when isGlobal=false
  linkedSkillIds: string[]; // ids from platform.skills storage
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CareersState {
  categories: CareerCategory[];
  goals: CareerGoal[];
}

