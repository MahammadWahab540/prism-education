export type CapstoneDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CapstoneCheckpoint {
  id: string;
  title: string;
  description: string;
  requiredDeliverables: Array<'repo' | 'report' | 'demo'>;
  dueDaysOffset?: number; // days from start
}

export interface CapstoneRubricItem {
  id: string;
  criterion: string;
  weight: number; // 0-100 sum must be 100
  description?: string;
}

export interface CapstoneRubric {
  items: CapstoneRubricItem[];
}

export interface CapstoneConfig {
  id: string;
  skillId: string; // maps to roadmap skill
  title: string;
  difficulty: CapstoneDifficulty;
  timeEstimate: string; // e.g., "2-3 weeks"
  expectedDeliverables: string[];
  overview: {
    description: string;
    outcomes: string[];
    prerequisites: string[];
  };
  checkpoints: CapstoneCheckpoint[];
  rubric: CapstoneRubric;
  features: {
    aiRoadmap: boolean;
    aiGuide: boolean;
    autoEvaluation: boolean;
  };
  status: 'Draft' | 'Published';
}

export interface GeneratedRoadmapPhase {
  id: string;
  title: string;
  description: string;
  checkpointId?: string;
  deadline?: string; // ISO date
  resources: Array<{ title: string; url: string }>;
}

export interface GeneratedRoadmap {
  phases: GeneratedRoadmapPhase[];
}

export interface CapstoneSubmission {
  id: string;
  capstoneId: string;
  skillId: string;
  submittedAt: string; // ISO date
  links: {
    repo?: string;
    report?: string;
    demo?: string;
  };
}

export interface EvaluationResultItem {
  rubricItemId: string;
  score: number; // 0-100 for that criterion
  feedback: string;
}

export interface EvaluationResult {
  totalScore: number; // 0-100
  items: EvaluationResultItem[];
  plagiarismPercent: number; // 0-100
  pass: boolean;
  feedbackSummary: string;
  evaluatedAt: string; // ISO date
}

// New template/instance model for advanced flow
export interface CapstoneTemplate {
  id: string;
  skillId: string;
  title: string;
  difficulty: CapstoneDifficulty;
  tags: string[];
  overview: {
    problem: string;
    objective: string;
  };
}

export type SubmissionType = 'Drive' | 'GitHub' | 'URL';

export interface CapstoneStageSpec {
  id: string;
  name: string;
  order: number;
  uiChecks: string[];
  validation: string[];
  expectedOutcome: string;
}

export interface CapstoneSubTaskSpec {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
}

export interface CapstoneTaskSpec {
  id: string;
  title: string;
  description: string;
  dependencies: string[];
  acceptanceCriteria: string[];
  subTasks: CapstoneSubTaskSpec[];
  stageId?: string; // optional mapping to a stage
}

export interface CapstoneSubProjectSpec {
  id: string;
  title: string;
  description: string;
  dependencies: string[];
  tasks: CapstoneTaskSpec[];
}

export interface CapstoneRoadmap {
  project: { title: string; summary: string };
  stages: CapstoneStageSpec[];
  subProjects: CapstoneSubProjectSpec[];
}

export interface CapstoneInstance {
  id: string;
  userId: string;
  tenantId?: string;
  templateId: string;
  skillId: string;
  status: 'Active' | 'Submitted' | 'Approved' | 'ChangesRequested';
  roadmap?: CapstoneRoadmap; // present after generation
  createdAt: string;
  updatedAt: string;
}

export interface CapstoneInstanceProgress {
  stages: Record<string, { done: boolean; checklist: Record<string, boolean> }>; // uiChecks/validation toggles
  // Optional task completion map keyed by task id (Kanban cards)
  tasks?: Record<string, boolean>;
}

export interface InstanceSubmission {
  id: string;
  instanceId: string;
  type: SubmissionType;
  link: string;
  notes?: string;
  submittedAt: string;
  status: 'New' | 'Pending Review' | 'Changes Requested' | 'Approved';
  tenantId?: string;
  ownerVisible: boolean;
  tenantAdminVisible: boolean;
}
