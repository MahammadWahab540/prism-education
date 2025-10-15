import React, { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Tenant {
  id: string;
  name: string;
  category: string;
}

const MOCK_TENANTS: Tenant[] = [
  { id: '1', name: 'Harvard Business School', category: 'Business School' },
  { id: '2', name: 'Stanford GSB', category: 'Business School' },
  { id: '3', name: 'MIT Engineering', category: 'Engineering' },
  { id: '4', name: 'Carnegie Mellon CS', category: 'Engineering' },
  { id: '5', name: 'Berkeley Arts', category: 'Arts' },
  { id: '6', name: 'Test Tenant A', category: 'Test Tenants' },
];

interface MultiTenantComboboxProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function MultiTenantCombobox({ selected, onChange }: MultiTenantComboboxProps) {
  const [open, setOpen] = useState(false);

  const toggleTenant = (tenantId: string) => {
    if (selected.includes(tenantId)) {
      onChange(selected.filter(id => id !== tenantId));
    } else {
      onChange([...selected, tenantId]);
    }
  };

  const selectedTenants = MOCK_TENANTS.filter(t => selected.includes(t.id));
  const groupedTenants = MOCK_TENANTS.reduce((acc, tenant) => {
    if (!acc[tenant.category]) acc[tenant.category] = [];
    acc[tenant.category].push(tenant);
    return acc;
  }, {} as Record<string, Tenant[]>);

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            <span className="truncate">
              {selected.length === 0 ? 'Select tenants...' : `${selected.length} tenant(s) selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Search tenants..." />
            <CommandEmpty>No tenant found.</CommandEmpty>
            <div className="max-h-[300px] overflow-y-auto">
              {Object.entries(groupedTenants).map(([category, tenants]) => (
                <CommandGroup key={category} heading={category}>
                  {tenants.map((tenant) => (
                    <CommandItem
                      key={tenant.id}
                      value={tenant.name}
                      onSelect={() => toggleTenant(tenant.id)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selected.includes(tenant.id) ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {tenant.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </div>
            <div className="border-t p-2 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => onChange(MOCK_TENANTS.map(t => t.id))}>
                Select All
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => onChange([])}>
                Clear
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedTenants.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTenants.slice(0, 3).map((tenant) => (
            <Badge key={tenant.id} variant="secondary" className="gap-1">
              {tenant.name}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleTenant(tenant.id)} />
            </Badge>
          ))}
          {selectedTenants.length > 3 && (
            <Badge variant="outline">+{selectedTenants.length - 3} more</Badge>
          )}
        </div>
      )}
    </div>
  );
}
