import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Globe, Building2, Sparkles, ExternalLink, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { MultiTenantCombobox } from './MultiTenantCombobox';
import { MultiCareerSelect } from './MultiCareerSelect';
import { IconPicker } from './IconPicker';
import { CapstoneEditorDialog } from './CapstoneEditorDialog';

interface Stage {
  id: string;
  name: string;
  description: string;
  externalLink?: string;
  aiTutor?: { generated: boolean; content?: string };
  caseStudy?: { generated: boolean; content?: string };
  quiz?: { generated: boolean; content?: string };
}

type IconType = { type: 'emoji'; value: string } | { type: 'image'; value: string } | { type: 'url'; value: string };

interface Skill {
  id: string;
  name: string;
  description: string;
  scope: 'global' | 'tenant';
  tenants: string[];
  icon: IconType;
  careerChoices: string[];
  status: 'draft' | 'public';
  stages: Stage[];
  createdAt: string;
}

function detectLinkType(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('drive.google.com')) return 'Google Drive';
  return 'External';
}

export function SkillManagement() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isStageBuilderOpen, setIsStageBuilderOpen] = useState(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [isCapstoneDialogOpen, setIsCapstoneDialogOpen] = useState(false);
  const [currentSkillId, setCurrentSkillId] = useState<string>('');
  
  const [newSkill, setNewSkill] = useState<{
    name: string;
    description: string;
    scope: 'global' | 'tenant';
    tenants: string[];
    icon: IconType;
    careerChoices: string[];
  }>({
    name: '',
    description: '',
    scope: 'global',
    tenants: [],
    icon: { type: 'emoji', value: '📚' },
    careerChoices: [],
  });

  // Load skills from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('platform.skills');
    if (stored) {
      try {
        setSkills(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse skills', e);
      }
    }
  }, []);

  // Save skills to localStorage
  const saveSkills = (updatedSkills: Skill[]) => {
    setSkills(updatedSkills);
    localStorage.setItem('platform.skills', JSON.stringify(updatedSkills));
  };

  const handleCreateSkill = () => {
    if (!newSkill.name.trim()) {
      toast({ title: 'Error', description: 'Skill name is required', variant: 'destructive' });
      return;
    }

    const skill: Skill = {
      id: `skill-${Date.now()}`,
      ...newSkill,
      status: 'draft',
      stages: [],
      createdAt: new Date().toISOString(),
    };

    saveSkills([...skills, skill]);
    setIsCreateOpen(false);
    setNewSkill({
      name: '',
      description: '',
      scope: 'global',
      tenants: [],
      icon: { type: 'emoji', value: '📚' },
      careerChoices: [],
    });
    toast({ title: 'Success', description: 'Skill created successfully' });
  };

  const togglePublish = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    if (!skill) return;

    if (skill.status === 'draft' && skill.stages.length === 0) {
      toast({ title: 'Error', description: 'Add at least one stage to publish', variant: 'destructive' });
      return;
    }

    const updated = skills.map(s =>
      s.id === skillId ? { ...s, status: s.status === 'draft' ? 'public' as const : 'draft' as const } : s
    );
    saveSkills(updated);
  };

  const openStageBuilder = (skillId: string) => {
    setCurrentSkillId(skillId);
    setIsStageBuilderOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">Skills Management</h1>
          <div className="text-sm text-muted-foreground mt-1">
            Create and manage skills with AI-powered content
          </div>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} size="lg">
          <Plus className="w-4 h-4 mr-2" /> Create Skill
        </Button>
      </div>

      {/* Skills Grid */}
      {skills.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">
            No skills yet. Click "Create Skill" to get started.
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <Card key={skill.id} className="glass-card hover:shadow-elevated transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">
                      {skill.icon.type === 'emoji' ? skill.icon.value : (
                        <img src={skill.icon.value} alt="" className="w-10 h-10 rounded" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                      <Badge variant={skill.scope === 'global' ? 'default' : 'secondary'} className="mt-1">
                        {skill.scope === 'global' ? <Globe className="w-3 h-3 mr-1" /> : <Building2 className="w-3 h-3 mr-1" />}
                        {skill.scope}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {skill.description || 'No description'}
                </p>
                
                <div className="flex items-center gap-2">
                  <Badge variant={skill.status === 'public' ? 'default' : 'outline'}>
                    {skill.status === 'public' ? 'Public' : 'Draft'}
                  </Badge>
                  <Badge variant="secondary">{skill.stages.length} stage(s)</Badge>
                  <div className="text-xs text-muted-foreground">
                    {new Date(skill.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {skill.careerChoices.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {skill.careerChoices.slice(0, 2).map((career) => (
                      <Badge key={career} variant="outline" className="text-xs">
                        {career}
                      </Badge>
                    ))}
                    {skill.careerChoices.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{skill.careerChoices.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={skill.status === 'public'}
                      onCheckedChange={() => togglePublish(skill.id)}
                    />
                    <Label className="text-xs">Publish</Label>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => openStageBuilder(skill.id)}>
                    Manage Stages
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Skill Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Skill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name *</Label>
              <Input
                id="name"
                placeholder="e.g., React Development"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this skill covers..."
                value={newSkill.description}
                onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="flex items-center gap-3">
                <div className="text-5xl">
                  {newSkill.icon.type === 'emoji' ? newSkill.icon.value : (
                    <img src={newSkill.icon.value} alt="" className="w-12 h-12 rounded" />
                  )}
                </div>
                <Button variant="outline" onClick={() => setIsIconPickerOpen(true)}>
                  Change Icon
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Scope</Label>
              <Select
                value={newSkill.scope}
                onValueChange={(v: 'global' | 'tenant') => setNewSkill({ ...newSkill, scope: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global - Available to all tenants</SelectItem>
                  <SelectItem value="tenant">Tenant - Specific tenants only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newSkill.scope === 'tenant' && (
              <div className="space-y-2">
                <Label>Assign to Tenants</Label>
                <MultiTenantCombobox
                  selected={newSkill.tenants}
                  onChange={(tenants) => setNewSkill({ ...newSkill, tenants })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Career Choices</Label>
              <MultiCareerSelect
                selected={newSkill.careerChoices}
                onChange={(choices) => setNewSkill({ ...newSkill, careerChoices: choices })}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSkill}>Create Skill</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Icon Picker */}
      <IconPicker
        open={isIconPickerOpen}
        onOpenChange={setIsIconPickerOpen}
        onSelect={(icon) => setNewSkill({ ...newSkill, icon: icon as IconType })}
      />

      {/* Stage Builder Dialog */}
      <StageBuilderDialog
        open={isStageBuilderOpen}
        onOpenChange={setIsStageBuilderOpen}
        skillId={currentSkillId}
        skills={skills}
        onUpdate={saveSkills}
        onOpenCapstoneDialog={() => setIsCapstoneDialogOpen(true)}
      />

      {/* Capstone Editor Dialog */}
      {currentSkillId && (
        <CapstoneEditorDialog
          open={isCapstoneDialogOpen}
          onOpenChange={setIsCapstoneDialogOpen}
          skillId={currentSkillId}
        />
      )}
    </div>
  );
}

// Stage Builder Component
function StageBuilderDialog({
  open,
  onOpenChange,
  skillId,
  skills,
  onUpdate,
  onOpenCapstoneDialog,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skillId: string;
  skills: Skill[];
  onUpdate: (skills: Skill[]) => void;
  onOpenCapstoneDialog: () => void;
}) {
  const skill = skills.find(s => s.id === skillId);
  const [newStage, setNewStage] = useState({ name: '', description: '', externalLink: '' });

  if (!skill) return null;

  const addStage = () => {
    if (!newStage.name.trim()) {
      toast({ title: 'Error', description: 'Stage name is required', variant: 'destructive' });
      return;
    }

    const stage: Stage = {
      id: `stage-${Date.now()}`,
      name: newStage.name,
      description: newStage.description,
      externalLink: newStage.externalLink || undefined,
      aiTutor: { generated: false },
      caseStudy: { generated: false },
      quiz: { generated: false },
    };

    const updated = skills.map(s =>
      s.id === skillId ? { ...s, stages: [...s.stages, stage] } : s
    );
    onUpdate(updated);
    setNewStage({ name: '', description: '', externalLink: '' });
    toast({ title: 'Success', description: 'Stage added' });
  };

  const generateContent = (stageId: string, type: 'aiTutor' | 'caseStudy' | 'quiz') => {
    const mockContent = {
      aiTutor: 'AI Tutor content generated based on stage description...',
      caseStudy: 'Real-world case study example...',
      quiz: 'Interactive quiz questions...',
    };

    const updated = skills.map(s =>
      s.id === skillId
        ? {
            ...s,
            stages: s.stages.map(st =>
              st.id === stageId
                ? { ...st, [type]: { generated: true, content: mockContent[type] } }
                : st
            ),
          }
        : s
    );
    onUpdate(updated);
    toast({ title: 'Success', description: `${type} content generated` });
  };

  // Get linked capstones from localStorage
  const capstones = JSON.parse(localStorage.getItem('capstone.configs') || '[]').filter(
    (c: any) => c.skillId === skillId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Stage Builder - {skill.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add New Stage */}
          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle className="text-base">Add New Stage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Stage name (e.g., Introduction to React)"
                value={newStage.name}
                onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
              />
              <Textarea
                placeholder="Detailed description (used by AI for content generation)"
                value={newStage.description}
                onChange={(e) => setNewStage({ ...newStage, description: e.target.value })}
                rows={2}
              />
              <Input
                placeholder="External link (YouTube, Google Drive, etc.)"
                value={newStage.externalLink}
                onChange={(e) => setNewStage({ ...newStage, externalLink: e.target.value })}
              />
              <Button onClick={addStage} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Stage
              </Button>
            </CardContent>
          </Card>

          {/* Existing Stages */}
          {skill.stages.map((stage, idx) => (
            <Card key={stage.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-lg">{idx + 1}</Badge>
                    <div>
                      <CardTitle className="text-lg">{stage.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{stage.description}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {stage.externalLink && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Badge variant="secondary">{detectLinkType(stage.externalLink)}</Badge>
                    <a
                      href={stage.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      Open Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* AI Content Generation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">AI Tutor</span>
                      {stage.aiTutor?.generated ? (
                        <Badge variant="default" className="gap-1">
                          <Check className="w-3 h-3" /> Generated
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateContent(stage.id, 'aiTutor')}
                        >
                          <Sparkles className="w-3 h-3 mr-1" /> Generate
                        </Button>
                      )}
                    </div>
                    {stage.aiTutor?.generated && (
                      <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 p-2 rounded">
                        {stage.aiTutor.content}
                      </div>
                    )}
                  </div>

                  <div className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Case Study</span>
                      {stage.caseStudy?.generated ? (
                        <Badge variant="default" className="gap-1">
                          <Check className="w-3 h-3" /> Generated
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateContent(stage.id, 'caseStudy')}
                        >
                          <Sparkles className="w-3 h-3 mr-1" /> Generate
                        </Button>
                      )}
                    </div>
                    {stage.caseStudy?.generated && (
                      <div className="text-xs text-muted-foreground bg-green-50 dark:bg-green-950 p-2 rounded">
                        {stage.caseStudy.content}
                      </div>
                    )}
                  </div>

                  <div className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Quiz</span>
                      {stage.quiz?.generated ? (
                        <Badge variant="default" className="gap-1">
                          <Check className="w-3 h-3" /> Generated
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateContent(stage.id, 'quiz')}
                        >
                          <Sparkles className="w-3 h-3 mr-1" /> Generate
                        </Button>
                      )}
                    </div>
                    {stage.quiz?.generated && (
                      <div className="text-xs text-muted-foreground bg-purple-50 dark:bg-purple-950 p-2 rounded">
                        {stage.quiz.content}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Linked Capstones */}
          <div className="space-y-3 pt-6 border-t">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Capstones for this Skill</h3>
              <Button onClick={onOpenCapstoneDialog} variant="outline">
                <Plus className="w-4 h-4 mr-2" /> New Capstone
              </Button>
            </div>
            {capstones.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                No capstones linked yet
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {capstones.map((capstone: any) => (
                  <Card key={capstone.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{capstone.title}</CardTitle>
                        <Badge variant={capstone.status === 'Published' ? 'default' : 'secondary'}>
                          {capstone.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge>{capstone.difficulty}</Badge>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {capstone.overview.description}
                        </p>
                        {capstone.expectedDeliverables && (
                          <div className="flex flex-wrap gap-1">
                            {capstone.expectedDeliverables.slice(0, 3).map((d: string) => (
                              <Badge key={d} variant="outline" className="text-xs">
                                {d}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
