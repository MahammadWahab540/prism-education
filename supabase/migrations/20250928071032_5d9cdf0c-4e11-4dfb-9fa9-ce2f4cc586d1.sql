-- =============================================
-- COMPREHENSIVE ROW LEVEL SECURITY POLICIES
-- Multi-tenant LMS Platform Security Implementation
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_goal_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capstone_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capstone_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capstone_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capstone_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SECURITY DEFINER FUNCTIONS FOR ROLE CHECKING
-- =============================================

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT exists (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's primary role from profiles
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.profiles
  WHERE id = _user_id
$$;

-- Function to get user's tenant_id
CREATE OR REPLACE FUNCTION public.get_user_tenant(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id
  FROM public.profiles
  WHERE id = _user_id
$$;

-- Function to check if user is platform owner
CREATE OR REPLACE FUNCTION public.is_platform_owner(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id 
    AND role = 'platform_owner'
  )
$$;

-- Function to check if user is tenant admin for specific tenant
CREATE OR REPLACE FUNCTION public.is_tenant_admin(_user_id uuid, _tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id 
    AND role = 'tenant_admin'
    AND tenant_id = _tenant_id
  )
$$;

-- =============================================
-- TENANT POLICIES
-- =============================================

-- Platform owners can view all tenants
CREATE POLICY "Platform owners can view all tenants" ON public.tenants
    FOR SELECT USING (public.is_platform_owner(auth.uid()));

-- Platform owners can insert tenants
CREATE POLICY "Platform owners can insert tenants" ON public.tenants
    FOR INSERT WITH CHECK (public.is_platform_owner(auth.uid()));

-- Platform owners can update tenants
CREATE POLICY "Platform owners can update tenants" ON public.tenants
    FOR UPDATE USING (public.is_platform_owner(auth.uid()));

-- Tenant admins can view their own tenant
CREATE POLICY "Tenant admins can view their tenant" ON public.tenants
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'tenant_admin' 
        AND id = public.get_user_tenant(auth.uid())
    );

-- =============================================
-- PROFILE POLICIES
-- =============================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Platform owners can view all profiles
CREATE POLICY "Platform owners can view all profiles" ON public.profiles
    FOR SELECT USING (public.is_platform_owner(auth.uid()));

-- Tenant admins can view profiles in their tenant
CREATE POLICY "Tenant admins can view tenant profiles" ON public.profiles
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'tenant_admin'
        AND tenant_id = public.get_user_tenant(auth.uid())
    );

-- Platform owners can update any profile
CREATE POLICY "Platform owners can update profiles" ON public.profiles
    FOR UPDATE USING (public.is_platform_owner(auth.uid()));

-- =============================================
-- USER ROLES POLICIES
-- =============================================

-- Platform owners can manage all user roles
CREATE POLICY "Platform owners can manage user roles" ON public.user_roles
    FOR ALL USING (public.is_platform_owner(auth.uid()));

-- Users can view their own roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- SKILLS POLICIES
-- =============================================

-- Everyone can view active global skills
CREATE POLICY "View global skills" ON public.skills
    FOR SELECT USING (is_global = true AND is_active = true);

-- Users can view tenant-specific skills in their tenant
CREATE POLICY "View tenant skills" ON public.skills
    FOR SELECT USING (
        is_global = false 
        AND is_active = true
        AND tenant_id = public.get_user_tenant(auth.uid())
    );

-- Platform owners can manage all skills
CREATE POLICY "Platform owners manage skills" ON public.skills
    FOR ALL USING (public.is_platform_owner(auth.uid()));

-- Tenant admins can manage skills in their tenant
CREATE POLICY "Tenant admins manage tenant skills" ON public.skills
    FOR ALL USING (
        public.get_user_role(auth.uid()) = 'tenant_admin'
        AND (is_global = false AND tenant_id = public.get_user_tenant(auth.uid()))
    );

