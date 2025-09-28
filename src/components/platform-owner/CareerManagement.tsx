import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCareersSupabase } from '@/hooks/useCareersSupabase';
import { Loader2, Edit, Plus } from 'lucide-react';

function AddCareerGoalDialog({ onSave }: { onSave: (goalData: any) => void }) {
  const [open, setOpen] = useState(false);
  const { categories, createGoal, isCreatingGoal } = useCareersSupabase();
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    durationMinMonths: 1,
    durationMaxMonths: 12,
    categoryId: '',
  });

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.shortDescription.trim() || !formData.categoryId) {
      return;
    }

    try {
      await createGoal({
        ...formData,
        isGlobal: true, // Platform owners create global goals
      });
      onSave(formData);
      setFormData({ 
        name: '', 
        shortDescription: '', 
        longDescription: '',
        difficulty: 'Beginner',
        durationMinMonths: 1,
        durationMaxMonths: 12,
        categoryId: '',
      });
      setOpen(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Career Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Career Goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Career goal name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Short Description</label>
            <Textarea
              value={formData.shortDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
              placeholder="Brief description"
              rows={2}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Long Description</label>
            <Textarea
              value={formData.longDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
              placeholder="Detailed description"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Difficulty</label>
              <Select value={formData.difficulty} onValueChange={(value: 'Beginner' | 'Intermediate' | 'Advanced') => setFormData(prev => ({ ...prev, difficulty: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Duration (months)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  value={formData.durationMinMonths}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationMinMonths: parseInt(e.target.value) || 1 }))}
                  placeholder="Min"
                />
                <Input
                  type="number"
                  min="1"
                  value={formData.durationMaxMonths}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationMaxMonths: parseInt(e.target.value) || 12 }))}
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!formData.name.trim() || !formData.shortDescription.trim() || isCreatingGoal}
            >
              {isCreatingGoal && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Career Goal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CareerManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { goals, categories, isLoading, error } = useCareersSupabase();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-48" />
          </div>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-96" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-center text-destructive">
                <p className="font-medium">Failed to load career goals</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please try refreshing the page or contact support if the problem persists.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const handleAddGoal = () => {
    // Goal creation is handled by the dialog component
    toast({
      title: "Success",
      description: "Career goal created successfully",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Career Goals Management</h1>
            <p className="text-muted-foreground">Manage career goals and learning paths</p>
          </div>
          <AddCareerGoalDialog onSave={handleAddGoal} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Career Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">No career goals found</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add your first career goal to get started
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  goals.map((goal) => {
                    const category = categories.find(c => c.id === goal.categoryId);
                    return (
                      <TableRow key={goal.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{goal.name}</div>
                            {goal.shortDescription && (
                              <div className="text-sm text-muted-foreground">
                                {goal.shortDescription}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {category?.name || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              goal.difficulty === 'Beginner' ? 'secondary' : 
                              goal.difficulty === 'Intermediate' ? 'default' : 
                              'destructive'
                            }
                          >
                            {goal.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {goal.durationMinMonths === goal.durationMaxMonths
                            ? `${goal.durationMinMonths} months`
                            : `${goal.durationMinMonths}-${goal.durationMaxMonths} months`
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant={goal.isGlobal ? 'default' : 'secondary'}>
                            {goal.isGlobal ? 'Global' : 'Tenant'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={goal.isActive ? 'default' : 'secondary'}>
                            {goal.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default CareerManagement;