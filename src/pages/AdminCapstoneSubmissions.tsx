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
  const { listAdminSubmissions, state, getInstance, getInstanceProgressPercent } = useCapstones();

  const tenantOptions = useMemo(() => Array.from(new Set(state.instances.map(i => i.tenantId).filter(Boolean))) as string[], [state.instances]);
  const skillOptions = useMemo(() => Array.from(new Set(state.instances.map(i => i.skillId))), [state.instances]);

  const [tenantOpen, setTenantOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [tenantQuery, setTenantQuery] = useState('');
  const [skillQuery, setSkillQuery] = useState('');

  const [selectedTenants, setSelectedTenants] = useState<string[]>(user?.role === 'tenant_admin' && user.tenantId ? [user.tenantId] : []);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');

  const rows = useMemo(() => listAdminSubmissions({ tenantIds: selectedTenants.length ? selectedTenants : undefined, status: (status as any) || undefined, skillIds: selectedSkills.length ? selectedSkills : undefined }), [selectedTenants, selectedSkills, status, state.instanceSubmissions, state.instances]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Capstone Submissions</h1>
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Tenants multi-select */}
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
