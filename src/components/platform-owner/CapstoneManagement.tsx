import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCapstoneSupabase } from '@/hooks/useCapstoneSupabase';
import type { CapstoneConfig, CapstoneRubricItem, CapstoneCheckpoint } from '@/types/capstone';
import { Plus, Trash2, Wand2, Eye } from 'lucide-react';

const emptyRubricItem = (): CapstoneRubricItem => ({ id: `r-${Date.now()}`, criterion: '', weight: 0 });
const emptyCheckpoint = (): CapstoneCheckpoint => ({ id: `cp-${Date.now()}`, title: '', description: '', requiredDeliverables: ['repo', 'report', 'demo'] });

export function CapstoneManagement() {
  const { templates, instances, isLoading } = useCapstoneSupabase();
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Capstone Manager</h1>
        <div className="text-sm text-muted-foreground">Loading capstones...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Capstone Templates</h1>
          <div className="text-sm text-muted-foreground">
            Manage capstone project templates
          </div>
        </div>
      </div>

      {templates.length === 0 ? (
        <Card className="p-6">
          <div className="text-sm text-muted-foreground">
            No capstone templates yet. Templates can be created in the Supabase database.
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-elevated transition-all">
              <CardHeader>
                <CardTitle className="text-base">{template.title}</CardTitle>
                <Badge variant="secondary">{template.difficulty}</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {template.overview.problem}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Active Instances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {instances.length} active capstone instance(s) across all students
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

