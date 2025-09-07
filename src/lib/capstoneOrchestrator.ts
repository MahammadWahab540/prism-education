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

// Input schema for the orchestrator
export interface OrchestratorInput {
  mode: 'production' | 'mock';
  learner: { userId: string; tenantId?: string };
  skill: { name: string; level: string; tags: string[] };
  learningRoadmapProgress: {
    stages: Array<{ id: string; name: string; done: boolean }>;
    allDone: boolean;
    percent: number;
  };
  selectedTemplateId: string | null;
  constraints?: { time?: string; tools?: string };
}

// Three possible output states
export type LockedState = {
  status: 'LOCKED';
  reason: string;
  unlockHint: string[];
  nextAction: string;
};

export type UnlockedState = {
  status: 'UNLOCKED';
  skill: string;
  selectionPolicy: { minSelect: number; maxSelect: number };
  suggestions: Array<{
    id: string;
    title: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    tags: string[];
    overview: { problem: string; objective: string };
    whyFit: string;
  }>;
};

export type InstanceState = {
  status: 'INSTANCE';
  mode: 'production' | 'mock';
  skill: { name: string; level: string; tags: string[] };
  instance: {
    instanceId: string;
    templateId: string;
    status: 'Active' | 'Submitted' | 'Approved' | 'ChangesRequested';
    project: { title: string; summary: string };
    progress: { totalStages: number; completedStages: number; percent: number };
    stages: Array<{
      id: string;
      name: string;
      order: number;
      logic: { entryCriteria: string[]; doneWhen: string[] };
      uiChecks: string[];
      validation: string[];
      expectedOutcome: string;
    }>;
    subProjects: Array<{
      id: string;
      title: string;
      description: string;
      dependencies: string[];
      tasks: Array<{
        id: string;
        title: string;
        description: string;
        dependencies: string[];
        acceptanceCriteria: string[];
        subTasks: Array<{
          id: string;
          title: string;
          description: string;
          acceptanceCriteria: string[];
        }>;
        stageId: string;
      }>;
    }>;
    guide: {
      perStageGuide: Array<{
        stageId: string;
        coachRules: {
          clarifyingQuestions: number;
          stepsStyle: string;
          smallestNextActionMinutes: number;
          enforceAcceptanceCriteria: boolean;
          endWithChecklistAlignedToExpectedOutcome: boolean;
        };
      }>;
    };
    submission: {
      type: 'GitHub' | 'Drive' | 'URL';
      link: string;
      notes: string;
      visibleTo: { platformOwner: boolean; tenantAdmin: boolean };
      uiCopy: string;
    };
    events: {
      onSelect: { message: string; auditTrail: { at: string; actor: string; action: string } };
      onStageComplete: { rule: string; progressComputation: string };
      onSubmit: {
        emits: Array<{
          type: 'SUBMISSION_CREATED';
          payload: {
            instanceId: string;
            studentId: string;
            tenantId?: string;
            skill: string;
            capstoneTitle: string;
            stagePercent: number;
            link: string;
            status: string;
            submittedAt: string;
            visibleTo: { platformOwner: boolean; tenantAdmin: boolean };
          };
          targets: string[];
        }>;
      };
    };
  };
};

export type OrchestratorOutput = LockedState | UnlockedState | InstanceState;

