import React, { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const CAREER_CHOICES = [
  'Software Engineer',
  'Data Scientist',
  'Product Manager',
  'DevOps Engineer',
  'Financial Analyst',
  'UX Designer',
  'Marketing Manager',
  'Business Analyst',
];

interface MultiCareerSelectProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function MultiCareerSelect({ selected, onChange }: MultiCareerSelectProps) {
  const [open, setOpen] = useState(false);

  const toggle = (career: string) => {
    if (selected.includes(career)) {
      onChange(selected.filter(c => c !== career));
    } else {
      onChange([...selected, career]);
    }
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            <span className="truncate">
              {selected.length === 0 ? 'Select career paths...' : `${selected.length} career(s) selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0">
          <Command>
            <CommandInput placeholder="Search careers..." />
            <CommandEmpty>No career found.</CommandEmpty>
            <CommandGroup>
              {CAREER_CHOICES.map((career) => (
                <CommandItem key={career} value={career} onSelect={() => toggle(career)}>
                  <Check
                    className={cn('mr-2 h-4 w-4', selected.includes(career) ? 'opacity-100' : 'opacity-0')}
                  />
                  {career}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selected.map((career) => (
            <Badge key={career} variant="secondary" className="gap-1">
              {career}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggle(career)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