-- =============================================
-- CAREER CATEGORIES POLICIES
-- =============================================

-- Everyone can view active global categories
CREATE POLICY "View global career categories" ON public.career_categories
    FOR SELECT USING (is_global = true);

-- Users can view tenant-specific categories in their tenant
CREATE POLICY "View tenant career categories" ON public.career_categories
    FOR SELECT USING (
        is_global = false 
        AND tenant_id = public.get_user_tenant(auth.uid())
    );

-- Platform owners can manage all categories
CREATE POLICY "Platform owners manage career categories" ON public.career_categories
    FOR ALL USING (public.is_platform_owner(auth.uid()));

-- Tenant admins can manage categories in their tenant
CREATE POLICY "Tenant admins manage tenant categories" ON public.career_categories
    FOR ALL USING (
        public.get_user_role(auth.uid()) = 'tenant_admin'
        AND (is_global = false AND tenant_id = public.get_user_tenant(auth.uid()))
    );

-- =============================================
-- CAREER GOALS POLICIES
-- =============================================

-- Everyone can view active global goals
CREATE POLICY "View global career goals" ON public.career_goals
    FOR SELECT USING (is_global = true AND is_active = true);

-- Users can view tenant-specific goals in their tenant
CREATE POLICY "View tenant career goals" ON public.career_goals
    FOR SELECT USING (
        is_global = false 
        AND is_active = true
        AND tenant_id = public.get_user_tenant(auth.uid())
    );

-- Platform owners can manage all goals
CREATE POLICY "Platform owners manage career goals" ON public.career_goals
    FOR ALL USING (public.is_platform_owner(auth.uid()));

-- Tenant admins can manage goals in their tenant
CREATE POLICY "Tenant admins manage tenant goals" ON public.career_goals
    FOR ALL USING (
        public.get_user_role(auth.uid()) = 'tenant_admin'
        AND (is_global = false AND tenant_id = public.get_user_tenant(auth.uid()))
    );

-- =============================================
-- CAREER GOAL SKILLS POLICIES
-- =============================================

-- Everyone can view career goal skill relationships
CREATE POLICY "View career goal skills" ON public.career_goal_skills
    FOR SELECT USING (true);

-- Platform owners can manage all relationships
CREATE POLICY "Platform owners manage career goal skills" ON public.career_goal_skills
    FOR ALL USING (public.is_platform_owner(auth.uid()));

-- Tenant admins can manage relationships for their tenant's goals
CREATE POLICY "Tenant admins manage goal skills" ON public.career_goal_skills
    FOR ALL USING (
        public.get_user_role(auth.uid()) = 'tenant_admin'
        AND EXISTS (
            SELECT 1 FROM public.career_goals cg
            WHERE cg.id = career_goal_id
            AND (cg.is_global = false AND cg.tenant_id = public.get_user_tenant(auth.uid()))
        )
    );

-- =============================================
-- CONTENT ITEMS POLICIES
-- =============================================

-- Users can view published content in their tenant
CREATE POLICY "View tenant content" ON public.content_items
    FOR SELECT USING (
        is_active = true
        AND status = 'Published'
        AND (tenant_id = public.get_user_tenant(auth.uid()) OR tenant_id IS NULL)
    );

-- Platform owners can manage all content
CREATE POLICY "Platform owners manage content" ON public.content_items
    FOR ALL USING (public.is_platform_owner(auth.uid()));

-- Tenant admins can manage content in their tenant
CREATE POLICY "Tenant admins manage tenant content" ON public.content_items
    FOR ALL USING (
        public.get_user_role(auth.uid()) = 'tenant_admin'
        AND tenant_id = public.get_user_tenant(auth.uid())
    );

-- Content creators can manage their own content
CREATE POLICY "Content creators manage own content" ON public.content_items
    FOR ALL USING (auth.uid() = created_by);

-- =============================================
-- LEARNING SESSIONS POLICIES
-- =============================================

