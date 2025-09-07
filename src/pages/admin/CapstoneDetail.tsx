import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCapstones } from '@/hooks/useCapstones';
import type { InstanceSubmission } from '@/types/capstone';

const AdminCapstoneDetail = () => {
  const { instanceId } = useParams();
  const navigate = useNavigate();
  const { state, getInstance, updateInstanceSubmissionStatus } = useCapstones();
  const instance = getInstance(instanceId!);
  const latest = useMemo(() => (state.instanceSubmissions[instanceId!] || []).slice(-1)[0], [state.instanceSubmissions, instanceId]);
  const [status, setStatus] = useState<InstanceSubmission['status']>(latest?.status || 'Pending Review');

  if (!instance) {
    return (
      <DashboardLayout>
        <div className="p-6 text-sm text-muted-foreground">Instance not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Submission Detail</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Submission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div><span className="font-medium">Student:</span> {instance.userId}</div>
            <div><span className="font-medium">Tenant:</span> {latest?.tenantId || '-'}</div>
            <div><span className="font-medium">Skill:</span> {instance.skillId}</div>
            <div><span className="font-medium">Capstone:</span> {instance.templateId}</div>
            <div><span className="font-medium">Link:</span> {latest?.link ? <a href={latest.link} className="underline" target="_blank">Open</a> : '-'}</div>
            <div><span className="font-medium">Notes:</span> {latest?.notes || '-'}</div>
            <div className="flex items-center gap-3">
              <select className="border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value as InstanceSubmission['status'])}>
                <option>Pending Review</option>
                <option>Changes Requested</option>
                <option>Approved</option>
              </select>
              <Button onClick={() => { if (latest) updateInstanceSubmissionStatus(instance.id, latest.id, status as any); }}>Update Status</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminCapstoneDetail;
