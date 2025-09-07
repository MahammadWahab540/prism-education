import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCapstones } from '@/hooks/useCapstones';
import { useAuth } from '@/contexts/AuthContext';
import { CapstoneInstanceBoard } from '@/components/capstone/CapstoneInstanceBoard';
import { CapstoneStagePanel } from '@/components/capstone/CapstoneStagePanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CapstoneGuideChat } from '@/components/capstone/CapstoneGuideChat';

const CapstoneDetailView = () => {
  const { instanceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, getInstance, updateStageChecklist, markStageDone, getInstanceProgressPercent, addInstanceSubmission, toggleTaskDone } = useCapstones();
  const instance = getInstance(instanceId!);
  const roadmap = instance?.roadmap;
  const progress = instance ? getInstanceProgressPercent(instance.id) : 0;
  const tpl = state.templates.find(t => t.id === instance?.templateId);

  const stageDoneMap = instance && state.instanceProgress[instance.id]?.stages ? Object.fromEntries(Object.entries(state.instanceProgress[instance.id].stages).map(([k,v]) => [k, v.done])) : undefined;
  const taskDoneMap = instance ? (state.instanceProgress[instance.id]?.tasks || {}) : {};
  const [openStageId, setOpenStageId] = useState<string | null>(null);
  const latestSubmission = useMemo(() => (state.instanceSubmissions[instanceId!] || []).slice(-1)[0], [state.instanceSubmissions, instanceId]);
  const [sub, setSub] = useState({ type: 'URL', link: '', notes: '' });

  useEffect(() => {
    if (!instance) return;
    if (!roadmap) {
      // roadmap should already be set by orchestrator flow; keep placeholder if missing
    }
  }, [instance?.id]);

  const onSubmit = () => {
    if (!instance) return;
    // Prevent submit unless all stages done
    const stageStates = state.instanceProgress[instance.id]?.stages || {};
    const allDone = Object.values(stageStates).every(s => s.done);
    if (!allDone) { alert('Complete all stages before submitting.'); return; }
    try {
      addInstanceSubmission(instance.id, { type: sub.type as any, link: sub.link, notes: sub.notes, tenantId: user?.tenantId });
    } catch (e: any) {
      alert(e?.message || 'Submission failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            {instance?.roadmap?.project.title || 'Capstone Instance'}
            {instance && <Badge variant={instance.status === 'Approved' ? 'default' : instance.status === 'ChangesRequested' ? 'destructive' : 'secondary'}>{instance.status}</Badge>}
          </h1>
          <div className="text-sm text-muted-foreground">Progress: {progress}%</div>
        </div>

        {!instance ? (
          <div className="text-sm text-muted-foreground">Instance not found.</div>
        ) : !roadmap ? (
          <div className="text-sm text-muted-foreground">Preparing roadmap...</div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              <TabsTrigger value="guide">Guide</TabsTrigger>
              <TabsTrigger value="submission">Submission</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {tpl && <Badge variant="secondary">{tpl.difficulty}</Badge>}
                    {tpl?.tags?.slice(0, 6).map(t => <Badge key={t} variant="outline">{t}</Badge>)}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Problem</div>
                    <div className="text-muted-foreground">{tpl?.overview.problem || '—'}</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Objective</div>
                    <div className="text-muted-foreground">{tpl?.overview.objective || instance.roadmap?.project.summary}</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roadmap">
              <CapstoneInstanceBoard
                roadmap={roadmap}
                onOpenStage={(id) => setOpenStageId(id)}
                doneMap={stageDoneMap}
                taskDoneMap={taskDoneMap}
                onToggleTaskDone={(taskId, d) => instance && toggleTaskDone(instance.id, taskId, d)}
              />
              <CapstoneStagePanel
                open={!!openStageId}
                onOpenChange={(v) => !v && setOpenStageId(null)}
                roadmap={roadmap}
                stageId={openStageId}
                checklist={openStageId ? (state.instanceProgress[instance.id]?.stages[openStageId]?.checklist || {}) : {}}
                onToggleChecklist={(item, checked) => updateStageChecklist(instance.id, openStageId!, item, checked)}
                onMarkDone={() => {
                  const st = roadmap.stages.find(s => s.id === openStageId!);
                  const checked = state.instanceProgress[instance.id]?.stages[openStageId!]?.checklist || {};
                  const allChecked = (st?.uiChecks || []).every(c => checked[c]);
                  if (!allChecked) { alert('Please complete all UI Checks before marking done.'); return; }
                  markStageDone(instance.id, openStageId!, true); setOpenStageId(null);
                }}
              />
            </TabsContent>

            <TabsContent value="guide">
              <Card>
                <CardHeader>
                  <CardTitle>AI Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const stages = roadmap.stages.sort((a,b)=>a.order-b.order);
                    const prog = instance ? state.instanceProgress[instance.id]?.stages || {} : {};
                    const current = stages.find(s => !prog[s.id]?.done) || stages[stages.length - 1];
                    const ac = roadmap.subProjects.flatMap(sp => sp.tasks.filter(t => (t as any).stageId === current.id).flatMap(t => t.acceptanceCriteria || []));
                    return (
                      <CapstoneGuideChat
                        contextTitle={`${current.name}`}
                        acceptanceCriteria={ac.slice(0, 5)}
                        validation={(current.validation || []).slice(0, 3)}
                      />
                    );
                  })()}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="submission">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="font-medium">Submission</div>
                  {(() => {
                    const latest = instance ? state.instanceSubmissions[instance.id]?.slice(-1)[0] : null;
                    const readonly = !!latest;
                    return (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                          <select className="border rounded px-3 py-2" value={sub.type} onChange={(e) => setSub(prev => ({ ...prev, type: e.target.value }))} disabled={readonly}>
                            <option>URL</option>
                            <option>GitHub</option>
                            <option>Drive</option>
                          </select>
                          <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Link" value={readonly ? latest?.link || '' : sub.link} onChange={(e) => setSub(prev => ({ ...prev, link: e.target.value }))} disabled={readonly} />
                          <textarea className="border rounded px-3 py-2" placeholder="Notes" value={readonly ? (latest?.notes || '') : sub.notes} onChange={(e) => setSub(prev => ({ ...prev, notes: e.target.value }))} disabled={readonly} />
                        </div>
                        <div className="flex items-center gap-3">
                          <Button onClick={onSubmit} disabled={readonly}>Submit Capstone</Button>
                          {latest && (
                            <div className="text-sm">Status: <span className="font-medium">{latest.status}</span> • <a href={latest.link} target="_blank" className="underline">Link</a> • Submitted {new Date(latest.submittedAt).toLocaleString()}</div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">Visible to: Platform Owner, Tenant Admin</div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CapstoneDetailView;
