import { z } from 'zod';
import type { CapstoneRoadmap, CapstoneStageSpec, CapstoneSubProjectSpec } from '@/types/capstone';

// Full "Master Prompt — Capstone Generator" (to use as system)
export const CAPSTONE_ORCHESTRATOR_SYSTEM_PROMPT = `
Role & Goal
You are CapstoneOrchestrator. Given a learner’s skill, return:

1. Exactly 4 Capstone suggestions.
2. When a suggestion is selected, create a CapstoneInstance and a complete Activities/Roadmap so the UI can render immediately (no “Instance not found”).
3. In production, all content must be AI-generated; for local/dev, also produce mock data if requested.

Rules
* Always produce valid JSON matching the schemas below.
* Include overview.problem and overview.objective for each suggestion.
* After selection, return an instance object with stages → tasks → subtasks plus UI checks, validation, expectedOutcome per stage.
* Activities must be concrete and actionable. Keep tasks ≤ 4h effort each.
* Enforce: user must select at least 1 capstone (min=1).
* Submissions are link-based (Drive/GitHub/URL). Provide a submission placeholder.
* Never leave null required fields.

Schemas (strict)
{
  "type": "object",
  "required": ["mode", "skill", "suggestions", "selectionPolicy", "instance"],
  "properties": {
    "mode": { "type": "string", "enum": ["mock", "production"] },
    "skill": { "type": "string" },
    "suggestions": {
      "type": "array",
      "minItems": 4,
      "maxItems": 4,
      "items": {
        "type": "object",
        "required": ["id", "title", "difficulty", "tags", "overview"],
        "properties": {
          "id": { "type": "string" },
          "title": { "type": "string" },
          "difficulty": { "type": "string", "enum": ["Beginner","Intermediate","Advanced"] },
          "tags": { "type": "array", "items": { "type": "string" } },
          "overview": {
            "type": "object",
            "required": ["problem", "objective"],
            "properties": {
              "problem": { "type": "string" },
              "objective": { "type": "string" }
            }
          }
        }
      }
    },
    "selectionPolicy": {
      "type": "object",
      "required": ["minSelect", "maxSelect"],
      "properties": {
        "minSelect": { "type": "integer", "minimum": 1 },
        "maxSelect": { "type": "integer", "minimum": 1 }
      }
    },
    "instance": {
      "type": "object",
      "required": [
        "status","templateId","instanceId","project",
        "stages","subProjects","submission"
      ],
      "properties": {
        "status": { "type": "string", "enum": ["Active","Submitted","Approved","ChangesRequested"] },
        "templateId": { "type": "string" },
        "instanceId": { "type": "string" },
        "project": {
          "type": "object",
          "required": ["title","summary"],
          "properties": {
            "title": { "type": "string" },
            "summary": { "type": "string" }
          }
        },
        "stages": {
          "type": "array",
          "minItems": 5,
          "maxItems": 7,
          "items": {
            "type": "object",
            "required": ["id","name","order","uiChecks","validation","expectedOutcome"],
            "properties": {
              "id": { "type": "string" },
              "name": { "type": "string" },
              "order": { "type": "integer" },
              "uiChecks": { "type": "array", "items": { "type": "string" } },
              "validation": { "type": "array", "items": { "type": "string" } },
              "expectedOutcome": { "type": "string" }
            }
          }
        },
        "subProjects": {
          "type": "array",
          "minItems": 2,
          "items": {
            "type": "object",
            "required": ["id","title","description","dependencies","tasks"],
            "properties": {
              "id": { "type": "string" },
              "title": { "type": "string" },
              "description": { "type": "string" },
              "dependencies": { "type": "array", "items": { "type": "string" } },
              "tasks": {
                "type": "array",
                "minItems": 3,
                "items": {
                  "type": "object",
                  "required": ["id","title","description","dependencies","acceptanceCriteria","subTasks","stageId"],
                  "properties": {
                    "id": { "type": "string" },
                    "title": { "type": "string" },
                    "description": { "type": "string" },
                    "dependencies": { "type": "array", "items": { "type": "string" } },
                    "acceptanceCriteria": { "type": "array", "items": { "type": "string" } },
                    "subTasks": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "required": ["id","title","description","acceptanceCriteria"],
                        "properties": {
                          "id": { "type": "string" },
                          "title": { "type": "string" },
                          "description": { "type": "string" },
                          "acceptanceCriteria": { "type": "array", "items": { "type": "string" } }
                        }
                      }
                    },
                    "stageId": { "type": "string" }
                  }
                }
              }
            }
          }
        },
        "submission": {
          "type": "object",
          "required": ["type","link","notes","visibleTo"],
          "properties": {
            "type": { "type": "string", "enum": ["Drive","GitHub","URL"] },
            "link": { "type": "string" },
            "notes": { "type": "string" },
            "visibleTo": {
              "type": "object",
              "required": ["platformOwner","tenantAdmin"],
              "properties": {
                "platformOwner": { "type": "boolean" },
                "tenantAdmin": { "type": "boolean" }
              }
            }
          }
        }
      }
    }
  }
}

Generation Modes
* mode = "mock": Fabricate realistic suggestions + a complete instance with activities (use placeholder links).
* mode = "production": Generate contextually using real learner/skill data; never use placeholders.

Stage Guide Prompt (attach per stage)
* Provide concise help, ask 3–5 clarifying questions, enforce acceptanceCriteria, end with a checklist for the expectedOutcome.
`;

