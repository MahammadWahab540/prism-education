// capstone-models.ts
import { z } from "zod";

/* =========================
 * Shared enums / aliases
 * ========================= */

export const ModeSchema = z.enum(["mock", "production"]);
export type Mode = z.infer<typeof ModeSchema>;

export const DifficultySchema = z.enum(["Beginner", "Intermediate", "Advanced"]);
export type Difficulty = z.infer<typeof DifficultySchema>;

// DEV alias preserved
export type CapstoneDifficulty = Difficulty;

/* =========================
 * DEV: Core Capstone config
 * ========================= */

export const CapstoneCheckpointSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  requiredDeliverables: z.array(z.enum(["repo", "report", "demo"])),
  dueDaysOffset: z.number().int().optional(), // days from start
});
export type CapstoneCheckpoint = z.infer<typeof CapstoneCheckpointSchema>;

export const CapstoneRubricItemSchema = z.object({
  id: z.string(),
  criterion: z.string(),
  weight: z.number().min(0).max(100), // sums should be validated externally
  description: z.string().optional(),
});
export type CapstoneRubricItem = z.infer<typeof CapstoneRubricItemSchema>;

export const CapstoneRubricSchema = z.object({
  items: z.array(CapstoneRubricItemSchema),
});
export type CapstoneRubric = z.infer<typeof CapstoneRubricSchema>;

export const CapstoneConfigSchema = z.object({
  id: z.string(),
  skillId: z.string(), // maps to roadmap skill
  title: z.string(),
  difficulty: DifficultySchema,
  timeEstimate: z.string(), // e.g., "2-3 weeks"
  expectedDeliverables: z.array(z.string()),
  overview: z.object({
    description: z.string(),
    outcomes: z.array(z.string()),
    prerequisites: z.array(z.string()),
  }),
  checkpoints: z.array(CapstoneCheckpointSchema),
  rubric: CapstoneRubricSchema,
  features: z.object({
    aiRoadmap: z.boolean(),
    aiGuide: z.boolean(),
    autoEvaluation: z.boolean(),
  }),
  status: z.enum(["Draft", "Published"]),
});
export type CapstoneConfig = z.infer<typeof CapstoneConfigSchema>;

/* =========================
 * DEV: Generated Roadmap
 * ========================= */

export const GeneratedRoadmapPhaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  checkpointId: z.string().optional(),
  deadline: z.string().datetime().optional(), // ISO
  resources: z.array(z.object({ title: z.string(), url: z.string().url() })),
});
export type GeneratedRoadmapPhase = z.infer<typeof GeneratedRoadmapPhaseSchema>;

export const GeneratedRoadmapSchema = z.object({
  phases: z.array(GeneratedRoadmapPhaseSchema),
});
export type GeneratedRoadmap = z.infer<typeof GeneratedRoadmapSchema>;

/* =========================
 * DEV: Submissions (simple)
 * ========================= */

export const CapstoneSubmissionSchema = z.object({
  id: z.string(),
  capstoneId: z.string(),
  skillId: z.string(),
  submittedAt: z.string().datetime(),
  links: z.object({
    repo: z.string().url().optional(),
    report: z.string().url().optional(),
    demo: z.string().url().optional(),
  }),
});
export type CapstoneSubmission = z.infer<typeof CapstoneSubmissionSchema>;

/* =========================
 * DEV: Evaluation results
 * ========================= */

export const EvaluationResultItemSchema = z.object({
  rubricItemId: z.string(),
  score: z.number().min(0).max(100),
  feedback: z.string(),
});
export type EvaluationResultItem = z.infer<typeof EvaluationResultItemSchema>;

export const EvaluationResultSchema = z.object({
  totalScore: z.number().min(0).max(100),
  items: z.array(EvaluationResultItemSchema),
  plagiarismPercent: z.number().min(0).max(100),
  pass: z.boolean(),
  feedbackSummary: z.string(),
  evaluatedAt: z.string().datetime(),
});
export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;

/* =========================
 * DEV: Template model
 * ========================= */

export const CapstoneTemplateSchema = z.object({
  id: z.string(),
  skillId: z.string(),
  title: z.string(),
  difficulty: DifficultySchema,
  tags: z.array(z.string()),
  overview: z.object({
    problem: z.string(),
    objective: z.string(),
  }),
});
export type CapstoneTemplate = z.infer<typeof CapstoneTemplateSchema>;

/* =========================
 * DEV: Advanced roadmap spec
 * ========================= */

export const SubmissionTypeSchema = z.enum(["Drive", "GitHub", "URL"]);
export type SubmissionType = z.infer<typeof SubmissionTypeSchema>;

