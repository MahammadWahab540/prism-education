import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCapstones } from '@/hooks/useCapstones';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check } from 'lucide-react';

const AdminCapstoneSubmissions = () => {
  const { user } = useAuth();
  const { listAdminSubmissions, state, getInstance, getInstanceProgressPercent, updateInstanceSubmissionStatus, assignReviewer, removeReviewer, setSubmissionEscalation } = useCapstones();

  const tenantOptions = useMemo(() => Array.from(new Set(state.instances.map(i => i.tenantId).filter(Boolean))) as string[], [state.instances]);
  const isTenantAdmin = user?.role === 'tenant_admin';
  const skillOptions = useMemo(() => {
    const scoped = isTenantAdmin && user?.tenantId
      ? state.instances.filter(i => i.tenantId === user.tenantId)
      : state.instances;
    return Array.from(new Set(scoped.map(i => i.skillId)));
  }, [state.instances, isTenantAdmin, user?.tenantId]);

  const [tenantOpen, setTenantOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [tenantQuery, setTenantQuery] = useState('');
  const [skillQuery, setSkillQuery] = useState('');

  const [selectedTenants, setSelectedTenants] = useState<string[]>(user?.role === 'tenant_admin' && user.tenantId ? [user.tenantId] : []);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');

  // Enforce tenant scoping for tenant_admins regardless of filter UI
  const enforcedTenantFilter = user?.role === 'tenant_admin' && user.tenantId ? { tenantId: user.tenantId } : { tenantIds: selectedTenants.length ? selectedTenants : undefined };
  const rows = useMemo(
    () => listAdminSubmissions({
      ...(enforcedTenantFilter as any),
      status: (status as any) || undefined,
      skillIds: selectedSkills.length ? selectedSkills : undefined,
    }),
    [selectedTenants, selectedSkills, status, state.instanceSubmissions, state.instances, user?.role, user?.tenantId]
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Capstone Submissions</h1>
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Tenant filter hidden for tenant admins; always scoped to their tenant */}
            {!isTenantAdmin && (
              <Popover open={tenantOpen} onOpenChange={setTenantOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={tenantOpen} className="justify-between">
                    {selectedTenants.length === 0 ? 'Select Tenants' : `${selectedTenants.length} selected`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[300px]">
                  <Command shouldFilter={false}>
                    <div className="p-2 border-b flex items-center gap-2">
                      <CommandInput placeholder="Search tenants" value={tenantQuery} onValueChange={setTenantQuery} />
                      <Button variant="ghost" size="sm" onClick={() => setSelectedTenants(tenantOptions)}>Select all</Button>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedTenants([])}>Clear</Button>
                    </div>
                    <CommandList>
                      <CommandEmpty>No results.</CommandEmpty>
                      <CommandGroup>
                        {tenantOptions
                          .filter(t => t!.toLowerCase().includes(tenantQuery.toLowerCase()))
                          .map((t) => {
                            const checked = selectedTenants.includes(t);
                            return (
                              <CommandItem key={t} onSelect={() => setSelectedTenants(prev => checked ? prev.filter(x => x !== t) : [...prev, t])} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Checkbox checked={checked} />
                                  <span className="font-mono text-xs">{t}</span>
                                </div>
                                {checked && <Check className="h-4 w-4" />}
                              </CommandItem>
                            );
                          })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}

            {/* Status single-select */}
            <select className="border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option>New</option>
              <option>Pending Review</option>
              <option>Changes Requested</option>
              <option>Approved</option>
            </select>

            {/* Skills multi-select */}
            <Popover open={skillOpen} onOpenChange={setSkillOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={skillOpen} className="justify-between">
                  {selectedSkills.length === 0 ? 'Select Skills' : `${selectedSkills.length} selected`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[300px]">
                <Command shouldFilter={false}>
                  <div className="p-2 border-b flex items-center gap-2">
                    <CommandInput placeholder="Search skills" value={skillQuery} onValueChange={setSkillQuery} />
                    <Button variant="ghost" size="sm" onClick={() => setSelectedSkills(skillOptions)}>Select all</Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedSkills([])}>Clear</Button>
                  </div>
                  <CommandList>
                    <CommandEmpty>No results.</CommandEmpty>
                    <CommandGroup>
                      {skillOptions
                        .filter(s => s.toLowerCase().includes(skillQuery.toLowerCase()))
                        .map((s) => {
                          const checked = selectedSkills.includes(s);
                          return (
                            <CommandItem key={s} onSelect={() => setSelectedSkills(prev => checked ? prev.filter(x => x !== s) : [...prev, s])} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Checkbox checked={checked} />
                                <span className="font-mono text-xs">{s}</span>
                              </div>
                              {checked && <Check className="h-4 w-4" />}
                            </CommandItem>
                          );
                        })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
                    {!isTenantAdmin && <th>Tenant</th>}
                    <th>Skill</th>
                    <th>Capstone</th>
                    <th>Stage %</th>
                    <th>Link</th>
                    <th>Status</th>
                    <th>SubmittedAt</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ submission, instance }) => (
                    <tr key={submission.id} className="border-b align-top">
                      <td className="py-2">{instance.userId}</td>
                      {!isTenantAdmin && <td>{submission.tenantId || '-'}</td>}
                      <td>{instance.skillId}</td>
                      <td>{instance.templateId}</td>
                      <td>{getInstanceProgressPercent(instance.id)}%</td>
                      <td><a href={submission.link} className="underline" target="_blank">Open</a></td>
                      <td>
                        <Badge variant={submission.status === 'Approved' ? 'default' : submission.status === 'Changes Requested' ? 'destructive' : 'secondary'}>
                          {submission.status}
                        </Badge>
                        {submission.escalation?.escalated && (
                          <div className="mt-1">
                            <Badge variant="destructive">Escalated</Badge>
                          </div>
                        )}
                      </td>
                      <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                      <td className="space-y-2 min-w-[260px]">
                        {/* Status actions */}
                        <div className="flex items-center gap-2">
                          <select
                            className="border rounded px-2 py-1 text-xs"
                            value={submission.status}
                            onChange={(e) => updateInstanceSubmissionStatus(instance.id, submission.id, e.target.value as any)}
                          >
                            <option>Pending Review</option>
                            <option>Changes Requested</option>
                            <option>Approved</option>
                          </select>
                          <a className="text-xs underline" href={`/admin/capstones/${instance.id}`}>Progress</a>
                        </div>

                        {/* Reviewer assignment */}
                        <div className="flex items-center gap-2">
                          <input
                            className="border rounded px-2 py-1 text-xs flex-1"
                            placeholder="Add reviewer"
                            onKeyDown={(e) => {
                              const target = e.target as HTMLInputElement;
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                assignReviewer(instance.id, submission.id, target.value);
                                target.value = '';
                              }
                            }}
                          />
                          <Button size="sm" variant="outline" className="text-xs px-2 py-1" onClick={(e) => {
                            const input = (e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement);
                            if (input && input.value.trim()) {
                              assignReviewer(instance.id, submission.id, input.value.trim());
                              input.value = '';
                            }
                          }}>Add</Button>
                        </div>
                        {(submission.reviewers || []).length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {(submission.reviewers || []).map(r => (
                              <span key={r} className="inline-flex items-center gap-1 text-xs border rounded px-2 py-0.5">
                                {r}
                                <button
                                  className="text-muted-foreground hover:text-foreground"
                                  onClick={() => removeReviewer(instance.id, submission.id, r)}
                                  aria-label={`Remove ${r}`}
                                >×</button>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Escalation */}
                        <div className="flex items-center gap-2">
                          {submission.escalation?.escalated ? (
                            <Button size="sm" variant="outline" className="text-xs" onClick={() => setSubmissionEscalation(instance.id, submission.id, false)}>Clear Escalation</Button>
                          ) : (
                            <Button size="sm" variant="outline" className="text-xs" onClick={() => {
                              const reason = window.prompt('Reason to escalate?') || undefined;
                              setSubmissionEscalation(instance.id, submission.id, true, reason);
                            }}>Escalate</Button>
                          )}
                        </div>
                      </td>
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
