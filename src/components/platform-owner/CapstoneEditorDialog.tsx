import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Wand2 } from 'lucide-react';
import { useCapstones } from '@/hooks/useCapstones';
import type { CapstoneConfig, CapstoneDifficulty, CapstoneRoadmap } from '@/types/capstone';

type EditorState = {
  title: string;
  difficulty: CapstoneDifficulty;
  timeEstimate: string;
  expectedDeliverables: string;
  overview: { description: string; outcomes: string; prerequisites: string };
  rubric: Array<{ id: string; criterion: string; weight: number }>;
  draftRoadmap?: CapstoneRoadmap;
};

function makeId(prefix: string) { return `${prefix}-${Math.random().toString(36).slice(2,7)}`; }

function generateDraftFromOverview(title: string, overview: { description: string; outcomes: string }): CapstoneRoadmap {
  const outcomes = overview.outcomes.split(',').map(s => s.trim()).filter(Boolean);
  const baseStages = [
    'Project Setup & Planning',
    'Core Backend/API',
    'Core UI/UX',
    'Integration & Polish',
    'Testing & Deployment',
  ];
  const stages = baseStages.map((name, i) => ({
    id: `stage-${i+1}`,
    name,
    order: i+1,
    uiChecks: [
      i === 0 ? 'Repository created' : 'Feature implemented',
      i === 0 ? 'Environment ready' : 'Basic UX complete',
      'Lint/format clean'
    ],
    validation: [
      'All acceptance checks pass',
      i === 0 ? 'Architecture sketch complete' : 'Feature behaves as specified'
    ],
    expectedOutcome: i === 0 ? 'Scaffolded project and plan' : `Completed ${name.toLowerCase()}`,
  }));

  const mkTask = (id: string, title: string, stageId: string) => ({
    id,
    title,
    description: `Implement: ${title}`,
    dependencies: [],
    acceptanceCriteria: [
      'Meets functional requirements',
      'Includes basic tests',
    ],
    subTasks: [
      { id: `${id}-1`, title: 'Scaffold', description: 'Create files and interfaces', acceptanceCriteria: ['Compiles without errors'] },
      { id: `${id}-2`, title: 'Implement', description: 'Code and wire up', acceptanceCriteria: ['Functionality works'] },
    ],
    stageId,
  });

  const subProjects = [
    {
      id: 'sp-backend',
      title: 'Backend',
      description: 'Server, data, auth',
      dependencies: [],
      tasks: [mkTask('task-auth', 'Authentication', 'stage-2'), mkTask('task-api', 'Domain API', 'stage-2')],
    },
    {
      id: 'sp-frontend',
      title: 'Frontend',
      description: 'UI and UX',
      dependencies: ['sp-backend'],
      tasks: [mkTask('task-ui', 'Core UI', 'stage-3'), mkTask('task-polish', 'Polish & A11y', 'stage-4')],
    },
  ];

  return {
    project: { title, summary: overview.description },
    stages,
    subProjects,
  };
}

