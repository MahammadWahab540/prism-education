import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTenant, newTenantSchema, TenantsQueryKey } from '@/services/tenants';
import { track } from '@/lib/analytics';

export interface NewTenantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canManage: boolean;
}

const formSchema = newTenantSchema;
type FormValues = z.infer<typeof formSchema>;

export function NewTenantModal({ open, onOpenChange, canManage }: NewTenantModalProps) {
  const qc = useQueryClient();
  const openAt = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (open) {
      openAt.current = Date.now();
    } else {
      openAt.current = null;
    }
  }, [open]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      adminEmail: '',
      adminPhone: '',
      plan: 'pro',
      status: 'active',
      accountQuota: 5,
    },
    mode: 'onChange',
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createTenant,
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: TenantsQueryKey });
      const prev = qc.getQueryData<any>(TenantsQueryKey) as any[] | undefined;
      const optimistic = {
        id: `optimistic-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...input,
      };
      qc.setQueryData(TenantsQueryKey, (old: any[] = []) => [optimistic, ...old]);
      return { prev };
    },
    onError: (err: any, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(TenantsQueryKey, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: TenantsQueryKey });
    },
  });

  const onSubmit = async (values: FormValues) => {
    track({ name: 'po_new_tenant_submit', props: { tenant_name: values.name, slug: values.slug } });
    track({ name: 'tenant_create_submit', props: { account_quota: values.accountQuota, plan: values.plan } });
    try {
      const tenant = await mutateAsync(values as any);
      track({ name: 'po_new_tenant_success', props: { tenant_id: tenant.id } });
      track({ name: 'tenant_create_success', props: { tenant_id: tenant.id, account_quota: values.accountQuota } });
      if (openAt.current) {
        // eslint-disable-next-line no-console
        console.log('[analytics] po_new_tenant_timing', { ms: Date.now() - openAt.current });
      }
      toast({ title: 'Tenant created successfully.' });
      onOpenChange(false);
      form.reset();
    } catch (e: any) {
      const is409 = e?.status === 409;
      const message = is409 ? 'Slug already in use.' : "Couldn't create tenant. Please try again.";
      toast({ title: message });
      if (is409) {
        form.setError('slug', { type: 'server', message: 'Slug already in use' });
      }
    }
  };

  const disabled = !canManage || isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl" aria-busy={isPending} role="dialog" aria-label="Create Tenant">
        <DialogHeader>
          <DialogTitle>Create Tenant</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tenant Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corp" {...field} aria-required="true" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Admin Email<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@acme.com" {...field} aria-required="true" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1 555 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="accountQuota"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="accountQuota">
                      Accounts Requested<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="accountQuota"
                        type="number"
                        min={1}
                        step={1}
                        placeholder="e.g., 25"
                        aria-required="true"
                        aria-describedby="accountQuotaHelp"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </FormControl>
                    <p id="accountQuotaHelp" className="text-xs text-muted-foreground">
                      Number of user accounts (seats) allowed for this tenant.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Slug/Subdomain<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="acme-corp" {...field} aria-required="true" />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Lowercase, numbers and dashes only</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-end gap-3 sticky bottom-0 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={disabled} aria-busy={isPending} className="min-w-28">
                {isPending ? 'Creating…' : 'Create Tenant'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
