import { CapstoneResponse, CapstoneResponseSchema, Instance, Stage, Suggestion } from "../types/capstone";

type BuildParams = {
  skill: string;
  selectedTemplateId: string;
  tenantId?: string;
  userId?: string;
};

const randId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function buildSuggestions(skill: string): Suggestion[] {
  const skillTag = skill && skill.trim().length > 0 ? skill : "General";
  return [
    {
      id: "cap-app-001",
      title: `${skillTag} Capstone: Starter App` ,
      difficulty: "Beginner",
      tags: [skillTag, "Scaffold", "CI/CD"],
      overview: {
        problem: "Learners need a guided path to set up a production-ready project skeleton.",
        objective: "Deliver a working scaffold with CI, linting, auth stub, and a demo feature.",
      },
    },
    {
      id: "cap-core-002",
      title: `${skillTag} Capstone: Core Feature Delivery`,
      difficulty: "Intermediate",
      tags: [skillTag, "CRUD", "Testing", "DX"],
      overview: {
        problem: "Core domain features are often slow to validate without a focused plan.",
        objective: "Ship a robust CRUD module with tests, pagination, and error handling.",
      },
    },
    {
      id: "cap-adv-003",
      title: `${skillTag} Capstone: Advanced Integrations`,
      difficulty: "Advanced",
      tags: [skillTag, "Integrations", "Observability"],
      overview: {
        problem: "Integrations add risk around reliability, performance, and monitoring.",
        objective: "Integrate with an external API and add observability to ensure resilience.",
      },
    },
    {
      id: "cap-exp-004",
      title: `${skillTag} Capstone: Experience Polish`,
      difficulty: "Intermediate",
      tags: [skillTag, "UX", "Accessibility", "Perf"],
      overview: {
        problem: "Projects often lack the UX and accessibility polish needed for production.",
        objective: "Improve UX, accessibility, and performance to production-ready quality.",
      },
    },
  ];
}

function buildStages(): Stage[] {
  return [
    {
      id: "stage-1",
      name: "Scope & Scaffold",
      order: 1,
      uiChecks: ["Repo created", "ENV set", "CI configured"],
      validation: ["Build passes", "Lint passes"],
      expectedOutcome: "Working scaffold with CI and project board.",
    },
    {
      id: "stage-2",
      name: "Auth & Roles",
      order: 2,
      uiChecks: ["Login visible", "Protected routes"],
      validation: ["Session persists", "Unauthorized redirects"],
      expectedOutcome: "Role-based access working end-to-end.",
    },
    {
      id: "stage-3",
      name: "Core Feature",
      order: 3,
      uiChecks: ["Create/Edit forms", "List & detail views"],
      validation: ["CRUD tests green", "Pagination works"],
      expectedOutcome: "Stable CRUD with validation and pagination.",
    },
    {
      id: "stage-4",
      name: "Integration/Automation",
      order: 4,
      uiChecks: ["Integration toggles", "Background jobs"],
      validation: ["Jobs run in sandbox", "Error handling present"],
      expectedOutcome: "Integration jobs scheduled and monitored.",
    },
    {
      id: "stage-5",
      name: "Polish & Submit",
      order: 5,
      uiChecks: ["Empty states", "Loading states", "Accessibility pass"],
      validation: ["Lighthouse ≥ 85", "Happy-path E2E green"],
      expectedOutcome: "Production-ready demo + submission link.",
    },
  ];
}