export const CapstoneStageSpecSchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number().int(),
  uiChecks: z.array(z.string()),
  validation: z.array(z.string()),
  expectedOutcome: z.string(),
});
export type CapstoneStageSpec = z.infer<typeof CapstoneStageSpecSchema>;

export const CapstoneSubTaskSpecSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  acceptanceCriteria: z.array(z.string()),
});
export type CapstoneSubTaskSpec = z.infer<typeof CapstoneSubTaskSpecSchema>;

export const CapstoneTaskSpecSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dependencies: z.array(z.string()),
  acceptanceCriteria: z.array(z.string()),
  subTasks: z.array(CapstoneSubTaskSpecSchema),
  stageId: z.string().optional(), // DEV had optional
});
export type CapstoneTaskSpec = z.infer<typeof CapstoneTaskSpecSchema>;

export const CapstoneSubProjectSpecSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dependencies: z.array(z.string()),
  tasks: z.array(CapstoneTaskSpecSchema),
});
export type CapstoneSubProjectSpec = z.infer<typeof CapstoneSubProjectSpecSchema>;

export const CapstoneRoadmapSchema = z.object({
  project: z.object({ title: z.string(), summary: z.string() }),
  stages: z.array(CapstoneStageSpecSchema),
  subProjects: z.array(CapstoneSubProjectSpecSchema),
});
export type CapstoneRoadmap = z.infer<typeof CapstoneRoadmapSchema>;

/* =========================
 * DEV: Instance + Progress
 * ========================= */

export const CapstoneInstanceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  tenantId: z.string().optional(),
  templateId: z.string(),
  skillId: z.string(),
  status: z.enum(["Active", "Submitted", "Approved", "ChangesRequested"]),
  roadmap: CapstoneRoadmapSchema.optional(), // present after generation
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type CapstoneInstance = z.infer<typeof CapstoneInstanceSchema>;

export const CapstoneInstanceProgressSchema = z.object({
  stages: z.record(
    z.object({
      done: z.boolean(),
      checklist: z.record(z.boolean()),
    })
  ),
  tasks: z.record(z.boolean()).optional(),
});
export type CapstoneInstanceProgress = z.infer<typeof CapstoneInstanceProgressSchema>;

/* =========================
 * DEV: Instance submission (advanced)
 * ========================= */

export const InstanceSubmissionSchema = z.object({
  id: z.string(),
  instanceId: z.string(),
  type: SubmissionTypeSchema,
  link: z.string(),
  notes: z.string().optional(),
  submittedAt: z.string().datetime(),
  status: z.enum(["New", "Pending Review", "Changes Requested", "Approved"]),
  tenantId: z.string().optional(),
  ownerVisible: z.boolean(),
  tenantAdminVisible: z.boolean(),
  reviewers: z.array(z.string()).optional(),
  escalation: z
    .object({
      escalated: z.boolean(),
      reason: z.string().optional(),
      createdAt: z.string().datetime().optional(),
    })
    .optional(),
});
export type InstanceSubmission = z.infer<typeof InstanceSubmissionSchema>;

/* =========================
 * PROD: Suggestion & Response
 * (wired to DEV shapes where possible)
 * ========================= */

export const SuggestionOverviewSchema = z.object({
  problem: z.string(),
  objective: z.string(),
});

export const SuggestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  difficulty: DifficultySchema,
  tags: z.array(z.string()),
  overview: SuggestionOverviewSchema,
});
export type Suggestion = z.infer<typeof SuggestionSchema>;

export const SelectionPolicySchema = z.object({
  minSelect: z.number().int().min(1),
  maxSelect: z.number().int().min(1),
});
export type SelectionPolicy = z.infer<typeof SelectionPolicySchema>;

/**
 * CapstoneResponse:
 * - Keeps PROD structure (mode, suggestions, selectionPolicy)
 * - Uses DEV CapstoneInstance for `instance`
 */
export const CapstoneResponseSchema = z.object({
  mode: ModeSchema,
  skill: z.string(),
  suggestions: z.array(SuggestionSchema).length(4),
  selectionPolicy: SelectionPolicySchema,
  instance: CapstoneInstanceSchema,
});
export type CapstoneResponse = z.infer<typeof CapstoneResponseSchema>;

/* =========================
 * Helpers
 * ========================= */

export function assertValidCapstoneResponse(value: unknown): CapstoneResponse {
  return CapstoneResponseSchema.parse(value);
}

export function assertValidCapstoneConfig(value: unknown): CapstoneConfig {
  return CapstoneConfigSchema.parse(value);
}

export function assertValidCapstoneInstance(value: unknown): CapstoneInstance {
  return CapstoneInstanceSchema.parse(value);
}

export function assertValidInstanceSubmission(value: unknown): InstanceSubmission {
  return InstanceSubmissionSchema.parse(value);
}