export const buildDeveloperPrompt = (opts: {
  skill: string;
  tenantId: string;
  userId: string;
  mode?: 'mock' | 'production';
  selectedTemplateId: string;
}) => `
Context:
- skill: "${opts.skill}"
- tenantId: "${opts.tenantId}"
- userId: "${opts.userId}"
- mode: "${opts.mode ?? 'mock'}"   // switch to "production" in prod

Requirements:
1) Return 4 capstone suggestions.
2) selectionPolicy: { "minSelect": 1, "maxSelect": 1 }.
3) Assume the user selects suggestion with id "${opts.selectedTemplateId}".
4) Create a CapstoneInstance with full stages, tasks, and subtasks so UI can render activities immediately.
5) Ensure submission is link-based with visibility to Platform Owner and Tenant Admin.
6) All outputs MUST match the JSON schemas.

Output:
Return a SINGLE JSON object with keys:
- mode, skill, suggestions[], selectionPolicy, instance
`;

// Zod schemas matching the provided JSON schema
const SuggestionZ = z.object({
  id: z.string(),
  title: z.string(),
  difficulty: z.enum(['Beginner','Intermediate','Advanced']),
  tags: z.array(z.string()),
  overview: z.object({ problem: z.string(), objective: z.string() }),
});

const StageZ = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number(),
  uiChecks: z.array(z.string()),
  validation: z.array(z.string()),
  expectedOutcome: z.string(),
});

const SubTaskZ = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  acceptanceCriteria: z.array(z.string()),
});

const TaskZ = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dependencies: z.array(z.string()),
  acceptanceCriteria: z.array(z.string()),
  subTasks: z.array(SubTaskZ),
  stageId: z.string(),
});

const SubProjectZ = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dependencies: z.array(z.string()),
  tasks: z.array(TaskZ).min(3),
});

const InstanceZ = z.object({
  status: z.enum(['Active','Submitted','Approved','ChangesRequested']),
  templateId: z.string(),
  instanceId: z.string(),
  project: z.object({ title: z.string(), summary: z.string() }),
  stages: z.array(StageZ).min(5).max(7),
  subProjects: z.array(SubProjectZ).min(2),
  submission: z.object({
    type: z.enum(['Drive','GitHub','URL']),
    link: z.string().url().or(z.string().startsWith('http')),
    notes: z.string(),
    visibleTo: z.object({ platformOwner: z.boolean(), tenantAdmin: z.boolean() }),
  }),
});

export const OrchestrationZ = z.object({
  mode: z.enum(['mock','production']),
  skill: z.string(),
  suggestions: z.array(SuggestionZ).min(4).max(4),
  selectionPolicy: z.object({ minSelect: z.number().min(1), maxSelect: z.number().min(1) }),
  instance: InstanceZ,
});

export type Orchestration = z.infer<typeof OrchestrationZ>;

export function validateOrchestration(payload: unknown): Orchestration {
  return OrchestrationZ.parse(payload);
}

export interface BuildMockArgs {
  skill: string;
  userId: string;
  tenantId?: string;
  mode?: 'mock' | 'production';
  selectedTemplateId?: string;
}

