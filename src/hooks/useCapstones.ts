import { useEffect, useMemo, useState } from 'react';
import type {
  CapstoneConfig,
  GeneratedRoadmap,
  CapstoneSubmission,
  EvaluationResult,
  CapstoneTemplate,
  CapstoneInstance,
  CapstoneRoadmap,
  InstanceSubmission,
  SubmissionType,
  CapstoneInstanceProgress,
} from '@/types/capstone';

const LS_KEY_PREFIX = 'capstones-v1';

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

export interface CapstoneState {
  configs: CapstoneConfig[];
  templates: CapstoneTemplate[];
  instances: CapstoneInstance[];
  enrollments: Record<string, string>; // per skillId -> capstoneId
  generatedRoadmaps: Record<string, GeneratedRoadmap>; // per capstoneId
  submissions: Record<string, CapstoneSubmission[]>; // legacy per capstoneId
  instanceSubmissions: Record<string, InstanceSubmission[]>; // per instanceId
  instanceProgress: Record<string, CapstoneInstanceProgress>; // per instanceId
  evaluations: Record<string, EvaluationResult>; // per submissionId
  analytics: {
    attempts: Record<string, number>; // capstoneId -> count
    completions: Record<string, number>; // capstoneId -> count
    avgScore: Record<string, number>; // capstoneId -> avg
    plagiarismIncidents: Record<string, number>; // capstoneId -> count
  };
}

const defaultState: CapstoneState = {
  configs: [],
  templates: [],
  instances: [],
  enrollments: {},
  generatedRoadmaps: {},
  submissions: {},
  instanceSubmissions: {},
  instanceProgress: {},
  evaluations: {},
  analytics: { attempts: {}, completions: {}, avgScore: {}, plagiarismIncidents: {} },
};

// Quick schema validator for generated roadmap
function validateRoadmapSchema(roadmap: GeneratedRoadmap): boolean {
  if (!roadmap || !Array.isArray(roadmap.phases)) return false;
  return roadmap.phases.every(p => !!p.id && !!p.title && Array.isArray(p.resources));
}

// Strict validator for CapstoneRoadmap JSON according to provided schema
function validateInstanceRoadmapSchema(rm: CapstoneRoadmap): boolean {
  if (!rm || !rm.project || typeof rm.project.title !== 'string' || typeof rm.project.summary !== 'string') return false;
  if (!Array.isArray(rm.stages) || rm.stages.length === 0) return false;
  if (!Array.isArray(rm.subProjects) || rm.subProjects.length === 0) return false;
  const stagesOk = rm.stages.every(s => typeof s.id === 'string' && typeof s.name === 'string' && typeof s.order === 'number' && Array.isArray(s.uiChecks) && Array.isArray(s.validation) && typeof s.expectedOutcome === 'string');
  if (!stagesOk) return false;
  const spOk = rm.subProjects.every(sp => typeof sp.id === 'string' && typeof sp.title === 'string' && typeof sp.description === 'string' && Array.isArray(sp.dependencies) && Array.isArray(sp.tasks) && sp.tasks.every(t => typeof t.id === 'string' && typeof t.title === 'string' && typeof t.description === 'string' && Array.isArray(t.dependencies) && Array.isArray(t.acceptanceCriteria) && Array.isArray(t.subTasks) && t.subTasks.every(st => typeof st.id === 'string' && typeof st.title === 'string' && typeof st.description === 'string' && Array.isArray(st.acceptanceCriteria))));
  return spOk;
}

