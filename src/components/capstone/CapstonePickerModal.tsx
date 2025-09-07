import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCapstones } from '@/hooks/useCapstones';
import { buildMockOrchestration, orchestrationToRoadmap, Orchestration } from '@/lib/capstoneOrchestrator';
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
  const [data, setData] = useState<Orchestration | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setLoading(true);
    try {
      const o = buildMockOrchestration({ mode: 'mock', skill: skillName, userId: user?.id || 'user', tenantId: user?.tenantId, selectedTemplateId: undefined });
      setData(o);
      setSelectedId(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  }, [open]);

  const canConfirm = useMemo(() => !!selectedId, [selectedId]);

  const confirm = () => {
    if (!selectedId || !user) return;
    setLoading(true);
    setError(null);
    try {
      const o = buildMockOrchestration({ mode: 'mock', skill: skillName, userId: user.id, tenantId: user.tenantId, selectedTemplateId: selectedId });
      const selected = o.suggestions.find(s => s.id === selectedId)!;
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
      const roadmap = orchestrationToRoadmap(o);
      setInstanceRoadmap?.(inst.id, roadmap);
      onOpenChange(false);
      onCreated(inst.id);
    } catch (e: any) {
      setError(e?.message || 'Failed to create instance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Your Capstone Project</DialogTitle>
        </DialogHeader>
        {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {!!data && (
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
                  <Button className="w-full" variant={selectedId === s.id ? 'default' : 'outline'} onClick={() => setSelectedId(s.id)}>
                    {selectedId === s.id ? 'Selected' : 'Select'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={confirm} disabled={!canConfirm || loading}>Confirm Selection</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CapstonePickerModal;
