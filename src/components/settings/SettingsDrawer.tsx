import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSettings, patchSettings, SettingsQueryKey, PlatformSettings } from '@/services/tenants';
import { toast } from '@/components/ui/use-toast';
import { track } from '@/lib/analytics';

export interface SettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canManage: boolean;
}

const schema = z.object({
  general: z.object({
    companyName: z.string().min(2, 'Company name is required'),
    supportEmail: z.string().email('Invalid email'),
  }),
  billing: z.object({
    invoiceEmail: z.string().email('Invalid email').optional().or(z.literal('').transform(() => undefined)),
  }),
  theme: z.object({
    primaryColor: z.string().min(4),
    logoUrl: z.string().url().optional().or(z.literal('').transform(() => undefined)),
  }),
  roles: z.object({
    allowSelfSignup: z.boolean(),
  }),
});

type FormValues = z.infer<typeof schema>;

export function SettingsDrawer({ open, onOpenChange, canManage }: SettingsDrawerProps) {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useQuery({ queryKey: SettingsQueryKey, queryFn: fetchSettings });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: settings ?? {
      general: { companyName: '', supportEmail: '' },
      billing: { invoiceEmail: '' },
      theme: { primaryColor: '#4f46e5', logoUrl: '' },
      roles: { allowSelfSignup: false },
    },
    values: settings,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: patchSettings,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: SettingsQueryKey });
    },
  });

  const onSave = async () => {
    const values = form.getValues();
    track({ name: 'po_settings_save', props: { sections: ['general', 'billing', 'theme', 'roles'] } });
    try {
      await mutateAsync(values);
      toast({ title: 'Settings saved.' });
      onOpenChange(false);
    } catch {
      toast({ title: 'Failed to save settings' });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[32rem]" aria-busy={isPending}>
        <SheetHeader>
          <SheetTitle>Platform Settings</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-col h-full">
          <Form {...form}>
            <Tabs defaultValue="general" className="flex-1 flex flex-col min-h-0">
              <TabsList className="w-full">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="theme">Theme/Branding</TabsTrigger>
                <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
              </TabsList>
              <div className="flex-1 overflow-y-auto pt-4 space-y-6">
                <TabsContent value="general" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="general.companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="EduPlatform" {...field} disabled={!canManage || isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="general.supportEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Support Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="support@example.com" {...field} disabled={!canManage || isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="billing" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="billing.invoiceEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="billing@example.com" {...field} disabled={!canManage || isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="theme" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="theme.primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="#4f46e5" {...field} disabled={!canManage || isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="theme.logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://.../logo.png" {...field} disabled={!canManage || isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="roles" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="roles.allowSelfSignup"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Allow Self Signup</FormLabel>
                          <div className="text-sm text-muted-foreground">Let users request access without invite</div>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} disabled={!canManage || isPending} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </Form>

          <div className="sticky bottom-0 mt-4 flex justify-end gap-3 border-t pt-4 bg-background/60 backdrop-blur">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={onSave} disabled={!canManage || isPending} aria-busy={isPending} className="min-w-24">{isPending ? 'Saving…' : 'Save'}</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

