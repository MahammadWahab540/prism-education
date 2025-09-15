import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getCareerGoals, updateCareerGoal, type CareerGoal } from '@/lib/api/careerGoals';
import { Loader2, Edit } from 'lucide-react';

function EditCareerGoalDialog({ goal, onSave }: { goal: CareerGoal; onSave: (id: string, updates: Partial<Omit<CareerGoal, 'id'>>) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: goal.title,
    description: goal.description,
    status: goal.status as "Active" | "Inactive"
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed = formData.title !== goal.title || 
                   formData.description !== goal.description || 
                   formData.status !== goal.status;
    setHasChanges(changed);
  }, [formData, goal]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(goal.id, formData);
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Career Goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Career goal title"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Career goal description"
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select value={formData.status} onValueChange={(value: "Active" | "Inactive") => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!hasChanges || isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
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
  const [careerGoals, setCareerGoals] = useState<CareerGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  if (!user || user.role !== 'platform_owner') {
    return (
      <DashboardLayout>
        <div className="p-6 text-sm text-muted-foreground">Not authorized.</div>
      </DashboardLayout>
    );
  }

  useEffect(() => {
    loadCareerGoals();
  }, []);

  const loadCareerGoals = async () => {
    try {
      setIsLoading(true);
      const goals = await getCareerGoals();
      setCareerGoals(goals);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load career goals",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGoal = async (id: string, updates: Partial<Omit<CareerGoal, 'id'>>) => {
    try {
      const updatedGoal = await updateCareerGoal(id, updates);
      
      // Optimistically update UI
      setCareerGoals(prev => prev.map(goal => 
        goal.id === id ? updatedGoal : goal
      ));
      
      toast({
        title: "Success",
        description: "Career goal updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to update career goal",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">Career Management</h1>
          <p className="text-muted-foreground mt-2">Manage and edit career goals available to students</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Current Career Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading career goals...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {careerGoals.map((goal) => (
                    <TableRow key={goal.id}>
                      <TableCell className="font-mono text-sm">{goal.id}</TableCell>
                      <TableCell className="font-medium">{goal.title}</TableCell>
                      <TableCell className="max-w-md">
                        <div className="line-clamp-2">{goal.description}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={goal.status === "Active" ? "default" : "secondary"}
                        >
                          {goal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <EditCareerGoalDialog goal={goal} onSave={handleUpdateGoal} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {careerGoals.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No career goals found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default CareerManagement;
