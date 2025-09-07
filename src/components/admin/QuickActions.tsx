import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { Users, UserCog, Upload, ClipboardList, FileText, Settings } from 'lucide-react';

interface QuickActionsProps {
  permissions?: string[];
}

export function QuickActions({ permissions = [] }: QuickActionsProps) {
  const navigate = useNavigate();
  const items = [
    { label: 'Manage Students', icon: Users, url: '/students', perm: 'students.view' },
    { label: 'Assign Counselors', icon: UserCog, url: '/counselors/assign', perm: 'counselors.assign' },
    { label: 'Upload CSV', icon: Upload, url: '/imports/students', perm: 'imports.create' },
    { label: 'Approvals', icon: ClipboardList, url: '/approvals', perm: 'approvals.view' },
    { label: 'Reports', icon: FileText, url: '/analytics/reports', perm: 'reports.view' },
    { label: 'Settings', icon: Settings, url: '/settings', perm: 'settings.view' },
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((it) => {
        const disabled = permissions.length > 0 && !permissions.includes(it.perm);
        const Icon = it.icon;
        return (
          <Tooltip key={it.label}>
            <TooltipTrigger asChild>
              <Button variant="outline" className="justify-start" disabled={disabled} aria-label={it.label}
                onClick={() => { if (!disabled) navigate(it.url); }}
              >
                <Icon className="w-4 h-4 mr-2" />
                {it.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{disabled ? 'No permission' : it.url}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

