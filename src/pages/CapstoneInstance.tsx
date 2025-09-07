import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Clock, FileText, ExternalLink, Users, Shield } from 'lucide-react';
import { useCapstones } from '@/hooks/useCapstones';
import { useAuth } from '@/contexts/AuthContext';
import { CapstoneInstanceBoard } from '@/components/capstone/CapstoneInstanceBoard';
import { CapstoneStagePanel } from '@/components/capstone/CapstoneStagePanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

const CapstoneInstancePage = () => {
  const { instanceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, getInstance, generateInstanceRoadmap, updateStageChecklist, markStageDone, getInstanceProgressPercent, addInstanceSubmission, toggleTaskDone } = useCapstones();
  const instance = getInstance(instanceId!);
  const roadmap = instance?.roadmap;
  const progress = getInstanceProgressPercent(instanceId!);
  const doneMap = state.instanceProgress[instanceId!]?.stages ? Object.fromEntries(Object.entries(state.instanceProgress[instanceId!].stages).map(([k,v]) => [k, v.done])) : undefined;

  // Check if user is trying to access a non-existent instance but we have a demo instance
  useEffect(() => {
    if (!instance && instanceId && instanceId !== 'demo-instance-123') {
      const demoInstance = state.instances.find(i => i.id === 'demo-instance-123');
      if (demoInstance && user?.id === 'demo-user') {
        // Redirect to demo instance if user is trying to access a non-existent instance
        navigate('/capstone-instance/demo-instance-123', { replace: true });
      }
    }
  }, [instance, instanceId, state.instances, user?.id, navigate]);

  const [openStageId, setOpenStageId] = useState<string | null>(null);

  const latestSubmission = useMemo(() => (state.instanceSubmissions[instanceId!] || []).slice(-1)[0], [state.instanceSubmissions, instanceId]);

  const [sub, setSub] = useState({ type: 'URL', link: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const stageStats = useMemo(() => {
    if (!roadmap || !instance) return { completed: 0, total: 0 };
    const stageStates = state.instanceProgress[instance.id]?.stages || {};
    const completed = Object.values(stageStates).filter(s => s.done).length;
    return { completed, total: roadmap.stages.length };
  }, [roadmap, instance, state.instanceProgress]);

  const taskStats = useMemo(() => {
    if (!roadmap || !instance) return { completed: 0, total: 0 };
    const taskStates = state.instanceProgress[instance.id]?.tasks || {};
    const allTasks = roadmap.subProjects.flatMap(sp => sp.tasks);
    const completed = allTasks.filter(t => taskStates[t.id]).length;
    return { completed, total: allTasks.length };
  }, [roadmap, instance, state.instanceProgress]);

  const onSubmit = async () => {
    if (!instance) return;
    if (!sub.link.trim()) {
      toast({ title: "Error", description: "Please provide a submission link", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      addInstanceSubmission(instance.id, { 
        type: sub.type as any, 
        link: sub.link, 
        notes: sub.notes, 
        tenantId: user?.tenantId 
      });
      toast({ title: "Success", description: "Capstone submitted successfully! It will be reviewed by your administrators." });
      setSub({ type: 'URL', link: '', notes: '' });
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || 'Submission failed', variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!instance) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="text-muted-foreground">
              Capstone instance not found (ID: {instanceId}).
            </div>
            <div className="text-sm text-muted-foreground">
              This might happen if the instance was deleted or if you're using an old link.
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate('/capstone-instance/demo-instance-123')}>
                Try Demo Instance
              </Button>
              <Button onClick={() => navigate('/roadmap')}>Back to Roadmap</Button>
              <Button variant="outline" onClick={() => navigate('/capstone')}>Browse Capstones</Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {roadmap?.project.title || "Capstone Project"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {roadmap?.project.summary}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:ml-auto">
            <Badge variant={instance.status === 'Active' ? 'default' : 'secondary'}>
              {instance.status}
            </Badge>
            <div className="text-sm text-muted-foreground">
              Progress: {progress}%
            </div>
          </div>
        </div>

        {!roadmap ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center space-y-2">
              <Clock className="h-8 w-8 mx-auto text-muted-foreground animate-spin" />
              <div className="text-sm text-muted-foreground">Generating roadmap...</div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stages">Stages</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="submit">Submit</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Stages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stageStats.completed}/{stageStats.total}
                    </div>
                    <Progress value={(stageStats.completed / stageStats.total) * 100} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {taskStats.completed}/{taskStats.total}
                    </div>
                    <Progress value={(taskStats.completed / taskStats.total) * 100} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {progress}%
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {progress === 100 ? 'Complete!' : 'In Progress'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Objective</h4>
                    <p className="text-sm text-muted-foreground">{roadmap.project.summary}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Stages Breakdown</h4>
                    <div className="space-y-2">
                      {roadmap.stages.sort((a,b) => a.order - b.order).map(stage => {
                        const isDone = doneMap?.[stage.id];
                        return (
                          <div key={stage.id} className="flex items-center gap-2 text-sm">
                            <CheckCircle className={`h-4 w-4 ${isDone ? 'text-green-600' : 'text-muted-foreground'}`} />
                            <span className={isDone ? 'line-through text-muted-foreground' : ''}>{stage.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stages">
              <CapstoneInstanceBoard 
                roadmap={roadmap} 
                onOpenStage={(id) => setOpenStageId(id)} 
                doneMap={doneMap}
                taskDoneMap={state.instanceProgress[instance.id]?.tasks}
                onToggleTaskDone={(taskId, done) => toggleTaskDone(instance.id, taskId, done)}
              />
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
              {roadmap.subProjects.map(subProject => (
                <Card key={subProject.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{subProject.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{subProject.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {subProject.tasks.map(task => {
                      const isDone = state.instanceProgress[instance.id]?.tasks?.[task.id];
                      return (
                        <div key={task.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle 
                              className={`h-4 w-4 cursor-pointer ${isDone ? 'text-green-600' : 'text-muted-foreground'}`}
                              onClick={() => toggleTaskDone(instance.id, task.id, !isDone)}
                            />
                            <h4 className={`font-medium ${isDone ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground pl-6">{task.description}</p>
                          
                          {task.acceptanceCriteria.length > 0 && (
                            <div className="pl-6">
                              <h5 className="text-sm font-medium mb-1">Acceptance Criteria:</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {task.acceptanceCriteria.map((criteria, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-xs mt-1">•</span>
                                    <span>{criteria}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {task.subTasks.length > 0 && (
                            <div className="pl-6 space-y-2">
                              <h5 className="text-sm font-medium">Subtasks:</h5>
                              {task.subTasks.map(subTask => (
                                <div key={subTask.id} className="text-sm bg-muted/50 rounded p-2">
                                  <div className="font-medium">{subTask.title}</div>
                                  <div className="text-muted-foreground">{subTask.description}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="submit" className="space-y-6">
              {latestSubmission ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Submission Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant={latestSubmission.status === 'Approved' ? 'default' : 'secondary'}>
                          {latestSubmission.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          Submitted on {new Date(latestSubmission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={latestSubmission.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Submission
                        </a>
                      </Button>
                    </div>

                    {latestSubmission.notes && (
                      <div>
                        <h4 className="font-medium mb-2">Notes</h4>
                        <p className="text-sm text-muted-foreground bg-muted/50 rounded p-3">
                          {latestSubmission.notes}
                        </p>
                      </div>
                    )}

                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                          <Shield className="h-4 w-4" />
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-900 dark:text-blue-100">Access Control</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Your submission is securely accessible only to your Tenant Administrator and Platform Owner for review and evaluation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Your Capstone</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Share your completed project with your administrators for review.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Submission Type</label>
                        <select 
                          className="w-full border rounded-lg px-3 py-2 bg-background" 
                          value={sub.type} 
                          onChange={(e) => setSub(prev => ({ ...prev, type: e.target.value }))}
                        >
                          <option value="URL">Website URL</option>
                          <option value="GitHub">GitHub Repository</option>
                          <option value="Drive">Google Drive</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-1 block">Project Link *</label>
                        <input 
                          className="w-full border rounded-lg px-3 py-2" 
                          placeholder="https://..." 
                          value={sub.link} 
                          onChange={(e) => setSub(prev => ({ ...prev, link: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Additional Notes (Optional)</label>
                      <textarea 
                        className="w-full border rounded-lg px-3 py-2 h-20 resize-none" 
                        placeholder="Any additional information about your submission..." 
                        value={sub.notes} 
                        onChange={(e) => setSub(prev => ({ ...prev, notes: e.target.value }))}
                      />
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-900 dark:text-amber-100">Secure Submission</h4>
                          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                            Your submission will be visible only to your Tenant Administrator and Platform Owner. 
                            Ensure your project link is accessible to authorized reviewers.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button 
                        onClick={onSubmit} 
                        disabled={!sub.link.trim() || isSubmitting}
                        className="flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Clock className="h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4" />
                            Submit Capstone
                          </>
                        )}
                      </Button>
                      
                      {stageStats.completed < stageStats.total && (
                        <p className="text-sm text-muted-foreground">
                          Complete all stages before submitting ({stageStats.completed}/{stageStats.total} done)
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}

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
            if (!allChecked) { 
              toast({ title: "Error", description: "Please complete all UI Checks before marking done.", variant: "destructive" });
              return; 
            }
            markStageDone(instance.id, openStageId!, true); 
            setOpenStageId(null);
            toast({ title: "Success", description: `${st?.name} marked as complete!` });
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default CapstoneInstancePage;