// Main orchestrator function implementing the three-state system
export function orchestrateCapstone(input: OrchestratorInput): OrchestratorOutput {
  // State 1: LOCKED - Learner hasn't completed all roadmap stages
  if (!input.learningRoadmapProgress.allDone) {
    const incompleteStages = input.learningRoadmapProgress.stages
      .filter(stage => !stage.done)
      .map(stage => stage.name);
    
    return {
      status: 'LOCKED',
      reason: 'Complete all roadmap stages to unlock Capstone.',
      unlockHint: incompleteStages.map(name => `Finish Stage ${name} tasks and assessments`),
      nextAction: 'Return when learningRoadmapProgress.allDone is true.'
    };
  }

  // State 2: UNLOCKED - Ready but no template selected (show suggestions)
  if (input.selectedTemplateId === null) {
    const skillName = input.skill.name;
    const base = urlSafe(skillName);
    
    return {
      status: 'UNLOCKED',
      skill: skillName,
      selectionPolicy: { minSelect: 1, maxSelect: 1 },
      suggestions: [
        {
          id: `cap-${base}-001`,
          title: `Interactive ${skillName} Platform`,
          difficulty: 'Intermediate',
          tags: ['Full-Stack', 'Authentication', 'Real-time'],
          overview: {
            problem: 'Users need a centralized platform for interactive collaboration.',
            objective: 'Build a full-featured platform with user management and real-time features.'
          },
          whyFit: `Perfect for applying ${skillName} concepts in a real-world scenario with modern architecture patterns.`
        },
        {
          id: `cap-${base}-002`,
          title: `${skillName} Analytics Dashboard`,
          difficulty: 'Beginner',
          tags: ['Data Visualization', 'Charts', 'API Integration'],
          overview: {
            problem: 'Complex data lacks visual representation and insights.',
            objective: 'Create an interactive dashboard with comprehensive data visualization.'
          },
          whyFit: `Excellent for practicing ${skillName} with data handling and visualization libraries.`
        },
        {
          id: `cap-${base}-003`,
          title: `Advanced ${skillName} Microservices`,
          difficulty: 'Advanced',
          tags: ['Microservices', 'Docker', 'CI/CD'],
          overview: {
            problem: 'Monolithic applications struggle with scalability and maintainability.',
            objective: 'Design and implement a distributed microservices architecture.'
          },
          whyFit: `Challenges you to apply advanced ${skillName} patterns in distributed systems.`
        },
        {
          id: `cap-${base}-004`,
          title: `AI-Powered ${skillName} Assistant`,
          difficulty: 'Advanced',
          tags: ['AI Integration', 'Natural Language', 'Machine Learning'],
          overview: {
            problem: 'Users need intelligent automation for complex workflow management.',
            objective: 'Build an AI-powered assistant with natural language processing capabilities.'
          },
          whyFit: `Combines ${skillName} expertise with cutting-edge AI technologies and modern development practices.`
        }
      ]
    };
  }

  // State 3: INSTANCE - Template selected, return complete instance
  return generateCapstoneInstance(input);
}