const urlSafe = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24);

export function buildMockOrchestration(args: BuildMockArgs): Orchestration {
  const mode = args.mode || 'mock';
  const skill = args.skill;
  // Four suggestions aligned to the skill
  const base = urlSafe(skill || 'capstone');
  const suggestions = [
    { id: `${base}-a`, title: `${skill} Project A`, difficulty: 'Intermediate', tags: ['Auth','CRUD','CI'], overview: { problem: 'Lack of centralization.', objective: 'Build role-based app with CRUD.' } },
    { id: `${base}-b`, title: `${skill} Project B`, difficulty: 'Beginner', tags: ['UI','Charts'], overview: { problem: 'Insights missing.', objective: 'Deliver dashboard with charts.' } },
    { id: `${base}-c`, title: `${skill} Project C`, difficulty: 'Advanced', tags: ['Workers','Search'], overview: { problem: 'Data scattered.', objective: 'Aggregate and index data with search.' } },
    { id: `${base}-d`, title: `${skill} Project D`, difficulty: 'Intermediate', tags: ['Embeddings','LLM'], overview: { problem: 'Static study plans.', objective: 'Generate adaptive plans with LLMs.' } },
  ] as const;

  const selected = suggestions.find(s => s.id === args.selectedTemplateId) || suggestions[0];
  const numStages = 5;
  const stages = Array.from({ length: numStages }, (_, i) => ({
    id: `stage-${i + 1}`,
    name: i === 0 ? 'Scope & Scaffold' : i === numStages - 1 ? 'Polish & Submit' : `Stage ${i + 1}`,
    order: i + 1,
    uiChecks: i === 0 ? ['Repo created','ENV set','Design tokens added'] : ['Checklist updated'],
    validation: i === 0 ? ['CI green','Lint configured'] : ['All acceptance criteria met'],
    expectedOutcome: i === 0 ? 'Working scaffold with CI/CD and issue board.' : i === numStages - 1 ? 'Production-ready demo + submission link.' : 'Stage objectives met.',
  }));

  const subProjects = [0,1].map(spi => ({
    id: `sp-${spi + 1}`,
    title: spi === 0 ? 'Core Functionality' : 'Data Layer & Integrations',
    description: spi === 0 ? 'Implement core UX and flows.' : 'Persist data and integrate services.',
    dependencies: spi === 0 ? [] : ['sp-1'],
    tasks: [0,1,2].map(ti => ({
      id: `t-${spi + 1}-${ti + 1}`,
      title: `Task ${ti + 1}`,
      description: 'Atomic task (≤4h) with tests.',
      dependencies: ti === 0 ? [] : [`t-${spi + 1}-${ti}`],
      acceptanceCriteria: ['Unit tests pass','Meets DoD'],
      subTasks: [
        { id: `st-${spi + 1}-${ti + 1}-1`, title: 'Scaffold', description: 'Initial structure', acceptanceCriteria: ['Build succeeds'] },
        { id: `st-${spi + 1}-${ti + 1}-2`, title: 'Implement', description: 'Core logic', acceptanceCriteria: ['Tests pass'] },
      ],
      stageId: stages[(spi + ti) % stages.length].id,
    })),
  }));

  const instanceId = `inst-${urlSafe(selected.id)}-` + Math.random().toString(36).slice(2, 6);

  const orchestration: Orchestration = {
    mode,
    skill,
    suggestions: suggestions.slice(0, 4) as any,
    selectionPolicy: { minSelect: 1, maxSelect: 1 },
    instance: {
      status: 'Active',
      templateId: selected.id,
      instanceId,
      project: { title: selected.title, summary: selected.overview.objective },
      stages,
      subProjects,
      submission: { type: 'URL', link: 'https://example.com/placeholder', notes: 'Replace with Drive/GitHub/URL', visibleTo: { platformOwner: true, tenantAdmin: true } },
    },
  };

  // Validate before returning
  return validateOrchestration(orchestration);
}

export function orchestrationToRoadmap(o: Orchestration): CapstoneRoadmap {
  return {
    project: { title: o.instance.project.title, summary: o.instance.project.summary },
    stages: o.instance.stages as unknown as CapstoneStageSpec[],
    subProjects: o.instance.subProjects as unknown as CapstoneSubProjectSpec[],
  };
}