const urlRegex = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[\w\-.~:\/?#\[\]@!$&'()*+,;=%]*$/i;

function isValidURL(link: string) {
  return urlRegex.test(link || '');
}

export function useCapstones() {
  const [state, setState] = useState<CapstoneState>(() => readLS(`${LS_KEY_PREFIX}:state`, defaultState));

  useEffect(() => {
    writeLS(`${LS_KEY_PREFIX}:state`, state);
  }, [state]);

  // Seed defaults on first load
  useEffect(() => {
    if (state.configs.length === 0) {
      const seed: CapstoneConfig[] = [
        {
          id: 'cap-js-portfolio',
          skillId: 'javascript-typescript',
          title: 'Full-Stack Portfolio App',
          difficulty: 'Intermediate',
          timeEstimate: '2-3 weeks',
          expectedDeliverables: ['Repository', 'Technical Report', 'Demo Video'],
          overview: {
            description: 'Build a full-stack application with authentication, CRUD, and tests.',
            outcomes: ['Design REST APIs', 'Implement auth', 'Write tests'],
            prerequisites: ['JS basics', 'Node/React fundamentals'],
          },
          checkpoints: [
            { id: 'cp1', title: 'Scope & Design', description: 'Define the MVP and architecture diagram', requiredDeliverables: ['report', 'repo'] },
            { id: 'cp2', title: 'MVP Build', description: 'Implement core features and tests', requiredDeliverables: ['repo'] },
            { id: 'cp3', title: 'Deploy & Demo', description: 'Deploy app and record a demo', requiredDeliverables: ['demo', 'repo'] },
          ],
          rubric: { items: [
            { id: 'r1', criterion: 'Functionality', weight: 40 },
            { id: 'r2', criterion: 'Code Quality', weight: 30 },
            { id: 'r3', criterion: 'Testing', weight: 20 },
            { id: 'r4', criterion: 'Documentation', weight: 10 },
          ]},
          features: { aiRoadmap: true, aiGuide: true, autoEvaluation: true },
          status: 'Published',
        },
        {
          id: 'cap-react-dashboard',
          skillId: 'react-nextjs',
          title: 'React Analytics Dashboard',
          difficulty: 'Beginner',
          timeEstimate: '1-2 weeks',
          expectedDeliverables: ['Repository', 'Demo Video'],
          overview: {
            description: 'Create a responsive dashboard with charts and filters.',
            outcomes: ['Component design', 'State management', 'Data viz'],
            prerequisites: ['React basics'],
          },
          checkpoints: [
            { id: 'cp1', title: 'Wireframe & Data Model', description: 'Plan UI and mock data', requiredDeliverables: ['report'] },
            { id: 'cp2', title: 'Build Components', description: 'Implement charts and filters', requiredDeliverables: ['repo'] },
          ],
          rubric: { items: [
            { id: 'r1', criterion: 'UX & Accessibility', weight: 30 },
            { id: 'r2', criterion: 'Implementation', weight: 50 },
            { id: 'r3', criterion: 'Docs', weight: 20 },
          ]},
          features: { aiRoadmap: true, aiGuide: true, autoEvaluation: true },
          status: 'Published',
        },
      ];
      setState(prev => ({ ...prev, configs: seed }));
    }
  }, []);

  // Seed demo instances for testing
  useEffect(() => {
    // Always ensure demo instance exists for easy access
    const demoExists = state.instances.some(i => i.id === 'demo-instance-123');
    if (!demoExists) {
      const demoInstance: CapstoneInstance = {
        id: 'demo-instance-123',
        userId: 'demo-user',
        tenantId: 'demo-tenant',
        templateId: 'tpl-campus-events',
        skillId: 'javascript-typescript',
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        roadmap: {
          project: {
            title: 'Campus Events Portal',
            summary: 'Build a comprehensive MERN web application where students can discover, create, and RSVP to campus events with role-based access and calendar integration.'
          },
          stages: [
            {
              id: 'stage-1',
              name: 'Project Setup & Planning',
              order: 1,
              uiChecks: ['GitHub repository created', 'Development environment set up', 'Project structure defined'],
              validation: ['Repository has proper README', 'Dependencies installed correctly', 'Initial commit pushed'],
              expectedOutcome: 'A well-structured project foundation with proper tooling and documentation'
            },
            {
              id: 'stage-2',
              name: 'Database Design & API Foundation',
              order: 2,
              uiChecks: ['Database schema designed', 'API endpoints defined', 'Authentication setup'],
              validation: ['Database migrations run successfully', 'Basic CRUD operations work', 'JWT authentication implemented'],
              expectedOutcome: 'A robust backend foundation with secure authentication and data management'
            },
            {
              id: 'stage-3',
              name: 'Core Event Management',
              order: 3,
              uiChecks: ['Event creation interface', 'Event listing and filtering', 'RSVP functionality'],
              validation: ['Users can create and manage events', 'Event discovery works correctly', 'RSVP system is functional'],
              expectedOutcome: 'Complete event lifecycle management from creation to attendance tracking'
            },
            {
              id: 'stage-4',
              name: 'User Experience & Polish',
              order: 4,
              uiChecks: ['Responsive design implemented', 'User dashboard created', 'Notifications system'],
              validation: ['Mobile-friendly interface', 'Real-time updates work', 'Error handling is comprehensive'],
              expectedOutcome: 'A polished, user-friendly application with excellent UX/UI'
            },
            {
              id: 'stage-5',
              name: 'Testing & Deployment',
              order: 5,
              uiChecks: ['Unit tests written', 'Integration tests completed', 'Production deployment'],
              validation: ['Test coverage > 80%', 'All features work in production', 'Performance is optimized'],
              expectedOutcome: 'A fully tested, deployed application ready for real-world use'
            }
          ],
          subProjects: [
            {
              id: 'sp-backend',
              title: 'Backend Development',
              description: 'Build the server-side infrastructure including API, authentication, and database management',
              dependencies: [],
              tasks: [
                {
                  id: 'task-auth',
                  title: 'Authentication System',
                  description: 'Implement user registration, login, and JWT-based authentication',
                  dependencies: [],
                  acceptanceCriteria: ['Users can register with email/password', 'Login returns valid JWT token', 'Protected routes require authentication'],
                  subTasks: [
                    { id: 'st-auth-1', title: 'User model and routes', description: 'Create user schema and auth endpoints', acceptanceCriteria: ['User model defined', 'Auth routes created'] },
                    { id: 'st-auth-2', title: 'JWT implementation', description: 'Add token generation and verification', acceptanceCriteria: ['JWT tokens generated', 'Token verification middleware'] }
                  ],
                  stageId: 'stage-2'
                },
                {
                  id: 'task-events-api',
                  title: 'Events API',
                  description: 'Create CRUD operations for event management',
                  dependencies: ['task-auth'],
                  acceptanceCriteria: ['Events can be created, read, updated, deleted', 'Proper authorization checks', 'Input validation implemented'],
                  subTasks: [
                    { id: 'st-events-1', title: 'Event model', description: 'Define event schema and relationships', acceptanceCriteria: ['Event model created', 'Database relationships defined'] },
                    { id: 'st-events-2', title: 'CRUD endpoints', description: 'Implement event management endpoints', acceptanceCriteria: ['All CRUD operations work', 'Proper error handling'] }
                  ],
                  stageId: 'stage-3'
                }
              ]
            },
            {
              id: 'sp-frontend',
              title: 'Frontend Development',
              description: 'Build the user interface and user experience components',
              dependencies: ['sp-backend'],
              tasks: [
                {
                  id: 'task-ui-components',
                  title: 'Core UI Components',
                  description: 'Create reusable components for the application interface',
                  dependencies: [],
                  acceptanceCriteria: ['Component library established', 'Consistent styling implemented', 'Components are responsive'],
                  subTasks: [
                    { id: 'st-ui-1', title: 'Design system setup', description: 'Establish colors, typography, and component standards', acceptanceCriteria: ['Design tokens defined', 'Base components created'] },
                    { id: 'st-ui-2', title: 'Event components', description: 'Build event card, form, and detail components', acceptanceCriteria: ['Event components functional', 'Props properly typed'] }
                  ],
                  stageId: 'stage-3'
                },
                {
                  id: 'task-user-dashboard',
                  title: 'User Dashboard',
                  description: 'Create personalized dashboard for users to manage their events and RSVPs',
                  dependencies: ['task-ui-components'],
                  acceptanceCriteria: ['Users see their created events', 'RSVP history is displayed', 'Profile management available'],
                  subTasks: [
                    { id: 'st-dashboard-1', title: 'Dashboard layout', description: 'Create main dashboard structure and navigation', acceptanceCriteria: ['Dashboard layout complete', 'Navigation functional'] },
                    { id: 'st-dashboard-2', title: 'Event management', description: 'Add event creation and management features', acceptanceCriteria: ['Event CRUD from dashboard', 'Real-time updates'] }
                  ],
                  stageId: 'stage-4'
                }
              ]
            }
          ]
        }
      };

      setState(prev => ({ 
        ...prev, 
        instances: [...prev.instances, demoInstance],
        instanceProgress: {
          ...prev.instanceProgress,
          'demo-instance-123': {
            stages: {
              'stage-1': { done: true, checklist: { 'GitHub repository created': true, 'Development environment set up': true, 'Project structure defined': true } },
              'stage-2': { done: true, checklist: { 'Database schema designed': true, 'API endpoints defined': true, 'Authentication setup': true } },
              'stage-3': { done: false, checklist: { 'Event creation interface': true, 'Event listing and filtering': false, 'RSVP functionality': false } },
              'stage-4': { done: false, checklist: {} },
              'stage-5': { done: false, checklist: {} }
            },
            tasks: {
              'task-auth': true,
              'task-events-api': false,
              'task-ui-components': true,
              'task-user-dashboard': false
            }
          }
        }
      }));
    }
  }, []); // Only run once

  // Seed templates
  useEffect(() => {
    if (state.templates.length === 0) {
      const templates: CapstoneTemplate[] = [
        { id: 'tpl-campus-events', skillId: 'javascript-typescript', title: 'Campus Events Portal', difficulty: 'Intermediate', tags: ['MERN', 'Auth', 'Calendar'], overview: { problem: 'Colleges lack a central hub for events; discovery & RSVP are fragmented.', objective: 'Build a MERN web app with roles, event CRUD, RSVP, and calendar sync.' } },
        { id: 'tpl-finance-tracker', skillId: 'javascript-typescript', title: 'Personal Finance Tracker', difficulty: 'Beginner', tags: ['React', 'Node', 'Postgres'], overview: { problem: 'Students struggle to categorize expenses and set goals.', objective: 'React + Node + PostgreSQL; budgets, categories, charts, CSV import.' } },
        { id: 'tpl-job-board', skillId: 'javascript-typescript', title: 'Job Board Aggregator', difficulty: 'Advanced', tags: ['Next.js', 'Workers', 'Search'], overview: { problem: 'Entry-level tech jobs are scattered across sites.', objective: 'Next.js app; ingestion workers, search, alerts, saved jobs.' } },
        { id: 'tpl-meta-roadmaps', skillId: 'javascript-typescript', title: 'Learning Roadmap Generator', difficulty: 'Advanced', tags: ['Next.js', 'Embeddings'], overview: { problem: 'Learners need adaptive study plans.', objective: 'Next.js + embeddings; import syllabus, generate weekly plan, progress tracker.' } },
        // React
        { id: 'tpl-react-dashboard', skillId: 'react-nextjs', title: 'React Analytics Dashboard', difficulty: 'Beginner', tags: ['React', 'Charts'], overview: { problem: 'Teams lack insight into KPIs.', objective: 'Build a responsive dashboard with charts and filters.' } },
        { id: 'tpl-react-cms', skillId: 'react-nextjs', title: 'Headless CMS Frontend', difficulty: 'Intermediate', tags: ['Next.js', 'CMS'], overview: { problem: 'Hard to manage content updates.', objective: 'Next.js app consuming headless CMS with preview/drafts.' } },
        { id: 'tpl-react-ecommerce', skillId: 'react-nextjs', title: 'Mini E‑commerce', difficulty: 'Advanced', tags: ['Next.js', 'Stripe'], overview: { problem: 'Prototype storefront quickly.', objective: 'SSR catalog, cart, checkout with Stripe.' } },
      ];
      setState(prev => ({ ...prev, templates }));
    }
  }, []);

  const publishedConfigs = useMemo(() => state.configs.filter(c => c.status === 'Published'), [state.configs]);
  const listTemplatesBySkill = (skillId: string) => state.templates.filter(t => t.skillId === skillId).slice(0, 4);

  const upsertConfig = (cfg: CapstoneConfig) => {
    setState(prev => {
      const next = { ...prev };
      const idx = next.configs.findIndex(c => c.id === cfg.id);
      if (idx >= 0) next.configs[idx] = cfg; else next.configs.push(cfg);
      return { ...next };
    });
  };

  const deleteConfig = (id: string) => {
    setState(prev => ({ ...prev, configs: prev.configs.filter(c => c.id !== id) }));
  };

  const listBySkill = (skillId: string) => publishedConfigs.filter(c => c.skillId === skillId);

  // Instances
  const createInstance = (userId: string, tenantId: string | undefined, template: CapstoneTemplate): CapstoneInstance => {
    const now = new Date().toISOString();
    // Enforce single active instance per skill per user
    const existing = state.instances.find(i => i.userId === userId && i.skillId === template.skillId && (i.status === 'Active' || i.status === 'Submitted'));
    if (existing) return existing;
    const instance: CapstoneInstance = {
      id: `inst-${Date.now()}`,
      userId,
      tenantId,
      templateId: template.id,
      skillId: template.skillId,
      status: 'Active',
      createdAt: now,
      updatedAt: now,
    };
    setState(prev => ({ ...prev, instances: [...prev.instances, instance] }));
    return instance;
  };

  // Directly set a roadmap on an existing instance (used by Orchestrator flow)
  const setInstanceRoadmap = (instanceId: string, roadmap: CapstoneRoadmap) => {
    if (!validateInstanceRoadmapSchema(roadmap)) throw new Error('Roadmap JSON failed schema');
    const stages = roadmap.stages || [];
    const taskIds = roadmap.subProjects.flatMap(sp => sp.tasks.map(t => t.id));
    setState(prev => ({
      ...prev,
      instances: prev.instances.map(i => i.id === instanceId ? { ...i, roadmap, updatedAt: new Date().toISOString() } : i),
      instanceProgress: { ...prev.instanceProgress, [instanceId]: { stages: Object.fromEntries(stages.map(s => [s.id, { done: false, checklist: {} }])), tasks: Object.fromEntries(taskIds.map(id => [id, false])) } },
    }));
  };

  const generateInstanceRoadmap = (instanceId: string, template: CapstoneTemplate, level: 'beginner' | 'intermediate' | 'advanced' = 'intermediate') => {
    const baseTitle = template.title;
    // Build 5-7 stages
    const numStages = 5 + ((baseTitle.length + (level === 'advanced' ? 1 : 0)) % 3); // 5-7
    const stages = Array.from({ length: numStages }, (_, i) => ({
      id: `stage-${i + 1}`,
      name: i === 0 ? 'Project Setup & Scope' : i === numStages - 1 ? 'Final Review & Demo' : `Stage ${i + 1}`,
      order: i + 1,
      uiChecks: i === 0 ? ['Repo created', 'ENV configured'] : ['Checklist updated'],
      validation: i === 0 ? ['CI passes on main'] : ['All acceptance criteria met'],
      expectedOutcome: i === 0 ? 'Scaffolded app with baseline CI' : i === numStages - 1 ? 'Approved demo and submission' : 'Stage objectives met',
    }));
    // 2-3 subprojects
    const numSP = 2 + (baseTitle.length % 2);
    const subProjects = Array.from({ length: numSP }, (_, spIndex) => ({
      id: `sp-${spIndex + 1}`,
      title: spIndex === 0 ? 'Core Functionality' : spIndex === 1 ? 'Data & API' : 'UX & Performance',
      description: `Workstream ${spIndex + 1} for ${baseTitle}`,
      dependencies: spIndex === 0 ? [] : ['sp-1'],
      tasks: Array.from({ length: 3 }, (_, tIndex) => ({
        id: `t-${spIndex + 1}-${tIndex + 1}`,
        title: `Task ${tIndex + 1}`,
        description: `Implement task ${tIndex + 1} in ${spIndex + 1}`,
        dependencies: tIndex === 0 ? [] : [`t-${spIndex + 1}-${tIndex}`],
        acceptanceCriteria: ['Unit tests pass', 'Meets definition of done'],
        subTasks: [
          { id: `st-${spIndex + 1}-${tIndex + 1}-1`, title: 'Scaffold', description: 'Initial structure', acceptanceCriteria: ['Build succeeds'] },
          { id: `st-${spIndex + 1}-${tIndex + 1}-2`, title: 'Implement', description: 'Core logic', acceptanceCriteria: ['Tests pass'] },
        ],
      })),
    }));
    const roadmap: CapstoneRoadmap = {
      project: { title: baseTitle, summary: template.overview.objective },
      stages,
      subProjects,
    };
    if (!validateInstanceRoadmapSchema(roadmap)) throw new Error('Roadmap JSON failed schema');
    setState(prev => ({
      ...prev,
      instances: prev.instances.map(i => i.id === instanceId ? { ...i, roadmap, updatedAt: new Date().toISOString() } : i),
      instanceProgress: { ...prev.instanceProgress, [instanceId]: { stages: Object.fromEntries(stages.map(s => [s.id, { done: false, checklist: {} }])) } },
    }));
    return roadmap;
  };

  const getInstance = (instanceId: string) => state.instances.find(i => i.id === instanceId);

  const addInstanceSubmission = (instanceId: string, opts: { type: SubmissionType; link: string; notes?: string; tenantId?: string }) => {
    if (!isValidURL(opts.link)) throw new Error('Invalid URL');
    const sub: InstanceSubmission = {
      id: `isub-${Date.now()}`,
      instanceId,
      type: opts.type,
      link: opts.link,
      notes: opts.notes,
      submittedAt: new Date().toISOString(),
      status: 'Pending Review',
      tenantId: opts.tenantId,
      ownerVisible: true,
      tenantAdminVisible: true,
    };
    setState(prev => ({ ...prev, instanceSubmissions: { ...prev.instanceSubmissions, [instanceId]: [...(prev.instanceSubmissions[instanceId] || []), sub] }, instances: prev.instances.map(i => i.id === instanceId ? { ...i, status: 'Submitted', updatedAt: new Date().toISOString() } : i) }));
    return sub;
  };

  const listAdminSubmissions = (filter?: { tenantId?: string; tenantIds?: string[]; status?: InstanceSubmission['status']; skillId?: string; skillIds?: string[]; dateFrom?: string; dateTo?: string }) => {
    const all = Object.values(state.instanceSubmissions).flat();
    return all.filter(s => {
      const inst = state.instances.find(i => i.id === s.instanceId);
      if (!inst) return false;
      // Tenant filter: support single or multiple
      if (filter?.tenantIds && filter.tenantIds.length > 0) {
        if (!s.tenantId || !filter.tenantIds.includes(s.tenantId)) return false;
      } else if (filter?.tenantId && s.tenantId !== filter.tenantId) return false;
      if (filter?.status && s.status !== filter.status) return false;
      // Skill filter: support single or multiple
      if (filter?.skillIds && filter.skillIds.length > 0) {
        if (!filter.skillIds.includes(inst.skillId)) return false;
      } else if (filter?.skillId && inst.skillId !== filter.skillId) return false;
      if (filter?.dateFrom && new Date(s.submittedAt) < new Date(filter.dateFrom)) return false;
      if (filter?.dateTo && new Date(s.submittedAt) > new Date(filter.dateTo)) return false;
      return true;
    }).map(s => ({ submission: s, instance: state.instances.find(i => i.id === s.instanceId)! }));
  };

  // Update status for a specific instance submission (admin actions)
  const updateInstanceSubmissionStatus = (instanceId: string, submissionId: string, status: InstanceSubmission['status']) => {
    setState(prev => {
      const list = prev.instanceSubmissions[instanceId] || [];
      const updated = list.map(s => s.id === submissionId ? { ...s, status } : s);
      return { ...prev, instanceSubmissions: { ...prev.instanceSubmissions, [instanceId]: updated } };
    });
  };

  // Upsert a template to ensure it is retrievable by templateId later
  const upsertTemplate = (tpl: CapstoneTemplate) => {
    setState(prev => {
      const idx = prev.templates.findIndex(t => t.id === tpl.id);
      const next = [...prev.templates];
      if (idx >= 0) next[idx] = tpl; else next.push(tpl);
      return { ...prev, templates: next };
    });
  };

  const updateStageChecklist = (instanceId: string, stageId: string, item: string, checked: boolean) => {
    setState(prev => {
      const prog = prev.instanceProgress[instanceId] || { stages: {} };
      const stage = prog.stages[stageId] || { done: false, checklist: {} };
      const checklist = { ...stage.checklist, [item]: checked };
      const next = { ...prev.instanceProgress, [instanceId]: { stages: { ...prog.stages, [stageId]: { ...stage, checklist } } } };
      return { ...prev, instanceProgress: next };
    });
  };

  const toggleTaskDone = (instanceId: string, taskId: string, done: boolean) => {
    setState(prev => {
      const prog = prev.instanceProgress[instanceId] || { stages: {}, tasks: {} };
      const tasks = { ...(prog.tasks || {}), [taskId]: done };
      return { ...prev, instanceProgress: { ...prev.instanceProgress, [instanceId]: { ...prog, tasks } } };
    });
  };

  const markStageDone = (instanceId: string, stageId: string, done: boolean) => {
    setState(prev => {
      const prog = prev.instanceProgress[instanceId] || { stages: {} };
      const stage = prog.stages[stageId] || { done: false, checklist: {} };
      const next = { ...prev.instanceProgress, [instanceId]: { stages: { ...prog.stages, [stageId]: { ...stage, done } } } };
      return { ...prev, instanceProgress: next };
    });
  };

  const getInstanceProgressPercent = (instanceId: string): number => {
    const inst = getInstance(instanceId);
    if (!inst?.roadmap) return 0;
    const prog = state.instanceProgress[instanceId];
    const totalStages = inst.roadmap.stages.length;
    const done = Object.values(prog?.stages || {}).filter(s => s.done).length;
    return Math.floor((done / totalStages) * 100);
  };

  // Legacy functions for compatibility
  const enroll = (skillId: string, capstoneId: string) => {
    setState(prev => ({ ...prev, enrollments: { ...prev.enrollments, [skillId]: capstoneId } }));
  };

  const generateRoadmap = (capstoneId: string) => {
    // Legacy function - now handled by generateInstanceRoadmap
    return { phases: [] };
  };

  const submit = (capstoneId: string, submission: { links: { repo?: string; report?: string; demo?: string } }) => {
    // Legacy function - now handled by addInstanceSubmission
    return { id: `sub-${Date.now()}`, capstoneId, skillId: '', submittedAt: new Date().toISOString(), links: submission.links };
  };

  const evaluate = (submissionId: string) => {
    // Legacy function - simplified for now
    return { totalScore: 85, items: [], plagiarismPercent: 0, pass: true, feedbackSummary: 'Good work!', evaluatedAt: new Date().toISOString() };
  };

  return {
    state,
    publishedConfigs,
    listTemplatesBySkill,
    upsertConfig,
    deleteConfig,
    listBySkill,
    createInstance,
    setInstanceRoadmap,
    generateInstanceRoadmap,
    getInstance,
    addInstanceSubmission,
    updateInstanceSubmissionStatus,
    upsertTemplate,
    listAdminSubmissions,
    updateStageChecklist,
    markStageDone,
    toggleTaskDone,
    getInstanceProgressPercent,
    // Legacy compatibility
    enroll,
    generateRoadmap,
    submit,
    evaluate,
  };
}