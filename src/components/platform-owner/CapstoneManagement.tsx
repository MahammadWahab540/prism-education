import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCapstones } from '@/hooks/useCapstones';
import type { CapstoneConfig, CapstoneRubricItem, CapstoneCheckpoint } from '@/types/capstone';
import { Plus, Trash2, Wand2, Eye } from 'lucide-react';

const emptyRubricItem = (): CapstoneRubricItem => ({ id: `r-${Date.now()}`, criterion: '', weight: 0 });
const emptyCheckpoint = (): CapstoneCheckpoint => ({ id: `cp-${Date.now()}`, title: '', description: '', requiredDeliverables: ['repo', 'report', 'demo'] });

export function CapstoneManagement() {
  const { state, upsertConfig, deleteConfig, generateRoadmap } = useCapstones();
  const [activeTab, setActiveTab] = useState<'list' | 'editor' | 'preview' | 'analytics'>('list');
  const [editing, setEditing] = useState<CapstoneConfig | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewForId, setPreviewForId] = useState<string | null>(null);

  const totalRubric = useMemo(() => (editing ? editing.rubric.items.reduce((a, b) => a + (b.weight || 0), 0) : 0), [editing]);
  const canPublish = useMemo(() => {
    if (!editing) return false;
    const hasCpDeliverables = editing.checkpoints.every(cp => cp.requiredDeliverables && cp.requiredDeliverables.length > 0);
    const hasAtLeastOne = !!editing.title && !!editing.skillId && editing.rubric.items.length > 0 && hasCpDeliverables;
    return hasAtLeastOne && totalRubric === 100;
  }, [editing, totalRubric]);

  const startNew = () => {
    setEditing({
      id: `cap-${Date.now()}`,
      skillId: 'javascript-typescript',
      title: 'New Capstone',
      difficulty: 'Intermediate',
      timeEstimate: '2-3 weeks',
      expectedDeliverables: ['Repository', 'Technical Report', 'Demo Video'],
      overview: { description: '', outcomes: [], prerequisites: [] },
      checkpoints: [emptyCheckpoint()],
      rubric: { items: [emptyRubricItem()] },
      features: { aiRoadmap: true, aiGuide: true, autoEvaluation: true },
      status: 'Draft',
    });
    setActiveTab('editor');
  };

  const save = () => { if (editing) upsertConfig(editing); };

  const publish = () => {
    if (!editing || !canPublish) return;
    upsertConfig({ ...editing, status: 'Published' });
    setActiveTab('list');
  };

  const doPreview = (id: string) => {
    setPreviewForId(id);
    generateRoadmap(id);
    setActiveTab('preview');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Capstone Manager</h1>
          <div className="text-sm text-muted-foreground">Create and manage capstones, checkpoints, and rubrics</div>
        </div>
        <Button onClick={startNew}><Plus className="w-4 h-4 mr-2" /> New Capstone</Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {state.configs.length === 0 && (
            <Card className="p-6"><div className="text-sm text-muted-foreground">No capstones yet. Click New Capstone to add one.</div></Card>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.configs.map(c => (
              <Card key={c.id} className="hover:shadow-elevated">
                <CardHeader>
                  <CardTitle className="text-base">{c.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm text-muted-foreground">Skill: {c.skillId}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="secondary">{c.difficulty}</Badge>
                    <Badge>{c.status}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(c); setActiveTab('editor'); }}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => doPreview(c.id)}><Eye className="h-4 w-4 mr-1" /> Preview</Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteConfig(c.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="editor" className="space-y-4">
          {!editing ? (
            <Card className="p-6"><div className="text-sm text-muted-foreground">Select a capstone from the list or create a new one.</div></Card>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle>Basics</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input placeholder="Title" value={editing.title} onChange={(e) => setEditing({ ...editing!, title: e.target.value })} />
                    <Select value={editing.difficulty} onValueChange={(v) => setEditing({ ...editing!, difficulty: v as any })}>
                      <SelectTrigger><SelectValue placeholder="Difficulty" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Skill ID (maps to Roadmap)" value={editing.skillId} onChange={(e) => setEditing({ ...editing!, skillId: e.target.value })} />
                    <Input placeholder="Time Estimate" value={editing.timeEstimate} onChange={(e) => setEditing({ ...editing!, timeEstimate: e.target.value })} />
                  </div>
                  <Textarea placeholder="Overview Description" value={editing.overview.description} onChange={(e) => setEditing({ ...editing!, overview: { ...editing!.overview, description: e.target.value } })} />
                  <Input placeholder="Outcomes (comma separated)" value={editing.overview.outcomes.join(', ')} onChange={(e) => setEditing({ ...editing!, overview: { ...editing!.overview, outcomes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })} />
                  <Input placeholder="Prerequisites (comma separated)" value={editing.overview.prerequisites.join(', ')} onChange={(e) => setEditing({ ...editing!, overview: { ...editing!.overview, prerequisites: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })} />
                  <Input placeholder="Expected Deliverables (comma separated)" value={editing.expectedDeliverables.join(', ')} onChange={(e) => setEditing({ ...editing!, expectedDeliverables: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant={editing.features.aiRoadmap ? 'default' : 'secondary'} onClick={() => setEditing({ ...editing!, features: { ...editing!.features, aiRoadmap: !editing!.features.aiRoadmap } })} className="cursor-pointer">AI Roadmap</Badge>
                    <Badge variant={editing.features.aiGuide ? 'default' : 'secondary'} onClick={() => setEditing({ ...editing!, features: { ...editing!.features, aiGuide: !editing!.features.aiGuide } })} className="cursor-pointer">AI Guide</Badge>
                    <Badge variant={editing.features.autoEvaluation ? 'default' : 'secondary'} onClick={() => setEditing({ ...editing!, features: { ...editing!.features, autoEvaluation: !editing!.features.autoEvaluation } })} className="cursor-pointer">Auto-Evaluation</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Checkpoints</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {editing.checkpoints.map((cp, i) => (
                    <div key={cp.id} className="border rounded p-3 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input placeholder="Title" value={cp.title} onChange={(e) => {
                          const cps = [...editing.checkpoints]; cps[i] = { ...cp, title: e.target.value }; setEditing({ ...editing!, checkpoints: cps });
                        }} />
                        <Input placeholder="Deliverables (repo,report,demo)" value={cp.requiredDeliverables.join(',')} onChange={(e) => {
                          const cps = [...editing.checkpoints]; cps[i] = { ...cp, requiredDeliverables: e.target.value.split(',').map(s => s.trim()).filter(Boolean) as any }; setEditing({ ...editing!, checkpoints: cps });
                        }} />
                      </div>
                      <Textarea placeholder="Description" value={cp.description} onChange={(e) => {
                        const cps = [...editing.checkpoints]; cps[i] = { ...cp, description: e.target.value }; setEditing({ ...editing!, checkpoints: cps });
                      }} />
                      <div className="flex gap-2">
                        <Button size="sm" variant="destructive" onClick={() => setEditing({ ...editing!, checkpoints: editing.checkpoints.filter((x) => x.id !== cp.id) })}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => setEditing({ ...editing!, checkpoints: [...editing.checkpoints, emptyCheckpoint()] })}><Plus className="h-4 w-4 mr-2" /> Add Checkpoint</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Rubric <span className={totalRubric === 100 ? 'text-green-600' : 'text-red-600'}>({totalRubric}/100)</span></CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {editing.rubric.items.map((ri, i) => (
                    <div key={ri.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                      <Input className="md:col-span-8" placeholder="Criterion" value={ri.criterion} onChange={(e) => {
                        const items = [...editing.rubric.items]; items[i] = { ...ri, criterion: e.target.value }; setEditing({ ...editing!, rubric: { items } });
                      }} />
                      <Input className="md:col-span-3" type="number" min={0} max={100} value={ri.weight} onChange={(e) => {
                        const w = Math.max(0, Math.min(100, Number(e.target.value)));
                        const items = [...editing.rubric.items]; items[i] = { ...ri, weight: w }; setEditing({ ...editing!, rubric: { items } });
                      }} />
                      <Button className="md:col-span-1" size="sm" variant="destructive" onClick={() => setEditing({ ...editing!, rubric: { items: editing.rubric.items.filter(x => x.id !== ri.id) } })}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => setEditing({ ...editing!, rubric: { items: [...editing.rubric.items, emptyRubricItem()] } })}><Plus className="h-4 w-4 mr-2" /> Add Criterion</Button>
                </CardContent>
              </Card>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={save}>Save</Button>
                <Button onClick={publish} disabled={!canPublish}><Wand2 className="h-4 w-4 mr-2" /> Publish</Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          {!previewForId ? (
            <Card className="p-6"><div className="text-sm text-muted-foreground">Select a capstone and click Preview.</div></Card>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">Preview generates a sample roadmap for QA.</div>
              <Card className="p-4">
                <div className="space-y-2">
                  {(state.generatedRoadmaps[previewForId]?.phases || []).map(p => (
                    <div key={p.id} className="border rounded p-2">
                      <div className="font-medium">{p.title}</div>
                      <div className="text-sm text-muted-foreground">{p.description}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Analytics Dashboard</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {state.configs.map(c => (
                <Card key={c.id} className="p-3">
                  <div className="text-sm font-medium">{c.title}</div>
                  <div className="text-xs text-muted-foreground">Attempts: {state.analytics.attempts[c.id] || 0}</div>
                  <div className="text-xs text-muted-foreground">Completions: {state.analytics.completions[c.id] || 0}</div>
                  <div className="text-xs text-muted-foreground">Avg Score: {state.analytics.avgScore[c.id] || 0}</div>
                  <div className="text-xs text-muted-foreground">Plagiarism: {state.analytics.plagiarismIncidents[c.id] || 0}</div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