-- Users can view and manage their own learning sessions
CREATE POLICY "Users manage own learning sessions" ON public.learning_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Tenant admins can view learning sessions in their tenant
CREATE POLICY "Tenant admins view tenant sessions" ON public.learning_sessions
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'tenant_admin'
        AND EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = user_id
            AND p.tenant_id = public.get_user_tenant(auth.uid())
        )
    );

-- Platform owners can view all sessions
CREATE POLICY "Platform owners view all sessions" ON public.learning_sessions
    FOR SELECT USING (public.is_platform_owner(auth.uid()));

-- =============================================
-- CAPSTONE TEMPLATES POLICIES
-- =============================================

-- Users can view active templates
CREATE POLICY "View capstone templates" ON public.capstone_templates
    FOR SELECT USING (
        is_active = true
        AND (tenant_id = public.get_user_tenant(auth.uid()) OR tenant_id IS NULL)
    );

-- Platform owners can manage all templates
CREATE POLICY "Platform owners manage templates" ON public.capstone_templates
    FOR ALL USING (public.is_platform_owner(auth.uid()));

-- Tenant admins can manage templates in their tenant
CREATE POLICY "Tenant admins manage tenant templates" ON public.capstone_templates
    FOR ALL USING (
        public.get_user_role(auth.uid()) = 'tenant_admin'
        AND tenant_id = public.get_user_tenant(auth.uid())
    );

-- =============================================
-- CAPSTONE CONFIGS POLICIES
-- =============================================

-- Users can view published configs
CREATE POLICY "View published capstone configs" ON public.capstone_configs
    FOR SELECT USING (
        status = 'Published'
        AND (tenant_id = public.get_user_tenant(auth.uid()) OR tenant_id IS NULL)
    );

-- Platform owners can manage all configs
CREATE POLICY "Platform owners manage configs" ON public.capstone_configs
    FOR ALL USING (public.is_platform_owner(auth.uid()));

-- Tenant admins can manage configs in their tenant
CREATE POLICY "Tenant admins manage tenant configs" ON public.capstone_configs
    FOR ALL USING (
        public.get_user_role(auth.uid()) = 'tenant_admin'
        AND tenant_id = public.get_user_tenant(auth.uid())
    );

-- =============================================
-- CAPSTONE INSTANCES POLICIES
-- =============================================

-- Users can manage their own capstone instances
CREATE POLICY "Users manage own capstone instances" ON public.capstone_instances
    FOR ALL USING (auth.uid() = user_id);

-- Tenant admins can view instances in their tenant
CREATE POLICY "Tenant admins view tenant instances" ON public.capstone_instances
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'tenant_admin'
        AND tenant_id = public.get_user_tenant(auth.uid())
    );

-- Platform owners can view all instances
CREATE POLICY "Platform owners view all instances" ON public.capstone_instances
    FOR SELECT USING (public.is_platform_owner(auth.uid()));

-- =============================================
-- CAPSTONE SUBMISSIONS POLICIES
-- =============================================

-- Users can manage submissions for their own instances
CREATE POLICY "Users manage own submissions" ON public.capstone_submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.capstone_instances ci
            WHERE ci.id = instance_id
            AND ci.user_id = auth.uid()
        )
    );

-- Tenant admins can view and grade submissions in their tenant
CREATE POLICY "Tenant admins manage tenant submissions" ON public.capstone_submissions
    FOR ALL USING (
        public.get_user_role(auth.uid()) = 'tenant_admin'
        AND EXISTS (
            SELECT 1 FROM public.capstone_instances ci
            WHERE ci.id = instance_id
            AND ci.tenant_id = public.get_user_tenant(auth.uid())
        )
    );

-- Platform owners can view all submissions
CREATE POLICY "Platform owners view all submissions" ON public.capstone_submissions
    FOR SELECT USING (public.is_platform_owner(auth.uid()));

