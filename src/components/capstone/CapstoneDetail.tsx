import React, { useMemo, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { CapstoneConfig, CapstoneSubmission } from '@/types/capstone';
import { CapstoneGuideChat } from './CapstoneGuideChat';
import { CapstoneEvaluationPanel } from './CapstoneEvaluationPanel';
import { useCapstones } from '@/hooks/useCapstones';

interface Props {
  capstone: CapstoneConfig;
}

export function CapstoneDetail({ capstone }: Props) {
  const { state, enroll, generateRoadmap, submit, evaluate } = useCapstones();
  const [genError, setGenError] = useState<string | null>(null);
  const generated = state.generatedRoadmaps[capstone.id];
  const enrolledCapstoneId = state.enrollments[capstone.skillId];
  const isEnrolled = enrolledCapstoneId === capstone.id;
  const checkpoints = capstone.checkpoints;

  const canGenerate = capstone.features.aiRoadmap;
  const canGuide = capstone.features.aiGuide;
  const canAutoEval = capstone.features.autoEvaluation;

  const onEnroll = () => enroll(capstone.skillId, capstone.id);
  const onGenerate = () => {
    try {
      setGenError(null);
      generateRoadmap(capstone, { pace: 'normal' });
    } catch (e: any) {
      setGenError(e?.message || 'Failed to generate roadmap');
    }
  };

  const latestSubmissionId = useMemo(() => {
    const arr = state.submissions[capstone.id] || [];
    return arr.length ? arr[arr.length - 1].id : undefined;
  }, [state.submissions, capstone.id]);
  const evalResult = latestSubmissionId ? state.evaluations[latestSubmissionId] : undefined;

  const [links, setLinks] = useState({ repo: '', report: '', demo: '' });
  const onSubmit = () => {
    const submission: CapstoneSubmission = {
      id: `sub-${Date.now()}`,
      capstoneId: capstone.id,
      skillId: capstone.skillId,
      submittedAt: new Date().toISOString(),
      links: { ...links },
    };
    submit(submission);
    if (canAutoEval) {
      evaluate(submission.id, capstone.id);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{capstone.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-muted-foreground">{capstone.overview.description}</div>
          <div className="text-sm">Outcomes: {capstone.overview.outcomes.join(', ')}</div>
          <div className="text-sm">Prerequisites: {capstone.overview.prerequisites.join(', ')}</div>
          {!isEnrolled && (
            <Button className="mt-2" onClick={onEnroll}>Enroll in Capstone</Button>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-roadmap">AI Roadmap</TabsTrigger>
          <TabsTrigger value="guide">Guide</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Checkpoints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {checkpoints.map(cp => (
                <div key={cp.id} className="border rounded p-3">
                  <div className="font-medium">{cp.title}</div>
                  <div className="text-sm text-muted-foreground">{cp.description}</div>
                  <div className="text-xs mt-1">Deliverables: {cp.requiredDeliverables.join(', ')}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-roadmap" className="space-y-3">
          {!canGenerate ? (
            <div className="text-sm text-muted-foreground">AI Roadmap is disabled for this capstone.</div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onGenerate}>Generate Roadmap</Button>
                {genError && <div className="text-xs text-red-600">{genError}</div>}
              </div>
              {generated ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {generated.phases.map((p, idx) => (
                      <div key={p.id} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs mt-1">{idx + 1}</div>
                        <div className="flex-1">
                          <div className="font-medium">{p.title}</div>
                          <div className="text-sm text-muted-foreground">{p.description}</div>
                          {p.deadline && (
                            <div className="text-xs mt-1">Due by: {new Date(p.deadline).toLocaleDateString()}</div>
                          )}
                          <div className="text-xs mt-1">Resources: {p.resources.map(r => r.title).join(', ')}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <div className="text-sm text-muted-foreground">Click Generate to create a personalized roadmap.</div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="guide" className="space-y-3">
          {!canGuide ? (
            <div className="text-sm text-muted-foreground">AI Guide is disabled for this capstone.</div>
          ) : (
            <CapstoneGuideChat contextTitle={capstone.title} />
          )}
        </TabsContent>

        <TabsContent value="evaluation" className="space-y-3">
          {!canAutoEval && <div className="text-sm text-muted-foreground">Auto-Evaluation is disabled for this capstone.</div>}
          <Card>
            <CardHeader>
              <CardTitle>Submit Deliverables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input className="border rounded px-3 py-2" placeholder="Repository URL" value={links.repo} onChange={(e) => setLinks(prev => ({ ...prev, repo: e.target.value }))} />
                <input className="border rounded px-3 py-2" placeholder="Report URL" value={links.report} onChange={(e) => setLinks(prev => ({ ...prev, report: e.target.value }))} />
                <input className="border rounded px-3 py-2" placeholder="Demo URL" value={links.demo} onChange={(e) => setLinks(prev => ({ ...prev, demo: e.target.value }))} />
              </div>
              <Button onClick={onSubmit}>Submit</Button>
            </CardContent>
          </Card>

          <CapstoneEvaluationPanel result={evalResult} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

