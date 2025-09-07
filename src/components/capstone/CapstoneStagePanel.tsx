import React from 'react';
import type { CapstoneRoadmap, CapstoneStageSpec } from '@/types/capstone';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { CapstoneGuideChat } from './CapstoneGuideChat';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  roadmap: CapstoneRoadmap;
  stageId: string | null;
  checklist: Record<string, boolean>;
  onToggleChecklist: (item: string, checked: boolean) => void;
  onMarkDone: () => void;
}

export function CapstoneStagePanel({ open, onOpenChange, roadmap, stageId, checklist, onToggleChecklist, onMarkDone }: Props) {
  const stage: CapstoneStageSpec | undefined = stageId ? roadmap.stages.find(s => s.id === stageId) : undefined;
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{stage ? stage.name : 'Stage'}</DrawerTitle>
        </DrawerHeader>
        {stage && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <div className="font-medium">UI Checks</div>
                <div className="space-y-1 mt-2">
                  {stage.uiChecks.map(item => (
                    <label key={item} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={!!checklist[item]} onChange={(e) => onToggleChecklist(item, e.target.checked)} />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-medium">Validation</div>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {stage.validation.map(v => (<li key={v}>{v}</li>))}
                </ul>
              </div>
              <div>
                <div className="font-medium">Expected Outcome</div>
                <div className="text-sm text-muted-foreground">{stage.expectedOutcome}</div>
              </div>
              <Button onClick={onMarkDone}>Mark Stage Done</Button>
            </div>
            <div>
              <CapstoneGuideChat contextTitle={stage.name} validation={stage.validation} acceptanceCriteria={[]} />
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
