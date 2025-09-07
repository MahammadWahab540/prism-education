import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  scopeText: string;
  onConfirm: (format: 'csv' | 'xlsx' | 'pdf') => void;
}

export function ExportModal({ open, onOpenChange, scopeText, onConfirm }: ExportModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-4">{scopeText}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onConfirm('csv')}>CSV</Button>
          <Button onClick={() => onConfirm('xlsx')}>Excel</Button>
          <Button onClick={() => onConfirm('pdf')}>PDF</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