-- =============================================
-- STUDENT CERTIFICATIONS POLICIES
-- =============================================

-- Users can manage their own certifications
CREATE POLICY "Users manage own certifications" ON public.student_certifications
    FOR ALL USING (auth.uid() = user_id);

-- Tenant admins can view certifications in their tenant
CREATE POLICY "Tenant admins view tenant certifications" ON public.student_certifications
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'tenant_admin'
        AND EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = user_id
            AND p.tenant_id = public.get_user_tenant(auth.uid())
        )
    );

-- Platform owners can view all certifications
CREATE POLICY "Platform owners view all certifications" ON public.student_certifications
    FOR SELECT USING (public.is_platform_owner(auth.uid()));

-- =============================================
-- SKILL PROGRESS POLICIES
-- =============================================

-- Users can manage their own skill progress
CREATE POLICY "Users manage own skill progress" ON public.skill_progress
    FOR ALL USING (auth.uid() = user_id);

-- Tenant admins can view progress in their tenant
CREATE POLICY "Tenant admins view tenant progress" ON public.skill_progress
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'tenant_admin'
        AND EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = user_id
            AND p.tenant_id = public.get_user_tenant(auth.uid())
        )
    );

-- Platform owners can view all progress
CREATE POLICY "Platform owners view all progress" ON public.skill_progress
    FOR SELECT USING (public.is_platform_owner(auth.uid()));

-- =============================================
-- LEARNING PATHS POLICIES
-- =============================================

-- Users can manage their own learning paths
CREATE POLICY "Users manage own learning paths" ON public.learning_paths
    FOR ALL USING (auth.uid() = user_id);

-- Tenant admins can view paths in their tenant
CREATE POLICY "Tenant admins view tenant paths" ON public.learning_paths
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'tenant_admin'
        AND EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = user_id
            AND p.tenant_id = public.get_user_tenant(auth.uid())
        )
    );

-- Platform owners can view all paths
CREATE POLICY "Platform owners view all paths" ON public.learning_paths
    FOR SELECT USING (public.is_platform_owner(auth.uid()));

-- =============================================
-- NOTIFICATIONS POLICIES
-- =============================================

-- Users can manage their own notifications
CREATE POLICY "Users manage own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- NOTIFICATION PREFERENCES POLICIES
-- =============================================

-- Users can manage their own notification preferences
CREATE POLICY "Users manage own notification preferences" ON public.notification_preferences
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- AUDIT LOGS POLICIES
-- =============================================

-- Platform owners can view all audit logs
CREATE POLICY "Platform owners view audit logs" ON public.audit_logs
    FOR SELECT USING (public.is_platform_owner(auth.uid()));

-- Tenant admins can view logs for their tenant
CREATE POLICY "Tenant admins view tenant logs" ON public.audit_logs
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'tenant_admin'
        AND tenant_id = public.get_user_tenant(auth.uid())
    );

-- Users can view their own audit logs
CREATE POLICY "Users view own audit logs" ON public.audit_logs
    FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- SYSTEM SETTINGS POLICIES
-- =============================================

-- Platform owners can manage system settings
CREATE POLICY "Platform owners manage system settings" ON public.system_settings
    FOR ALL USING (public.is_platform_owner(auth.uid()));

-- =============================================
-- REALTIME SUBSCRIPTIONS
-- =============================================

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Enable realtime for learning sessions
ALTER PUBLICATION supabase_realtime ADD TABLE public.learning_sessions;

-- Enable realtime for skill progress
ALTER PUBLICATION supabase_realtime ADD TABLE public.skill_progress;

-- Enable realtime for capstone instances
ALTER PUBLICATION supabase_realtime ADD TABLE public.capstone_instances;

-- =============================================
-- FIX FUNCTION SEARCH PATHS
-- =============================================

-- Update the existing functions to have proper search paths
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role)
    VALUES (
        NEW.id, 
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
        COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;