import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCapstones } from '@/hooks/useCapstones';
import { orchestrateCapstone, orchestrationToRoadmap, type OrchestratorOutput, type UnlockedState, type InstanceState } from '@/lib/capstoneOrchestrator';
import type { CapstoneTemplate } from '@/types/capstone';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  skillId: string;
  skillName: string;
  onCreated: (instanceId: string) => void;
}

export function CapstonePickerModal({ open, onOpenChange, skillId, skillName, onCreated }: Props) {
  const { user } = useAuth();
  const { createInstance, upsertTemplate, setInstanceRoadmap } = useCapstones();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OrchestratorOutput | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setLoading(true);
    try {
      // Mock learning roadmap progress as completed for demonstration
      const orchestratorInput = {
        mode: 'mock' as const,
        learner: { userId: user?.id || 'user', tenantId: user?.tenantId },
        skill: { name: skillName, level: 'Intermediate', tags: [] },
        learningRoadmapProgress: {
          stages: [
            { id: 'stage-1', name: 'Fundamentals', done: true },
            { id: 'stage-2', name: 'Projects', done: true },
            { id: 'stage-3', name: 'Advanced Topics', done: true }
          ],
          allDone: true,
          percent: 100
        },
        selectedTemplateId: null
      };
      const o = orchestrateCapstone(orchestratorInput);
      setData(o);
      setSelectedId(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  }, [open, skillName, user?.id, user?.tenantId]);

  const canConfirm = useMemo(() => !!selectedId, [selectedId]);

  const confirm = () => {
    if (!selectedId || !user || !data || data.status !== 'UNLOCKED') return;
    setLoading(true);
    setError(null);
    try {
      // Generate instance with selected template
      const orchestratorInput = {
        mode: 'mock' as const,
        learner: { userId: user.id, tenantId: user.tenantId },
        skill: { name: skillName, level: 'Intermediate', tags: [] },
        learningRoadmapProgress: {
          stages: [
            { id: 'stage-1', name: 'Fundamentals', done: true },
            { id: 'stage-2', name: 'Projects', done: true },
            { id: 'stage-3', name: 'Advanced Topics', done: true }
          ],
          allDone: true,
          percent: 100
        },
        selectedTemplateId: selectedId
      };
      const instanceResult = orchestrateCapstone(orchestratorInput) as InstanceState;
      const selected = data.suggestions.find(s => s.id === selectedId)!;
      
      const template: CapstoneTemplate = {
        id: selected.id,
        skillId,
        title: selected.title,
        difficulty: selected.difficulty,
        tags: selected.tags,
        overview: { problem: selected.overview.problem, objective: selected.overview.objective },
      };
      upsertTemplate?.(template);
      const inst = createInstance(user.id, user.tenantId, template);
      const roadmap = orchestrationToRoadmap(instanceResult);
      setInstanceRoadmap?.(inst.id, roadmap);
      onOpenChange(false);
      onCreated(inst.id);
    } catch (e: any) {
      setError(e?.message || 'Failed to create instance');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>;
    if (error) return <div className="text-sm text-red-600">{error}</div>;
    if (!data) return null;

    if (data.status === 'LOCKED') {
      return (
        <div className="text-center py-8 space-y-4">
          <div className="text-lg font-medium">Capstone Project Locked</div>
          <div className="text-muted-foreground">{data.reason}</div>
          {data.unlockHint.length > 0 && (
            <div className="space-y-2">
              <div className="font-medium">To unlock, complete:</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                {data.unlockHint.map((hint, i) => (
                  <li key={i}>• {hint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    if (data.status === 'UNLOCKED') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.suggestions.map(s => (
            <Card key={s.id} className={selectedId === s.id ? 'ring-2 ring-primary' : ''}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  {s.title}
                  <Badge variant="secondary">{s.difficulty}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-1">{s.tags.slice(0,4).map(t => <Badge key={t} variant="outline">{t}</Badge>)}</div>
                <div className="text-sm">
                  <div className="font-medium">Problem</div>
                  <div className="text-muted-foreground">{s.overview.problem}</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Objective</div>
                  <div className="text-muted-foreground">{s.overview.objective}</div>
                </div>
                {s.whyFit && (
                  <div className="text-sm">
                    <div className="font-medium">Why This Fits</div>
                    <div className="text-muted-foreground">{s.whyFit}</div>
                  </div>
                )}
                <Button className="w-full" variant={selectedId === s.id ? 'default' : 'outline'} onClick={() => setSelectedId(s.id)}>
                  {selectedId === s.id ? 'Selected' : 'Select'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    // INSTANCE state shouldn't happen in this modal
    return <div className="text-center py-8">Unexpected state. Please refresh and try again.</div>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Your Capstone Project</DialogTitle>
        </DialogHeader>
        
        {renderContent()}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={confirm} 
            disabled={!canConfirm || loading || data?.status !== 'UNLOCKED'}
          >
            Confirm Selection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CapstonePickerModal;
