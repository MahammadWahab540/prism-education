-- Create support tickets table
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT NOT NULL DEFAULT 'general',
  user_id UUID NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responses JSONB DEFAULT '[]'::jsonb
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  target_audience TEXT NOT NULL DEFAULT 'all_students',
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  author_name TEXT
);

-- Create announcement_reads table to track which users have read announcements
CREATE TABLE public.announcement_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  announcement_id UUID NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(announcement_id, user_id)
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_reads ENABLE ROW LEVEL SECURITY;

-- RLS policies for support_tickets
CREATE POLICY "Users can view own tickets"
  ON public.support_tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tickets"
  ON public.support_tickets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Platform owners view all tickets"
  ON public.support_tickets FOR SELECT
  USING (is_platform_owner(auth.uid()));

CREATE POLICY "Platform owners update all tickets"
  ON public.support_tickets FOR UPDATE
  USING (is_platform_owner(auth.uid()));

CREATE POLICY "Tenant admins view tenant tickets"
  ON public.support_tickets FOR SELECT
  USING (
    get_user_role(auth.uid()) = 'tenant_admin'::user_role
    AND tenant_id = get_user_tenant(auth.uid())
  );

CREATE POLICY "Tenant admins update tenant tickets"
  ON public.support_tickets FOR UPDATE
  USING (
    get_user_role(auth.uid()) = 'tenant_admin'::user_role
    AND tenant_id = get_user_tenant(auth.uid())
  );

-- RLS policies for announcements
CREATE POLICY "Users can view tenant announcements"
  ON public.announcements FOR SELECT
  USING (
    is_active = true
    AND (tenant_id = get_user_tenant(auth.uid()) OR tenant_id IS NULL)
  );

CREATE POLICY "Platform owners manage all announcements"
  ON public.announcements FOR ALL
  USING (is_platform_owner(auth.uid()));

CREATE POLICY "Tenant admins manage tenant announcements"
  ON public.announcements FOR ALL
  USING (
    get_user_role(auth.uid()) = 'tenant_admin'::user_role
    AND tenant_id = get_user_tenant(auth.uid())
  );

-- RLS policies for announcement_reads
CREATE POLICY "Users manage own announcement reads"
  ON public.announcement_reads FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Platform owners view all announcement reads"
  ON public.announcement_reads FOR SELECT
  USING (is_platform_owner(auth.uid()));

-- Create updated_at trigger for support_tickets
CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_support_tickets_tenant_id ON public.support_tickets(tenant_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_announcements_tenant_id ON public.announcements(tenant_id);
CREATE INDEX idx_announcements_is_active ON public.announcements(is_active);
CREATE INDEX idx_announcement_reads_user_id ON public.announcement_reads(user_id);
CREATE INDEX idx_announcement_reads_announcement_id ON public.announcement_reads(announcement_id);