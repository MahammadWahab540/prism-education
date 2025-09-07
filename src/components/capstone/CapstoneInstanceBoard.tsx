import React, { useMemo } from 'react';
import type { CapstoneRoadmap } from '@/types/capstone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TaskCard } from './TaskCard';

interface Props {
  roadmap: CapstoneRoadmap;
  onOpenStage: (stageId: string) => void;
  doneMap?: Record<string, boolean>;
  taskDoneMap?: Record<string, boolean>;
  onToggleTaskDone?: (taskId: string, done: boolean) => void;
}

export function CapstoneInstanceBoard({ roadmap, onOpenStage, doneMap, taskDoneMap, onToggleTaskDone }: Props) {
  const tasksByStage = useMemo(() => {
    const tasks = roadmap.subProjects.flatMap(sp => sp.tasks.map(t => ({ ...t, spId: sp.id })));
    const stages = roadmap.stages;
    // Bucket by explicit stageId if present, otherwise distribute evenly
    const buckets: Record<string, typeof tasks> = {};
    stages.forEach(s => { buckets[s.id] = []; });
    tasks.forEach((t, idx) => {
      const sid = (t as any).stageId || stages[idx % stages.length].id;
      if (!buckets[sid]) buckets[sid] = [];
      buckets[sid].push(t);
    });
    return buckets;
  }, [roadmap]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {roadmap.stages.sort((a,b)=>a.order-b.order).map(stage => (
        <Card key={stage.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <span>{stage.name}</span>
              {doneMap?.[stage.id] && <span className="text-xs text-green-700">Done</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(tasksByStage[stage.id] || []).map(t => (
              <TaskCard
                key={t.id}
                task={t as any}
                done={!!taskDoneMap?.[t.id]}
                onToggle={(d) => onToggleTaskDone && onToggleTaskDone(t.id, d)}
              />
            ))}
            <Button variant="outline" className="w-full" onClick={() => onOpenStage(stage.id)}>Open Stage</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
