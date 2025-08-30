import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CourseManagement } from '@/components/platform-owner/CourseManagement';

export default function CourseManagementPage() {
  return (
    <DashboardLayout>
      <CourseManagement />
    </DashboardLayout>
  );
}