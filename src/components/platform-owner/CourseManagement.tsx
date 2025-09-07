import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SkillManagement } from './SkillManagement';
import { CapstoneManagement } from './CapstoneManagement';

export function CourseManagement() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gradient-luxury">Course & Capstone Management</h1>
      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="capstones">Capstones</TabsTrigger>
        </TabsList>
        <TabsContent value="skills">
          <SkillManagement />
        </TabsContent>
        <TabsContent value="capstones">
          <CapstoneManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
