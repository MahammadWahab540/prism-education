import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Globe, 
  Building2, 
  Brain, 
  FileText, 
  HelpCircle,
  Edit,
  Sparkles,
  Play,
  ExternalLink
} from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  description: string;
  scope: 'Global' | 'Tenant';
  tenantId?: string;
  stages: Stage[];
  createdAt: Date;
}

interface Stage {
  id: string;
  name: string;
  link: string;
  aiTutorGenerated: boolean;
  caseStudyGenerated: boolean;
  quizGenerated: boolean;
}

export function SkillManagement() {
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: '1',
      name: 'Quantum Computing Fundamentals',
      description: 'Master the basics of quantum computing, including qubits, superposition, and entanglement.',
      scope: 'Global',
      stages: [
        {
          id: 'stage-1',
          name: 'Introduction to Quantum Physics',
          link: 'https://www.youtube.com/watch?v=example1',
          aiTutorGenerated: true,
          caseStudyGenerated: true,
          quizGenerated: true
        },
        {
          id: 'stage-2',
          name: 'Qubits and Quantum States',
          link: 'https://drive.google.com/file/d/example2',
          aiTutorGenerated: false,
          caseStudyGenerated: false,
          quizGenerated: false
        }
      ],
      createdAt: new Date('2024-01-15')
    }
  ]);

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isCreateSkillOpen, setIsCreateSkillOpen] = useState(false);
  const [isCreateStageOpen, setIsCreateStageOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    description: '',
    scope: 'Global' as 'Global' | 'Tenant',
    tenantId: ''
  });
  const [newStage, setNewStage] = useState({
    name: '',
    link: ''
  });

  const handleCreateSkill = () => {
    const skill: Skill = {
      id: Date.now().toString(),
      ...newSkill,
      stages: [],
      createdAt: new Date()
    };
    setSkills([...skills, skill]);
    setIsCreateSkillOpen(false);
    setNewSkill({
      name: '',
      description: '',
      scope: 'Global',
      tenantId: ''
    });
  };

  const handleCreateStage = () => {
    if (!selectedSkill) return;
    
    const stage: Stage = {
      id: `stage-${Date.now()}`,
      ...newStage,
      aiTutorGenerated: false,
      caseStudyGenerated: false,
      quizGenerated: false
    };

    const updatedSkills = skills.map(skill => 
      skill.id === selectedSkill.id 
        ? { ...skill, stages: [...skill.stages, stage] }
        : skill
    );
    
    setSkills(updatedSkills);
    setSelectedSkill({ ...selectedSkill, stages: [...selectedSkill.stages, stage] });
    setIsCreateStageOpen(false);
    setNewStage({
      name: '',
      link: ''
    });
  };

  const generateAIContent = (skillId: string, stageId: string, contentType: 'tutor' | 'caseStudy' | 'quiz') => {
    const updatedSkills = skills.map(skill => 
      skill.id === skillId 
        ? {
            ...skill,
            stages: skill.stages.map(stage => 
              stage.id === stageId 
                ? {
                    ...stage,
                    [`${contentType === 'tutor' ? 'aiTutor' : contentType}Generated`]: true
                  }
                : stage
            )
          }
        : skill
    );
    
    setSkills(updatedSkills);
    if (selectedSkill?.id === skillId) {
      setSelectedSkill(updatedSkills.find(s => s.id === skillId)!);
    }
  };

  const getLinkType = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('drive.google.com')) return 'Google Drive';
    return 'External Link';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">Skill Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage learning skills across tenants</p>
        </div>
        <Dialog open={isCreateSkillOpen} onOpenChange={setIsCreateSkillOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent-luxury shadow-medium">
              <Plus className="w-4 h-4 mr-2" />
              Create Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Skill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Skill Name"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              />
              <Textarea
                placeholder="Skill Description"
                value={newSkill.description}
                onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={newSkill.scope}
                  onValueChange={(value) => 
                    setNewSkill({ ...newSkill, scope: value as 'Global' | 'Tenant' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Global">Global - All Tenants</SelectItem>
                    <SelectItem value="Tenant">Tenant - Specific Tenant</SelectItem>
                  </SelectContent>
                </Select>
                {newSkill.scope === 'Tenant' && (
                  <Input
                    placeholder="Tenant ID"
                    value={newSkill.tenantId}
                    onChange={(e) => setNewSkill({ ...newSkill, tenantId: e.target.value })}
                  />
                )}
              </div>
              <Button onClick={handleCreateSkill} className="w-full">
                Create Skill
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList>
          <TabsTrigger value="skills">All Skills</TabsTrigger>
          <TabsTrigger value="stages">Stage Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <Card key={skill.id} className="glass-card hover:shadow-elevated transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg line-clamp-2">{skill.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        {skill.scope === 'Global' ? (
                          <Badge variant="default" className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            Global
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            Tenant
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{skill.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{skill.stages.length} stages</span>
                    <span>{skill.createdAt.toLocaleDateString()}</span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedSkill(skill)}
                    className="w-full"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Manage Stages
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stages" className="space-y-6">
          {selectedSkill ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedSkill.name}</h2>
                  <p className="text-muted-foreground">{selectedSkill.stages.length} stages</p>
                </div>
                <Dialog open={isCreateStageOpen} onOpenChange={setIsCreateStageOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Stage
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Stage</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Stage Name"
                        value={newStage.name}
                        onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
                      />
                      <Input
                        placeholder="Stage Link (YouTube/Google Drive/Other)"
                        value={newStage.link}
                        onChange={(e) => setNewStage({ ...newStage, link: e.target.value })}
                      />
                      <Button onClick={handleCreateStage} className="w-full">
                        Add Stage
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {selectedSkill.stages.map((stage, index) => (
                  <Card key={stage.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <h3 className="text-lg font-semibold">{stage.name}</h3>
                            </div>
                            <div className="flex items-center gap-2 ml-11 text-sm text-muted-foreground">
                              <ExternalLink className="w-4 h-4" />
                              <Badge variant="outline">{getLinkType(stage.link)}</Badge>
                              <a 
                                href={stage.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline truncate max-w-xs"
                              >
                                {stage.link}
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="ml-11 space-y-3">
                          <h4 className="font-medium text-sm text-muted-foreground">AI-Generated Content</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Brain className="w-4 h-4" />
                                <span className="text-sm">AI Tutor</span>
                              </div>
                              {stage.aiTutorGenerated ? (
                                <Badge variant="default">Generated</Badge>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => generateAIContent(selectedSkill.id, stage.id, 'tutor')}
                                >
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Generate
                                </Button>
                              )}
                            </div>

                            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">Case Study</span>
                              </div>
                              {stage.caseStudyGenerated ? (
                                <Badge variant="default">Generated</Badge>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => generateAIContent(selectedSkill.id, stage.id, 'caseStudy')}
                                >
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Generate
                                </Button>
                              )}
                            </div>

                            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <HelpCircle className="w-4 h-4" />
                                <span className="text-sm">Quiz</span>
                              </div>
                              {stage.quizGenerated ? (
                                <Badge variant="default">Generated</Badge>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => generateAIContent(selectedSkill.id, stage.id, 'quiz')}
                                >
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Generate
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {selectedSkill.stages.length === 0 && (
                  <Card className="glass-card p-12 text-center">
                    <Play className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No stages yet</h3>
                    <p className="text-muted-foreground mb-4">Start building your skill by adding the first stage.</p>
                    <Button onClick={() => setIsCreateStageOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Stage
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card className="glass-card p-12 text-center">
              <Play className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a skill to edit</h3>
              <p className="text-muted-foreground">Choose a skill from the "All Skills" tab to start building stages.</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}