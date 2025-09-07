import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Props {
  allDone: boolean;
  overallPercentage: number;
  onSelectProject: () => void;
}

export function CapstoneCard({ allDone, overallPercentage, onSelectProject }: Props) {
  if (!allDone) {
    return (
      <Card className="opacity-80">
        <CardHeader>
          <CardTitle className="text-base">Capstone (Locked)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground">Complete all stages of Learning Roadmap to unlock.</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs"><span>Overall Progress</span><span>{overallPercentage}%</span></div>
            <Progress value={overallPercentage} />
          </div>
          <Button className="w-full" disabled variant="secondary">Locked</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Start Your Capstone Project</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">Apply your skills by building a real-world project.</div>
        <Button className="w-full" onClick={onSelectProject}>Select Project</Button>
      </CardContent>
    </Card>
  );
}

export default CapstoneCard;

