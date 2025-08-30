import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StudentManagement } from '@/components/students/StudentManagement';

export default function StudentsPage() {
  return (
    <DashboardLayout>
      <StudentManagement />
    </DashboardLayout>
  );
}