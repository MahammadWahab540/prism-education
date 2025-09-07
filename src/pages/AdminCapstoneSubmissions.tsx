import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCapstones } from '@/hooks/useCapstones';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AdminCapstoneSubmissions = () => {
  const { user } = useAuth();
  const { listAdminSubmissions, state, getInstance, getInstanceProgressPercent } = useCapstones();
  const [filters, setFilters] = useState({ tenantId: user?.role === 'tenant_admin' ? (user.tenantId || '') : '', status: '', skillId: '' });
  const rows = useMemo(() => listAdminSubmissions({ tenantId: filters.tenantId || undefined, status: (filters.status as any) || undefined, skillId: filters.skillId || undefined }), [filters, state.instanceSubmissions, state.instances]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Capstone Submissions</h1>
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input className="border rounded px-3 py-2" placeholder="Tenant ID" value={filters.tenantId} onChange={(e) => setFilters(prev => ({ ...prev, tenantId: e.target.value }))} />
            <select className="border rounded px-3 py-2" value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}>
              <option value="">All Statuses</option>
              <option>New</option>
              <option>Pending Review</option>
              <option>Changes Requested</option>
              <option>Approved</option>
            </select>
            <input className="border rounded px-3 py-2" placeholder="Skill ID" value={filters.skillId} onChange={(e) => setFilters(prev => ({ ...prev, skillId: e.target.value }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Student</th>
                    <th>Tenant</th>
                    <th>Skill</th>
                    <th>Capstone</th>
                    <th>Stage %</th>
                    <th>Link</th>
                    <th>Status</th>
                    <th>SubmittedAt</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ submission, instance }) => (
                    <tr key={submission.id} className="border-b">
                      <td className="py-2">{instance.userId}</td>
                      <td>{submission.tenantId || '-'}</td>
                      <td>{instance.skillId}</td>
                      <td>{instance.templateId}</td>
                      <td>{getInstanceProgressPercent(instance.id)}%</td>
                      <td><a href={submission.link} className="underline" target="_blank">Open</a></td>
                      <td>
                        <Badge variant={submission.status === 'Approved' ? 'default' : submission.status === 'Changes Requested' ? 'destructive' : 'secondary'}>
                          {submission.status}
                        </Badge>
                      </td>
                      <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminCapstoneSubmissions;