export function CapstoneEditorDialog({ open, onOpenChange, skillId }: { open: boolean; onOpenChange: (v: boolean) => void; skillId: string }) {
  const { upsertConfig, upsertTemplate } = useCapstones();
  const [state, setState] = useState<EditorState>({
    title: 'New Capstone',
    difficulty: 'Intermediate',
    timeEstimate: '2-3 weeks',
    expectedDeliverables: 'Repository, Technical Report, Demo Video',
    overview: { description: '', outcomes: '', prerequisites: '' },
    rubric: [ { id: makeId('r'), criterion: 'Functionality', weight: 40 }, { id: makeId('r'), criterion: 'Code Quality', weight: 30 }, { id: makeId('r'), criterion: 'Documentation', weight: 30 } ],
  });

  const totalRubric = useMemo(() => state.rubric.reduce((a, b) => a + (b.weight || 0), 0), [state.rubric]);
  const canPublish = state.title.trim() && totalRubric === 100;

  const addRubric = () => setState(s => ({ ...s, rubric: [...s.rubric, { id: makeId('r'), criterion: '', weight: 0 }] }));
  const removeRubric = (id: string) => setState(s => ({ ...s, rubric: s.rubric.filter(r => r.id !== id) }));

  const generate = () => {
    const draft = generateDraftFromOverview(state.title, state.overview);
    setState(s => ({ ...s, draftRoadmap: draft }));
  };

  const save = (publish: boolean) => {
    const cfg: CapstoneConfig = {
      id: `cap-${Date.now()}`,
      skillId,
      title: state.title,
      difficulty: state.difficulty,
      timeEstimate: state.timeEstimate,
      expectedDeliverables: state.expectedDeliverables.split(',').map(s => s.trim()).filter(Boolean),
      overview: {
        description: state.overview.description,
        outcomes: state.overview.outcomes.split(',').map(s => s.trim()).filter(Boolean),
        prerequisites: state.overview.prerequisites.split(',').map(s => s.trim()).filter(Boolean),
      },
      checkpoints: [
        { id: makeId('cp'), title: 'Design', description: 'Architecture, scope, plan', requiredDeliverables: ['report'] },
        { id: makeId('cp'), title: 'MVP', description: 'Implement core features', requiredDeliverables: ['repo'] },
        { id: makeId('cp'), title: 'Demo', description: 'Deploy and record demo', requiredDeliverables: ['demo','repo'] },
      ],
      rubric: { items: state.rubric.map(r => ({ id: r.id, criterion: r.criterion, weight: r.weight })) },
      features: { aiRoadmap: true, aiGuide: true, autoEvaluation: true },
      status: publish ? 'Published' : 'Draft',
    };
    upsertConfig(cfg);
    // Also create a template so student picker can surface it
    upsertTemplate({ id: cfg.id, skillId, title: cfg.title, difficulty: cfg.difficulty, tags: ['Capstone'], overview: { problem: state.overview.description.slice(0, 80) || 'Project', objective: state.overview.outcomes.split(',')[0]?.trim() || 'Build and ship' } });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>New Capstone</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Title" value={state.title} onChange={(e) => setState(s => ({ ...s, title: e.target.value }))} />
            <Select value={state.difficulty} onValueChange={(v) => setState(s => ({ ...s, difficulty: v as CapstoneDifficulty }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Time Estimate (e.g., 2-3 weeks)" value={state.timeEstimate} onChange={(e) => setState(s => ({ ...s, timeEstimate: e.target.value }))} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Textarea rows={4} placeholder="Overview: description" value={state.overview.description} onChange={(e) => setState(s => ({ ...s, overview: { ...s.overview, description: e.target.value } }))} />
            <div className="space-y-3">
              <Textarea rows={2} placeholder="Outcomes (comma-separated)" value={state.overview.outcomes} onChange={(e) => setState(s => ({ ...s, overview: { ...s.overview, outcomes: e.target.value } }))} />
              <Textarea rows={2} placeholder="Prerequisites (comma-separated)" value={state.overview.prerequisites} onChange={(e) => setState(s => ({ ...s, overview: { ...s.overview, prerequisites: e.target.value } }))} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-medium">Rubric <span className={totalRubric === 100 ? 'text-green-600' : 'text-red-600'}>({totalRubric}/100)</span></div>
              <Button size="sm" variant="outline" onClick={addRubric}><Plus className="h-4 w-4 mr-1" /> Add Criterion</Button>
            </div>
            <div className="space-y-2">
              {state.rubric.map((ri) => (
                <div key={ri.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                  <Input className="md:col-span-8" placeholder="Criterion" value={ri.criterion} onChange={(e) => setState(s => ({ ...s, rubric: s.rubric.map(r => r.id === ri.id ? { ...r, criterion: e.target.value } : r) }))} />
                  <Input className="md:col-span-3" type="number" min={0} max={100} value={ri.weight} onChange={(e) => {
                    const w = Math.max(0, Math.min(100, Number(e.target.value)));
                    setState(s => ({ ...s, rubric: s.rubric.map(r => r.id === ri.id ? { ...r, weight: w } : r) }));
                  }} />
                  <Button className="md:col-span-1" size="sm" variant="destructive" onClick={() => removeRubric(ri.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={generate}><Wand2 className="h-4 w-4 mr-1" /> Generate Breakdown</Button>
            <div className="text-xs text-muted-foreground">Creates editable stages, tasks, and subtasks from the overview.</div>
          </div>

          {state.draftRoadmap && (
            <Card>
              <CardHeader>
                <CardTitle>Draft Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium">Stages</div>
                  <div className="grid md:grid-cols-2 gap-2 mt-2">
                    {state.draftRoadmap.stages.map(s => (
                      <div key={s.id} className="border rounded p-2">
                        <div className="flex items-center justify-between">
                          <input className="font-medium bg-transparent w-full" value={s.name} onChange={(e) => setState(st => ({ ...st, draftRoadmap: st.draftRoadmap && { ...st.draftRoadmap, stages: st.draftRoadmap.stages.map(x => x.id === s.id ? { ...x, name: e.target.value } : x) } }))} />
                          <Badge variant="secondary">#{s.order}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Expected: {s.expectedOutcome}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Tasks</div>
                  <div className="space-y-2 mt-2">
                    {state.draftRoadmap.subProjects.flatMap(sp => sp.tasks).map(t => (
                      <div key={t.id} className="border rounded p-2">
                        <input className="font-medium bg-transparent w-full" value={t.title} onChange={(e) => setState(st => ({ ...st, draftRoadmap: st.draftRoadmap && { ...st.draftRoadmap, subProjects: st.draftRoadmap.subProjects.map(sp => ({ ...sp, tasks: sp.tasks.map(x => x.id === t.id ? { ...x, title: e.target.value } : x) })) } }))} />
                        <div className="text-xs text-muted-foreground">Stage: {t.stageId}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button variant="outline" onClick={() => save(false)} disabled={!canPublish}>Save Draft</Button>
            <Button onClick={() => save(true)} disabled={!canPublish}>Publish</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CapstoneEditorDialog;

