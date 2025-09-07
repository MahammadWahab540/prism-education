import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SubTask {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  dependencies: string[];
  acceptanceCriteria: string[];
  subTasks: SubTask[];
  stageId?: string;
}

interface Props {
  task: Task;
  done: boolean;
  onToggle: (done: boolean) => void;
}

export function TaskCard({ task, done, onToggle }: Props) {
  const ac = task.acceptanceCriteria || [];
  const subs = task.subTasks || [];
  const depCount = task.dependencies?.length || 0;
  const criteriaId = (idx: number) => `${task.id}-ac-${idx}`;
  const subId = (sid: string, idx: number) => `${task.id}-st-${sid}-${idx}`;

  // For now, criteria/subtasks checkboxes are visual only; completion tracked via Done button
  return (
    <div className={`border rounded p-2 text-sm bg-muted/40 ${done ? 'opacity-70' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="font-medium pr-2 line-clamp-1">{task.title}</div>
        {depCount > 0 && <Badge variant="outline">{depCount} deps</Badge>}
      </div>
      <div className="text-xs text-muted-foreground mt-1 line-clamp-3">{task.description}</div>
      {!!ac.length && (
        <div className="mt-2 space-y-1">
          <div className="text-xs font-medium">Acceptance Criteria</div>
          {ac.slice(0, 5).map((c, i) => (
            <label key={criteriaId(i)} className="flex items-center gap-2 text-xs">
              <input type="checkbox" className="h-3 w-3" disabled />
              <span className="line-clamp-2">{c}</span>
            </label>
          ))}
        </div>
      )}
      {!!subs.length && (
        <div className="mt-2 space-y-1">
          <div className="text-xs font-medium">Subtasks</div>
          {subs.slice(0, 4).map((s, i) => (
            <label key={subId(s.id, i)} className="flex items-center gap-2 text-xs">
              <input type="checkbox" className="h-3 w-3" disabled />
              <span className="line-clamp-2">{s.title}</span>
            </label>
          ))}
        </div>
      )}
      <div className="mt-2">
        <Button size="sm" className="w-full" variant={done ? 'secondary' : 'default'} onClick={() => onToggle(!done)}>
          {done ? 'Mark as Not Done' : 'Mark as Done'}
        </Button>
      </div>
    </div>
  );
}

export default TaskCard;

