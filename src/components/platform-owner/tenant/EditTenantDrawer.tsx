import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { Tenant, updateTenant, updateTenantSchema, TenantsQueryKey } from '@/services/tenants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { track } from '@/lib/analytics';

export interface EditTenantDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant | null;
  canManage: boolean;
}

const formSchema = updateTenantSchema
  .extend({
    name: z.string().min(2, 'Required'),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use kebab-case, lowercase letters, numbers, dashes')
      .min(2)
      .max(30),
    adminEmail: z.string().email('Invalid email').optional().or(z.literal('')),
    accountQuota: z.number().int().min(1).max(10000),
  })
  .transform((values) => ({
    ...values,
    adminEmail: values.adminEmail === '' ? undefined : values.adminEmail,
  }));

type FormValues = z.infer<typeof formSchema>;

export function EditTenantDrawer({ open, onOpenChange, tenant, canManage }: EditTenantDrawerProps) {
  const qc = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: tenant
      ? {
          name: tenant.name,
          slug: tenant.slug,
          adminEmail: tenant.adminEmail,
          status: tenant.status,
          accountQuota: tenant.accountQuota,
          notes: tenant.notes ?? '',
          requirePasswordReset: !!tenant.requirePasswordReset,
        }
      : undefined,
    mode: 'onChange',
  });

  React.useEffect(() => {
    if (tenant) {
      form.reset({
        name: tenant.name,
        slug: tenant.slug,
        adminEmail: tenant.adminEmail,
        status: tenant.status,
        accountQuota: tenant.accountQuota,
        notes: tenant.notes ?? '',
        requirePasswordReset: !!tenant.requirePasswordReset,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant?.id]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!tenant) throw new Error('No tenant selected');
      const payload = {
        ...values,
      } as any;
      return await updateTenant(tenant.id, payload);
    },
    onMutate: async (values) => {
      await qc.cancelQueries({ queryKey: TenantsQueryKey });
      const prev = qc.getQueryData<any>(TenantsQueryKey) as any[] | undefined;
      if (tenant) {
        const optimistic = { ...tenant, ...values };
        qc.setQueryData(TenantsQueryKey, (old: any[] = []) => old.map((t) => (t.id === tenant.id ? optimistic : t)));
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(TenantsQueryKey, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: TenantsQueryKey });
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!tenant) return;
    try {
      const updated = await mutateAsync(values);
      track({ name: 'tenants_updated', props: { tenantId: tenant.id, orgName: updated.name } });
      toast({ title: 'Tenant updated' });
      onOpenChange(false);
    } catch (e: any) {
      const is409 = e?.status === 409;
      toast({ title: is409 ? 'Slug already in use' : "Couldn't update tenant" });
      if (is409) form.setError('slug', { type: 'server', message: 'Slug already in use' });
    }
  };

  const disabled = !canManage || isPending || !tenant;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" aria-busy={isPending} className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Edit Tenant</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain (slug)</FormLabel>
                  <FormControl>
                    <Input placeholder="acme-corp" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">Lowercase, numbers, dashes. Used for subdomain.</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adminEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="admin@acme.com" {...field} />
                  </FormControl>
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

            <FormField
              control={form.control}
              name="accountQuota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Users / Quota</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Internal notes (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-3">
              <FormField
                control={form.control}
                name="requirePasswordReset"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mb-0">Require password reset on next login</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={disabled} aria-busy={isPending} className="min-w-28">
                {isPending ? 'Saving…' : 'Save Changes'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

