import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMutation } from '@tanstack/react-query';
import { CredentialPayload, sendCredentials, Tenant, getTenantUrl } from '@/services/tenants';
import { track } from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';
import { Copy, ExternalLink } from 'lucide-react';

export interface SendCredentialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant | null;
  canManage: boolean;
}

const formSchema = z.object({
  to: z.string().email('Invalid email'),
  cc: z.string().email('Invalid email').optional().or(z.literal('')),
  subject: z.string().min(1, 'Required'),
  message: z.string().min(1, 'Required'),
  methodEmail: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export function SendCredentialsModal({ open, onOpenChange, tenant, canManage }: SendCredentialsModalProps) {
  const { toast } = useToast();
  const tenantUrl = tenant ? getTenantUrl(tenant.slug) : '';
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: tenant?.adminEmail ?? '',
      cc: '',
      subject: 'Your LMS Access Credentials',
      message: `Hello ${tenant?.name ?? ''},\n\nYou can access your LMS at ${tenantUrl}.\n\nUse the link below to set your password and log in.\n\nBest regards,\nPlatform Team`,
      methodEmail: true,
    },
    mode: 'onChange',
  });

  React.useEffect(() => {
    if (tenant) {
      const url = getTenantUrl(tenant.slug);
      form.reset({
        to: tenant.adminEmail ?? '',
        cc: '',
        subject: 'Your LMS Access Credentials',
        message: `Hello ${tenant.name},\n\nYou can access your LMS at ${url}.\n\nUse the link below to set your password and log in.\n\nBest regards,\nPlatform Team`,
        methodEmail: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant?.id]);

  const [copyLink, setCopyLink] = React.useState<string | undefined>(undefined);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!tenant) throw new Error('No tenant selected');
      const payload: CredentialPayload = {
        to: values.to,
        cc: values.cc || undefined,
        subject: values.subject,
        message: values.message,
        method: values.methodEmail ? 'email' : 'copy',
      };
      return await sendCredentials(tenant.id, payload);
    },
    onSuccess: (res) => {
      if (res.link) setCopyLink(res.link);
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!tenant) return;
    try {
      const res = await mutateAsync(values);
      track({ name: 'tenants_credentials_sent', props: { tenantId: tenant.id, orgName: tenant.name, method: values.methodEmail ? 'email' : 'copy' } });
      if (values.methodEmail) {
        toast({ title: `Credentials sent to ${values.to}` });
        onOpenChange(false);
      } else if (res.link) {
        await navigator.clipboard.writeText(res.link);
        toast({ title: 'Credential link copied to clipboard' });
      }
      if (res.info) {
        toast({ title: res.info });
      }
    } catch (e: any) {
      toast({ title: e?.message || "Couldn't send credentials" });
    }
  };

  const disabled = !canManage || isPending || !tenant || tenant.status !== 'active';
  const recentlySentInfo = (() => {
    if (!tenant?.lastCredentialsSentAt) return null;
    const last = new Date(tenant.lastCredentialsSentAt).getTime();
    const now = Date.now();
    if (now - last < 10 * 60 * 1000) {
      const mins = Math.ceil((10 * 60 * 1000 - (now - last)) / 60000);
      return `Credentials were sent recently. You can send again in ~${mins} min.`;
    }
    return null;
  })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" role="dialog" aria-label="Send Credentials" aria-busy={isPending}>
        <DialogHeader>
          <DialogTitle>Send Credentials</DialogTitle>
        </DialogHeader>

        {tenant && tenant.status !== 'active' && (
          <div className="p-3 rounded border bg-yellow-50 text-yellow-900 text-sm" role="note">
            Activate tenant to send credentials.
          </div>
        )}
        {recentlySentInfo && (
          <div className="p-3 rounded border bg-blue-50 text-blue-900 text-sm" role="note">
            {recentlySentInfo}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Tenant Access URL Section */}
            <div className="p-4 rounded-lg border bg-muted/50 space-y-3">
              <Label className="text-sm font-semibold">Tenant Login URL</Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={tenantUrl}
                  className="font-mono text-sm"
                  aria-label="Tenant access URL"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await navigator.clipboard.writeText(tenantUrl);
                    toast({ title: 'Link copied to clipboard!' });
                  }}
                  className="flex-shrink-0"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                {tenant?.status === 'active' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(tenantUrl, '_blank', 'noopener,noreferrer')}
                    className="flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Share this URL with the tenant admin to access their portal
              </p>
            </div>

            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="admin@org.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CC</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="cc@example.com (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Your LMS Access Credentials" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-3">
              <Switch
                id="methodEmail"
                checked={form.watch('methodEmail')}
                onCheckedChange={(v) => form.setValue('methodEmail', v)}
                disabled={isPending}
              />
              <Label htmlFor="methodEmail">Delivery via Email (disable for Copy Only)</Label>
            </div>

            {!form.watch('methodEmail') && copyLink && (
              <div className="flex items-center gap-2">
                <Input readOnly value={copyLink} aria-label="Credential link" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    if (copyLink) {
                      await navigator.clipboard.writeText(copyLink);
                      toast({ title: 'Copied' });
                    }
                  }}
                >
                  Copy
                </Button>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={disabled} aria-busy={isPending} className="min-w-28">
                {isPending ? 'Sending…' : form.watch('methodEmail') ? 'Send' : 'Generate Link'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

