import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCapstones } from '@/hooks/useCapstones';
import { useAuth } from '@/contexts/AuthContext';
import { CapstoneInstanceBoard } from '@/components/capstone/CapstoneInstanceBoard';
import { CapstoneStagePanel } from '@/components/capstone/CapstoneStagePanel';
import { Card, CardContent } from '@/components/ui/card';

const CapstoneInstancePage = () => {
  const { instanceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, getInstance, generateInstanceRoadmap, updateStageChecklist, markStageDone, getInstanceProgressPercent, addInstanceSubmission } = useCapstones();
  const instance = getInstance(instanceId!);
  const roadmap = instance?.roadmap;
  const progress = getInstanceProgressPercent(instanceId!);
  const doneMap = state.instanceProgress[instanceId!]?.stages ? Object.fromEntries(Object.entries(state.instanceProgress[instanceId!].stages).map(([k,v]) => [k, v.done])) : undefined;

  useEffect(() => {
    if (instance && !instance.roadmap) {
      const tpl = state.templates.find(t => t.id === instance.templateId);
      if (tpl) generateInstanceRoadmap(instance.id, tpl);
    }
  }, [instance?.id]);

  const [openStageId, setOpenStageId] = useState<string | null>(null);

  const latestSubmission = useMemo(() => (state.instanceSubmissions[instanceId!] || []).slice(-1)[0], [state.instanceSubmissions, instanceId]);

  const [sub, setSub] = useState({ type: 'URL', link: '', notes: '' });
  const onSubmit = () => {
    if (!instance) return;
    // Prevent submit unless all stages done
    const stageStates = state.instanceProgress[instance.id]?.stages || {};
    const allDone = Object.values(stageStates).every(s => s.done);
    if (!allDone) {
      alert('Complete all stages before submitting.');
      return;
    }
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
          <h1 className="text-2xl font-bold">Capstone Instance</h1>
          <div className="text-sm text-muted-foreground">Progress: {progress}%</div>
        </div>

        {!instance ? (
          <div className="text-sm text-muted-foreground">Instance not found.</div>
        ) : !roadmap ? (
          <div className="text-sm text-muted-foreground">Generating roadmap...</div>
        ) : (
          <>
            <CapstoneInstanceBoard roadmap={roadmap} onOpenStage={(id) => setOpenStageId(id)} doneMap={doneMap} />

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="font-medium">Submission</div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <select className="border rounded px-3 py-2" value={sub.type} onChange={(e) => setSub(prev => ({ ...prev, type: e.target.value }))}>
                    <option>URL</option>
                    <option>GitHub</option>
                    <option>Drive</option>
                  </select>
                  <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Link" value={sub.link} onChange={(e) => setSub(prev => ({ ...prev, link: e.target.value }))} />
                  <input className="border rounded px-3 py-2" placeholder="Notes" value={sub.notes} onChange={(e) => setSub(prev => ({ ...prev, notes: e.target.value }))} />
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={onSubmit}>Submit Capstone</Button>
                  {latestSubmission && (
                    <div className="text-sm">Status: <span className="font-medium">{latestSubmission.status}</span> • <a href={latestSubmission.link} target="_blank" className="underline">Link</a></div>
                  )}
                </div>
              </CardContent>
            </Card>

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
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CapstoneInstancePage;
