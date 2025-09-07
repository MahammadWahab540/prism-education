import { z } from "zod";

export const ModeSchema = z.enum(["mock", "production"]);
export type Mode = z.infer<typeof ModeSchema>;

export const DifficultySchema = z.enum(["Beginner", "Intermediate", "Advanced"]);
export type Difficulty = z.infer<typeof DifficultySchema>;

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

export const StageSchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number().int(),
  uiChecks: z.array(z.string()),
  validation: z.array(z.string()),
  expectedOutcome: z.string(),
});
export type Stage = z.infer<typeof StageSchema>;

export const SubTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  acceptanceCriteria: z.array(z.string()),
});
export type SubTask = z.infer<typeof SubTaskSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dependencies: z.array(z.string()),
  acceptanceCriteria: z.array(z.string()),
  subTasks: z.array(SubTaskSchema),
  stageId: z.string(),
});
export type Task = z.infer<typeof TaskSchema>;

export const SubProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dependencies: z.array(z.string()),
  tasks: z.array(TaskSchema).min(3),
});
export type SubProject = z.infer<typeof SubProjectSchema>;

export const SubmissionSchema = z.object({
  type: z.enum(["Drive", "GitHub", "URL"]),
  link: z.string(),
  notes: z.string(),
  visibleTo: z.object({
    platformOwner: z.boolean(),
    tenantAdmin: z.boolean(),
  }),
});
export type Submission = z.infer<typeof SubmissionSchema>;

export const InstanceSchema = z.object({
  status: z.enum(["Active", "Submitted", "Approved", "ChangesRequested"]),
  templateId: z.string(),
  instanceId: z.string(),
  project: z.object({
    title: z.string(),
    summary: z.string(),
  }),
  stages: z.array(StageSchema).min(5).max(7),
  subProjects: z.array(SubProjectSchema).min(2),
  submission: SubmissionSchema,
});
export type Instance = z.infer<typeof InstanceSchema>;

export const CapstoneResponseSchema = z.object({
  mode: ModeSchema,
  skill: z.string(),
  suggestions: z.array(SuggestionSchema).length(4),
  selectionPolicy: SelectionPolicySchema,
  instance: InstanceSchema,
});
export type CapstoneResponse = z.infer<typeof CapstoneResponseSchema>;

export function assertValidCapstoneResponse(value: unknown): CapstoneResponse {
  return CapstoneResponseSchema.parse(value);
}

