import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EvaluationResult } from '@/types/capstone';
import { Badge } from '@/components/ui/badge';

interface Props {
  result?: EvaluationResult;
}

export function CapstoneEvaluationPanel({ result }: Props) {
  if (!result) {
    return <div className="text-sm text-muted-foreground">No evaluation yet. Submit your work to see results.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluation Result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Badge variant={result.pass ? 'default' : 'destructive'}>{result.pass ? 'Pass' : 'Fail'}</Badge>
          <div className="text-sm">Score: <span className="font-medium">{result.totalScore}</span>/100</div>
          <div className="text-sm">Plagiarism: <span className={result.plagiarismPercent >= 30 ? 'text-red-600 font-medium' : ''}>{result.plagiarismPercent}%</span></div>
        </div>
        <div className="text-sm text-muted-foreground">{result.feedbackSummary}</div>
        <div className="space-y-2">
          {result.items.map((i) => (
            <div key={i.rubricItemId} className="flex items-center justify-between text-sm border rounded p-2">
              <div className="text-muted-foreground">{i.rubricItemId}</div>
              <div className="font-medium">{i.score}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground">Evaluated at: {new Date(result.evaluatedAt).toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

