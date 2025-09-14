import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useCareers } from '@/hooks/useCareers';
import type { CareerCategory, CareerGoal, DifficultyLevel } from '@/types/careers';
import { getAllSkills } from '@/lib/skillsStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

function MultiSelectChips({ options, value, onChange, placeholder = 'Select…' }: { options: { id: string; name: string }[]; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const filtered = options.filter(o => o.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="border rounded-md p-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map(v => {
          const opt = options.find(o => o.id === v);
          return (
            <span key={v} className="inline-flex items-center gap-1 text-xs border rounded px-2 py-0.5">
              {opt?.name || v}
              <button className="text-muted-foreground hover:text-foreground" onClick={() => onChange(value.filter(x => x !== v))}>×</button>
            </span>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <Input placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setOpen(true)} />
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(o => !o)}>{open ? 'Hide' : 'Browse'}</Button>
      </div>
      {open && (
        <div className="mt-2 max-h-40 overflow-auto border rounded p-2 bg-background">
          {filtered.map(o => (
            <button key={o.id} type="button" className="block w-full text-left text-sm px-2 py-1 hover:bg-muted rounded" onClick={() => onChange(Array.from(new Set([...value, o.id])))}>
              {o.name}
            </button>
          ))}
          {filtered.length === 0 && <div className="text-xs text-muted-foreground px-2">No options</div>}
        </div>
      )}
    </div>
  );
}

