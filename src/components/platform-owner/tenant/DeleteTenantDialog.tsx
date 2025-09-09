import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Tenant, deleteTenant, TenantsQueryKey } from '@/services/tenants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { track } from '@/lib/analytics';

export interface DeleteTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant | null;
  canManage: boolean;
}

export function DeleteTenantDialog({ open, onOpenChange, tenant, canManage }: DeleteTenantDialogProps) {
  const [ack, setAck] = React.useState(false);
  const [hard, setHard] = React.useState(false);
  const [slugConfirm, setSlugConfirm] = React.useState('');
  const qc = useQueryClient();

  React.useEffect(() => {
    if (open) {
      setAck(false);
      setHard(false);
      setSlugConfirm('');
    }
  }, [open]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      if (!tenant) throw new Error('No tenant selected');
      return await deleteTenant(tenant.id, { hard });
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: TenantsQueryKey });
      const prev = qc.getQueryData<any>(TenantsQueryKey) as any[] | undefined;
      if (tenant) {
        qc.setQueryData(TenantsQueryKey, (old: any[] = []) => old.filter((t) => t.id !== tenant.id));
      }
      return { prev };
    },
    onError: (err: any, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(TenantsQueryKey, ctx.prev);
      toast({ title: err?.message || "Couldn't delete tenant" });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: TenantsQueryKey });
    },
  });

  const canSoftDelete = tenant ? !(tenant.status === 'active' && tenant.usedSeats > 0) : false;
  const requireSlug = hard;
  const slugMatches = tenant ? slugConfirm.trim() === tenant.slug : false;
  const disabled = !canManage || isPending || !tenant || !ack || (requireSlug && !slugMatches) || (!hard && !canSoftDelete);

  const onDelete = async () => {
    if (!tenant) return;
    try {
      await mutateAsync();
      track({ name: 'tenants_deleted', props: { tenantId: tenant.id, orgName: tenant.name, hard } });
      toast({ title: 'Tenant deleted' });
      onOpenChange(false);
    } catch {
      // handled in onError
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" aria-busy={isPending} role="dialog" aria-label="Delete Tenant">
        <DialogHeader>
          <DialogTitle>Delete Tenant</DialogTitle>
        </DialogHeader>

        {tenant && (
          <div className="space-y-4">
            <div className="rounded border p-3 bg-red-50 text-red-900 text-sm">
              This will {hard ? 'permanently and irreversibly ' : ''}remove access for all users of "{tenant.name}".
              {(!hard && !canSoftDelete) && (
                <div className="mt-2">Soft delete is blocked for active tenants with users. Choose hard delete to proceed.</div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Switch id="hard" checked={hard} onCheckedChange={setHard} disabled={isPending} />
              <Label htmlFor="hard">Hard delete (requires typing tenant slug to confirm)</Label>
            </div>

            {hard && (
              <div>
                <Label htmlFor="slugConfirm" className="text-sm">Type tenant slug to confirm</Label>
                <Input id="slugConfirm" value={slugConfirm} onChange={(e) => setSlugConfirm(e.target.value)} placeholder={tenant.slug} />
                {!slugMatches && slugConfirm.length > 0 && (
                  <p className="text-xs text-red-600 mt-1">Slug does not match.</p>
                )}
              </div>
            )}

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
              I understand this will revoke access for all users.
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={onDelete} disabled={disabled} aria-busy={isPending} className="min-w-24">
                {isPending ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