function buildInstanceFromSuggestion(skill: string, s: Suggestion): Instance {
  const stages = buildStages();
  const projectTitle = s.title;
  const projectSummary = s.overview.objective;

  const sp1 = {
    id: "sp-foundation",
    title: "Foundation & Setup",
    description: "Project scaffold, environments, and developer experience.",
    dependencies: [] as string[],
    tasks: [
      {
        id: "t-repo-ci",
        title: "Repo & CI",
        description: "Initialize repo, branch protection, and CI pipeline.",
        dependencies: [],
        acceptanceCriteria: ["CI runs on PR", "Branch protections applied"],
        subTasks: [
          {
            id: "st-ci-lint",
            title: "Lint & Typecheck",
            description: "Add lint and typecheck steps to CI.",
            acceptanceCriteria: ["CI reports lint & type errors"],
          },
        ],
        stageId: "stage-1",
      },
      {
        id: "t-env-config",
        title: "ENV & Config",
        description: "Set up dev/prod environment variables and config loader.",
        dependencies: ["t-repo-ci"],
        acceptanceCriteria: [".env.example committed", "Runtime config validated"],
        subTasks: [
          {
            id: "st-config-validate",
            title: "Config Validation",
            description: "Add schema validation for required env keys.",
            acceptanceCriteria: ["Boot fails on missing keys"],
          },
        ],
        stageId: "stage-1",
      },
      {
        id: "t-auth-stub",
        title: "Auth Stub",
        description: "Implement basic auth and role guard.",
        dependencies: ["t-repo-ci"],
        acceptanceCriteria: ["Login/Logout works", "Protected routes enforced"],
        subTasks: [
          {
            id: "st-role-guard",
            title: "Role Guard",
            description: "Protect routes by role.",
            acceptanceCriteria: ["Unauthorized redirected"],
          },
        ],
        stageId: "stage-2",
      },
    ],
  };

  const sp2 = {
    id: "sp-core",
    title: "Core Feature Delivery",
    description: `Build and validate the core ${skill} feature set.`,
    dependencies: ["sp-foundation"],
    tasks: [
      {
        id: "t-crud",
        title: "CRUD Module",
        description: "Create, list, edit, delete for primary entity.",
        dependencies: ["t-auth-stub"],
        acceptanceCriteria: ["CRUD tests pass", "Form validation present", "Pagination 10/page"],
        subTasks: [
          {
            id: "st-list-view",
            title: "List View",
            description: "Paginated list with empty/loading states.",
            acceptanceCriteria: ["Pagination works", "States visible"],
          },
        ],
        stageId: "stage-3",
      },
      {
        id: "t-integration",
        title: "External Integration",
        description: "Integrate with a public API and handle errors.",
        dependencies: ["t-crud"],
        acceptanceCriteria: ["Retries/backoff implemented", "Errors surfaced to user"],
        subTasks: [
          {
            id: "st-job-schedule",
            title: "Background Job",
            description: "Schedule sync or reminder task.",
            acceptanceCriteria: ["Job runs in sandbox", "Opt-out respected"],
          },
        ],
        stageId: "stage-4",
      },
      {
        id: "t-polish",
        title: "Polish & QA",
        description: "Accessibility, performance, and final QA.",
        dependencies: ["t-integration"],
        acceptanceCriteria: ["Lighthouse ≥ 85", "Keyboard navigation works"],
        subTasks: [
          {
            id: "st-a11y-pass",
            title: "Accessibility Pass",
            description: "Audit color contrast, landmarks, and focus states.",
            acceptanceCriteria: ["No critical a11y issues"],
          },
        ],
        stageId: "stage-5",
      },
    ],
  };

  const submissionLink = `https://example.com/demo/${slugify(projectTitle)}`;

  const instance: Instance = {
    status: "Active",
    templateId: s.id,
    instanceId: randId("inst"),
    project: {
      title: projectTitle,
      summary: projectSummary,
    },
    stages,
    subProjects: [sp1, sp2],
    submission: {
      type: "URL",
      link: submissionLink,
      notes: "Replace with Drive/GitHub/URL in production.",
      visibleTo: { platformOwner: true, tenantAdmin: true },
    },
  };

  return instance;
}

export function buildMockCapstoneResponse(params: BuildParams): CapstoneResponse {
  const { skill, selectedTemplateId } = params;

  const suggestions = buildSuggestions(skill);
  const selected = suggestions.find((s) => s.id === selectedTemplateId) ?? suggestions[0];

  const instance = buildInstanceFromSuggestion(skill, selected);

  const response: CapstoneResponse = {
    mode: "mock",
    skill,
    suggestions,
    selectionPolicy: { minSelect: 1, maxSelect: 1 },
    instance,
  };

  // Validate strictly before returning
  return CapstoneResponseSchema.parse(response);
}