export function CareerManagement() {
  const { user } = useAuth();
  if (!user || user.role !== 'platform_owner') {
    return (
      <DashboardLayout>
        <div className="p-6 text-sm text-muted-foreground">Not authorized.</div>
      </DashboardLayout>
    );
  }
  const careers = useCareers();
  const skills = getAllSkills();

  // Category form state
  const [cat, setCat] = useState<{ name: string; description: string; icon: string; isGlobal: boolean; tenantId?: string }>({ name: '', description: '', icon: '🎯', isGlobal: true });
  const [catError, setCatError] = useState<string | null>(null);

  // Goal form state
  const [goal, setGoal] = useState<{ categoryId: string; name: string; icon: string; shortDescription: string; longDescription: string; durationMinMonths: number; durationMaxMonths: number; difficulty: DifficultyLevel; isGlobal: boolean; tenantId?: string; linkedSkillIds: string[] }>({ categoryId: '', name: '', icon: '🎓', shortDescription: '', longDescription: '', durationMinMonths: 3, durationMaxMonths: 6, difficulty: 'Beginner', isGlobal: true, linkedSkillIds: [] });
  const [goalError, setGoalError] = useState<string | null>(null);

  const onCreateCategory = () => {
    try {
      setCatError(null);
      careers.createCategory({ name: cat.name, description: cat.description, icon: cat.icon, isGlobal: cat.isGlobal, tenantId: cat.isGlobal ? undefined : cat.tenantId });
      setCat({ name: '', description: '', icon: '🎯', isGlobal: true });
    } catch (e: any) {
      setCatError(e?.message || 'Failed to create category');
    }
  };

  const onCreateGoal = () => {
    try {
      setGoalError(null);
      careers.createGoal({
        categoryId: goal.categoryId,
        name: goal.name,
        icon: goal.icon,
        shortDescription: goal.shortDescription,
        longDescription: goal.longDescription,
        durationMinMonths: Number(goal.durationMinMonths),
        durationMaxMonths: Number(goal.durationMaxMonths),
        difficulty: goal.difficulty,
        isGlobal: goal.isGlobal,
        tenantId: goal.isGlobal ? undefined : goal.tenantId,
        linkedSkillIds: goal.linkedSkillIds,
        isActive: true,
      });
      setGoal({ categoryId: '', name: '', icon: '🎓', shortDescription: '', longDescription: '', durationMinMonths: 3, durationMaxMonths: 6, difficulty: 'Beginner', isGlobal: true, linkedSkillIds: [] });
    } catch (e: any) {
      setGoalError(e?.message || 'Failed to create goal');
    }
  };

  const categories = careers.state.categories;
  const goals = careers.state.goals;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">Career Management</h1>
          <p className="text-muted-foreground mt-2">Create categories and career goals; link to skills; scope by tenant</p>
        </div>

        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Add Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {catError && <div className="text-sm text-red-600">{catError}</div>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input placeholder="Name" value={cat.name} onChange={e => setCat(prev => ({ ...prev, name: e.target.value }))} />
                  <Input placeholder="Icon (emoji)" value={cat.icon} onChange={e => setCat(prev => ({ ...prev, icon: e.target.value }))} />
                  <Textarea placeholder="Description" className="md:col-span-1" value={cat.description} onChange={e => setCat(prev => ({ ...prev, description: e.target.value }))} />
                  <div className="flex items-center gap-2">
                    <Switch checked={cat.isGlobal} onCheckedChange={(v) => setCat(prev => ({ ...prev, isGlobal: v }))} />
                    <span className="text-sm">Global</span>
                  </div>
                  {!cat.isGlobal && (
                    <Input placeholder="Tenant ID" value={cat.tenantId || ''} onChange={e => setCat(prev => ({ ...prev, tenantId: e.target.value }))} />
                  )}
                </div>
                <Button onClick={onCreateCategory}>Create Category</Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {categories.map((c) => (
                    <div key={c.id} className="border rounded p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg" aria-hidden>{c.icon || '📁'}</span>
                          <div className="font-medium">{c.name}</div>
                        </div>
                        <Badge variant="outline">{c.isGlobal ? 'Global' : `Tenant: ${c.tenantId}`}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{c.description || '—'}</div>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => careers.deleteCategory(c.id)}>Delete</Button>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && <div className="text-sm text-muted-foreground">No categories yet.</div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Add Career Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {goalError && <div className="text-sm text-red-600">{goalError}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Select value={goal.categoryId} onValueChange={(v) => setGoal(prev => ({ ...prev, categoryId: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input placeholder="Name" value={goal.name} onChange={e => setGoal(prev => ({ ...prev, name: e.target.value }))} />
                  <Input placeholder="Icon (emoji)" value={goal.icon} onChange={e => setGoal(prev => ({ ...prev, icon: e.target.value }))} />
                  <Select value={goal.difficulty} onValueChange={(v) => setGoal(prev => ({ ...prev, difficulty: v as DifficultyLevel }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="Min Duration (months)" value={goal.durationMinMonths} onChange={e => setGoal(prev => ({ ...prev, durationMinMonths: Number(e.target.value) }))} />
                  <Input type="number" placeholder="Max Duration (months)" value={goal.durationMaxMonths} onChange={e => setGoal(prev => ({ ...prev, durationMaxMonths: Number(e.target.value) }))} />
                  <Textarea placeholder="Short Description" value={goal.shortDescription} onChange={e => setGoal(prev => ({ ...prev, shortDescription: e.target.value }))} />
                  <Textarea placeholder="Long Description" value={goal.longDescription} onChange={e => setGoal(prev => ({ ...prev, longDescription: e.target.value }))} />
                  <div className="flex items-center gap-2">
                    <Switch checked={goal.isGlobal} onCheckedChange={(v) => setGoal(prev => ({ ...prev, isGlobal: v }))} />
                    <span className="text-sm">Global</span>
                  </div>
                  {!goal.isGlobal && (
                    <Input placeholder="Tenant ID" value={goal.tenantId || ''} onChange={e => setGoal(prev => ({ ...prev, tenantId: e.target.value }))} />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Linked Skills</div>
                  <MultiSelectChips
                    options={skills.map(s => ({ id: s.id, name: s.name }))}
                    value={goal.linkedSkillIds}
                    onChange={(v) => setGoal(prev => ({ ...prev, linkedSkillIds: v }))}
                    placeholder="Search skills…"
                  />
                </div>
                <Button onClick={onCreateGoal}>Create Goal</Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {goals.map((g) => (
                    <div key={g.id} className="border rounded p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg" aria-hidden>{g.icon || '🎓'}</span>
                          <div>
                            <div className="font-medium">{g.name}</div>
                            <div className="text-xs text-muted-foreground">{categories.find(c => c.id === g.categoryId)?.name || '—'}</div>
                          </div>
                        </div>
                        <Badge variant="outline">{g.isGlobal ? 'Global' : `Tenant: ${g.tenantId}`}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 line-clamp-3">{g.shortDescription || '—'}</div>
                      <div className="text-xs mt-2 flex items-center gap-3">
                        <Badge variant="secondary">{g.difficulty}</Badge>
                        <span>{g.durationMinMonths}-{g.durationMaxMonths} mo</span>
                      </div>
                      <div className="mt-2 text-xs">Skills: {g.linkedSkillIds.length}</div>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => careers.updateGoal(g.id, { isActive: !g.isActive })}>{g.isActive ? 'Disable' : 'Enable'}</Button>
                        <Button size="sm" variant="outline" onClick={() => careers.deleteGoal(g.id)}>Delete</Button>
                      </div>
                    </div>
                  ))}
                  {goals.length === 0 && <div className="text-sm text-muted-foreground">No goals yet.</div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

export default CareerManagement;