// Helper function to generate a complete capstone instance
function generateCapstoneInstance(input: OrchestratorInput): InstanceState {
  const skillName = input.skill.name;
  const instanceId = `inst-${urlSafe(input.selectedTemplateId!)}-${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date().toISOString();
  
  // Generate stages with detailed structure
  const stages = [
    {
      id: 'stage-1',
      name: 'Setup & Foundational Scaffolding',
      order: 1,
      logic: {
        entryCriteria: ['Roadmap complete', 'GitHub repository created'],
        doneWhen: ['All validation points pass']
      },
      uiChecks: ['Repo is public', 'Base application renders', 'Database connection successful'],
      validation: ['CI pipeline passes', 'Initial DB migration succeeds', 'Linting checks pass'],
      expectedOutcome: `A scaffolded ${skillName} application with connected database, version-controlled in GitHub, and functioning CI/CD pipeline.`
    },
    {
      id: 'stage-2',
      name: 'Core Architecture & Authentication',
      order: 2,
      logic: {
        entryCriteria: ['Stage 1 complete'],
        doneWhen: ['Authentication system functional', 'Core routes established']
      },
      uiChecks: ['User registration works', 'Login/logout functional', 'Protected routes active'],
      validation: ['Authentication tests pass', 'Session management works', 'Role-based access implemented'],
      expectedOutcome: 'Fully functional authentication system with user management and role-based access control.'
    },
    {
      id: 'stage-3',
      name: 'Core Feature Implementation',
      order: 3,
      logic: {
        entryCriteria: ['Stage 2 complete', 'Authentication working'],
        doneWhen: ['Primary features implemented', 'CRUD operations functional']
      },
      uiChecks: ['Main features accessible', 'Data operations work', 'UI responsive'],
      validation: ['Feature tests pass', 'Data validation works', 'Error handling implemented'],
      expectedOutcome: 'Core application features fully implemented with proper data handling and user interface.'
    },
    {
      id: 'stage-4',
      name: 'Advanced Features & Integration',
      order: 4,
      logic: {
        entryCriteria: ['Stage 3 complete'],
        doneWhen: ['Advanced features complete', 'Third-party integrations working']
      },
      uiChecks: ['Advanced functionality works', 'Integrations active', 'Performance optimized'],
      validation: ['Integration tests pass', 'Performance benchmarks met', 'Security audit complete'],
      expectedOutcome: 'Advanced features integrated with optimized performance and security measures.'
    },
    {
      id: 'stage-5',
      name: 'Polish, Testing & Deployment',
      order: 5,
      logic: {
        entryCriteria: ['Stage 4 complete'],
        doneWhen: ['All tests pass', 'Production deployment successful']
      },
      uiChecks: ['Final testing complete', 'Documentation updated', 'Deployment successful'],
      validation: ['All test suites pass', 'Production environment stable', 'Performance optimized'],
      expectedOutcome: 'Production-ready application deployed with comprehensive testing and documentation.'
    }
  ];

  // Generate detailed sub-projects and tasks
  const subProjects = [
    {
      id: 'sp-auth',
      title: 'Authentication & User Management',
      description: 'Implement comprehensive user authentication and management system.',
      dependencies: [],
      tasks: [
        {
          id: 't-auth-setup',
          title: 'Authentication Infrastructure Setup',
          description: 'Set up authentication libraries and database schemas for user management.',
          dependencies: [],
          acceptanceCriteria: [
            'Authentication library installed and configured',
            'User database schema created and migrated',
            'Basic auth routes established'
          ],
          subTasks: [
            {
              id: 'st-auth-lib',
              title: 'Install Auth Library',
              description: 'Install and configure authentication library (e.g., NextAuth, Passport)',
              acceptanceCriteria: ['Library installed', 'Basic configuration complete']
            },
            {
              id: 'st-user-schema',
              title: 'Create User Schema',
              description: 'Design and implement user database schema with roles',
              acceptanceCriteria: ['Database schema created', 'Migration successful']
            }
          ],
          stageId: 'stage-2'
        },
        {
          id: 't-auth-flows',
          title: 'Authentication Flows',
          description: 'Implement login, registration, and password reset flows.',
          dependencies: ['t-auth-setup'],
          acceptanceCriteria: [
            'User registration functional',
            'Login/logout works correctly',
            'Password reset implemented'
          ],
          subTasks: [
            {
              id: 'st-register',
              title: 'Registration Flow',
              description: 'Build user registration with validation',
              acceptanceCriteria: ['Registration form works', 'Validation implemented']
            },
            {
              id: 'st-login',
              title: 'Login Flow',
              description: 'Implement secure login with session management',
              acceptanceCriteria: ['Login works', 'Sessions managed properly']
            }
          ],
          stageId: 'stage-2'
        },
        {
          id: 't-auth-protection',
          title: 'Route Protection & Roles',
          description: 'Implement protected routes and role-based access control.',
          dependencies: ['t-auth-flows'],
          acceptanceCriteria: [
            'Protected routes implemented',
            'Role-based access working',
            'Unauthorized access blocked'
          ],
          subTasks: [
            {
              id: 'st-route-guards',
              title: 'Route Guards',
              description: 'Create middleware for protecting routes',
              acceptanceCriteria: ['Route protection active', 'Redirects working']
            },
            {
              id: 'st-rbac',
              title: 'Role-Based Access Control',
              description: 'Implement fine-grained permission system',
              acceptanceCriteria: ['RBAC system functional', 'Permissions enforced']
            }
          ],
          stageId: 'stage-2'
        }
      ]
    },
    {
      id: 'sp-core',
      title: 'Core Application Features',
      description: 'Implement the main functionality and user interface of the application.',
      dependencies: ['sp-auth'],
      tasks: [
        {
          id: 't-core-ui',
          title: 'User Interface Implementation',
          description: 'Build the main user interface components and layouts.',
          dependencies: [],
          acceptanceCriteria: [
            'Main UI components built',
            'Responsive design implemented',
            'Accessibility standards met'
          ],
          subTasks: [
            {
              id: 'st-components',
              title: 'Core Components',
              description: 'Build reusable UI components',
              acceptanceCriteria: ['Components built', 'Styling complete']
            },
            {
              id: 'st-layouts',
              title: 'Page Layouts',
              description: 'Create responsive page layouts',
              acceptanceCriteria: ['Layouts responsive', 'Navigation working']
            }
          ],
          stageId: 'stage-3'
        },
        {
          id: 't-core-crud',
          title: 'Data Operations (CRUD)',
          description: 'Implement create, read, update, delete operations for main entities.',
          dependencies: ['t-core-ui'],
          acceptanceCriteria: [
            'All CRUD operations functional',
            'Data validation implemented',
            'Error handling complete'
          ],
          subTasks: [
            {
              id: 'st-create',
              title: 'Create Operations',
              description: 'Implement data creation with validation',
              acceptanceCriteria: ['Create functionality works', 'Validation active']
            },
            {
              id: 'st-read-update',
              title: 'Read & Update Operations',
              description: 'Build data retrieval and modification features',
              acceptanceCriteria: ['Data retrieval works', 'Updates functional']
            }
          ],
          stageId: 'stage-3'
        },
        {
          id: 't-core-advanced',
          title: 'Advanced Features',
          description: 'Implement advanced functionality specific to the application domain.',
          dependencies: ['t-core-crud'],
          acceptanceCriteria: [
            'Advanced features implemented',
            'Integration with external services',
            'Performance optimized'
          ],
          subTasks: [
            {
              id: 'st-search',
              title: 'Search & Filtering',
              description: 'Implement search and filtering capabilities',
              acceptanceCriteria: ['Search works', 'Filters functional']
            },
            {
              id: 'st-real-time',
              title: 'Real-time Features',
              description: 'Add real-time updates and notifications',
              acceptanceCriteria: ['Real-time updates work', 'Notifications sent']
            }
          ],
          stageId: 'stage-4'
        }
      ]
    }
  ];

  return {
    status: 'INSTANCE',
    mode: input.mode,
    skill: input.skill,
    instance: {
      instanceId,
      templateId: input.selectedTemplateId!,
      status: 'Active',
      project: {
        title: `Interactive ${skillName} Platform`,
        summary: `A comprehensive ${skillName} application demonstrating modern development practices, user authentication, and real-world functionality.`
      },
      progress: {
        totalStages: stages.length,
        completedStages: 0,
        percent: 0
      },
      stages,
      subProjects,
      guide: {
        perStageGuide: stages.map(stage => ({
          stageId: stage.id,
          coachRules: {
            clarifyingQuestions: 3,
            stepsStyle: 'bullet-stepwise',
            smallestNextActionMinutes: 30,
            enforceAcceptanceCriteria: true,
            endWithChecklistAlignedToExpectedOutcome: true
          }
        }))
      },
      submission: {
        type: 'GitHub',
        link: '',
        notes: '',
        visibleTo: { platformOwner: true, tenantAdmin: true },
        uiCopy: 'Paste a shareable link to your Capstone\'s public GitHub repository.'
      },
      events: {
        onSelect: {
          message: 'Capstone instance created successfully',
          auditTrail: {
            at: now,
            actor: input.learner.userId,
            action: 'CREATE_INSTANCE'
          }
        },
        onStageComplete: {
          rule: 'Mark stage done only when all validation criteria pass',
          progressComputation: 'percent = floor((completedStages/totalStages)*100)'
        },
        onSubmit: {
          emits: [{
            type: 'SUBMISSION_CREATED',
            payload: {
              instanceId,
              studentId: input.learner.userId,
              tenantId: input.learner.tenantId,
              skill: skillName,
              capstoneTitle: `Interactive ${skillName} Platform`,
              stagePercent: 100,
              link: '',
              status: 'Submitted',
              submittedAt: now,
              visibleTo: { platformOwner: true, tenantAdmin: true }
            },
            targets: ['PlatformOwnerDashboard', 'TenantAdminDashboard']
          }]
        }
      }
    }
  };
}

// Utility functions
const urlSafe = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24);

// Legacy compatibility function
export function buildMockOrchestration(args: {
  skill: string;
  userId: string;
  tenantId?: string;
  mode?: 'mock' | 'production';
  selectedTemplateId?: string;
}): OrchestratorOutput {
  const input: OrchestratorInput = {
    mode: args.mode || 'mock',
    learner: { userId: args.userId, tenantId: args.tenantId },
    skill: { name: args.skill, level: 'Intermediate', tags: [] },
    learningRoadmapProgress: {
      stages: [
        { id: 'stage-1', name: 'Fundamentals', done: true },
        { id: 'stage-2', name: 'Projects', done: true },
        { id: 'stage-3', name: 'Advanced Topics', done: true }
      ],
      allDone: true,
      percent: 100
    },
    selectedTemplateId: args.selectedTemplateId || null
  };
  
  return orchestrateCapstone(input);
}

// Legacy type compatibility
export type Orchestration = InstanceState;

export function orchestrationToRoadmap(o: InstanceState): CapstoneRoadmap {
  return {
    project: { title: o.instance.project.title, summary: o.instance.project.summary },
    stages: o.instance.stages as unknown as CapstoneStageSpec[],
    subProjects: o.instance.subProjects as unknown as CapstoneSubProjectSpec[],
  };
}
