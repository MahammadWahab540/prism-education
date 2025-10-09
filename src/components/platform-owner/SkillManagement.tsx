import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Globe, Building2 } from 'lucide-react';
import { useSupabaseSkills } from '@/hooks/useSupabaseSkills';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export function SkillManagement() {
  const { user } = useAuth();
  const { skills, loading, createSkill, isCreatingSkill, refresh } = useSupabaseSkills();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [newSkill, setNewSkill] = useState({
    name: '',
    description: '',
    category: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    estimatedHours: 0,
    isGlobal: user?.role === 'platform_owner',
  });

  const isPlatformOwner = user?.role === 'platform_owner';

  const handleCreateSkill = async () => {
    if (!newSkill.name.trim()) {
      toast({ title: 'Error', description: 'Skill name is required', variant: 'destructive' });
      return;
    }

    createSkill({
      ...newSkill,
      tenantId: newSkill.isGlobal ? undefined : user?.tenantId,
    }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setNewSkill({
          name: '',
          description: '',
          category: '',
          difficulty: 'Beginner',
          estimatedHours: 0,
          isGlobal: isPlatformOwner,
        });
        refresh();
      }
    });
  };

  const skillsByScope = useMemo(() => {
    const global = skills.filter(s => s.isGlobal);
    const tenant = skills.filter(s => !s.isGlobal);
    return { global, tenant };
  }, [skills]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Skills Management</h1>
        </div>
        <div className="text-sm text-muted-foreground">Loading skills...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Skills Management</h1>
          <div className="text-sm text-muted-foreground">
            Manage skills and learning paths
          </div>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Skill
        </Button>
      </div>

      {/* Global Skills */}
      {isPlatformOwner && skillsByScope.global.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Global Skills</h2>
            <Badge variant="secondary">{skillsByScope.global.length}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillsByScope.global.map((skill) => (
              <Card key={skill.id} className="hover:shadow-elevated transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{skill.name}</CardTitle>
                      <Badge variant="outline" className="mt-2">
                        <Globe className="w-3 h-3 mr-1" /> Global
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {skill.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="secondary">{skill.difficulty}</Badge>
                    {skill.estimatedHours && (
                      <span className="text-muted-foreground">
                        {skill.estimatedHours}h
                      </span>
                    )}
                  </div>
                  {skill.category && (
                    <div className="text-xs text-muted-foreground">
                      Category: {skill.category}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tenant Skills */}
      {skillsByScope.tenant.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            <h2 className="text-lg font-semibold">
              {isPlatformOwner ? 'Tenant-Specific Skills' : 'Your Skills'}
            </h2>
            <Badge variant="secondary">{skillsByScope.tenant.length}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillsByScope.tenant.map((skill) => (
              <Card key={skill.id} className="hover:shadow-elevated transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{skill.name}</CardTitle>
                      <Badge variant="outline" className="mt-2">
                        <Building2 className="w-3 h-3 mr-1" /> Tenant
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {skill.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="secondary">{skill.difficulty}</Badge>
                    {skill.estimatedHours && (
                      <span className="text-muted-foreground">
                        {skill.estimatedHours}h
                      </span>
                    )}
                  </div>
                  {skill.category && (
                    <div className="text-xs text-muted-foreground">
                      Category: {skill.category}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {skills.length === 0 && (
        <Card className="p-6">
          <div className="text-center text-sm text-muted-foreground">
            No skills yet. Click "Add Skill" to create your first skill.
          </div>
        </Card>
      )}

      {/* Create Skill Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Skill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name *</Label>
              <Input
                id="name"
                placeholder="e.g., JavaScript Fundamentals"
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Programming"
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={newSkill.difficulty}
                  onValueChange={(v: any) => setNewSkill({ ...newSkill, difficulty: v })}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Estimated Hours</Label>
              <Input
                id="hours"
                type="number"
                min={0}
                placeholder="e.g., 40"
                value={newSkill.estimatedHours || ''}
                onChange={(e) => setNewSkill({ ...newSkill, estimatedHours: parseInt(e.target.value) || 0 })}
              />
            </div>
            {isPlatformOwner && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="global"
                  checked={newSkill.isGlobal}
                  onCheckedChange={(checked) => setNewSkill({ ...newSkill, isGlobal: checked })}
                />
                <Label htmlFor="global" className="cursor-pointer">
                  Make this a global skill (available to all tenants)
                </Label>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSkill} disabled={isCreatingSkill}>
              {isCreatingSkill ? 'Creating...' : 'Create Skill'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
