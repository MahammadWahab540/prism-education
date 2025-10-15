-- =============================================
-- COMPREHENSIVE LMS PLATFORM DATABASE SCHEMA
-- Multi-tenant Learning Management System
-- =============================================

-- Create custom types
CREATE TYPE user_role AS ENUM ('platform_owner', 'tenant_admin', 'student');
CREATE TYPE difficulty_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');
CREATE TYPE submission_type AS ENUM ('repo', 'report', 'demo', 'assignment');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error', 'assignment', 'grade', 'announcement');
CREATE TYPE capstone_status AS ENUM ('Draft', 'Published', 'Archived');
CREATE TYPE instance_status AS ENUM ('Active', 'Completed', 'Submitted', 'Graded', 'Paused');
CREATE TYPE content_status AS ENUM ('Draft', 'Review', 'Published', 'Archived');

-- =============================================
-- CORE TENANT & USER MANAGEMENT
-- =============================================

-- Tenants table for multi-tenancy
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    settings JSONB DEFAULT '{
        "branding": {"primaryColor": "#3b82f6"},
        "features": ["courses", "capstones", "analytics"]
    }'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User profiles linked to auth.users
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'student',
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    phone TEXT,
    location TEXT,
    preferred_role TEXT,
    salary_expectation INTEGER,
    available_from DATE,
    total_watch_time_hours INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    engagement_score INTEGER DEFAULT 0 CHECK (engagement_score >= 0 AND engagement_score <= 100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User roles table for fine-grained permissions
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role user_role NOT NULL,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, role, tenant_id)
);

-- =============================================
-- SKILLS & CAREER MANAGEMENT
-- =============================================

-- Skills management
CREATE TABLE public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    difficulty difficulty_level DEFAULT 'Beginner',
    estimated_hours INTEGER,
    is_global BOOLEAN DEFAULT false,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT unique_skill_per_scope UNIQUE (name, tenant_id, is_global)
);

-- Career categories
CREATE TABLE public.career_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    is_global BOOLEAN DEFAULT false,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT unique_category_per_scope UNIQUE (name, tenant_id, is_global)
);

-- Career goals
CREATE TABLE public.career_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.career_categories(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    icon TEXT,
    short_description TEXT,
    long_description TEXT,
    duration_min_months INTEGER NOT NULL CHECK (duration_min_months > 0),
    duration_max_months INTEGER NOT NULL CHECK (duration_max_months >= duration_min_months),
    difficulty difficulty_level NOT NULL,
    is_global BOOLEAN DEFAULT false,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT unique_goal_per_category_scope UNIQUE (name, category_id, tenant_id, is_global)
);

-- Link career goals to skills
CREATE TABLE public.career_goal_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_goal_id UUID REFERENCES public.career_goals(id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(career_goal_id, skill_id)
);

-- =============================================
-- CONTENT MANAGEMENT
-- =============================================

-- Content items (videos, articles, documents)
CREATE TABLE public.content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL, -- 'video', 'article', 'document', 'quiz'
    content_url TEXT, -- YouTube URL, document URL, etc.
    thumbnail_url TEXT,
    duration_minutes INTEGER,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    status content_status DEFAULT 'Draft',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Learning sessions (detailed engagement tracking)
CREATE TABLE public.learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content_item_id UUID REFERENCES public.content_items(id) ON DELETE CASCADE NOT NULL,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
    session_end TIMESTAMP WITH TIME ZONE,
    watch_time_seconds INTEGER DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- CAPSTONE PROJECT SYSTEM
-- =============================================

-- Capstone templates
CREATE TABLE public.capstone_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    difficulty difficulty_level NOT NULL,
    tags TEXT[] DEFAULT '{}',
    overview JSONB NOT NULL, -- {problem, objective}
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Capstone configurations
CREATE TABLE public.capstone_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    difficulty difficulty_level NOT NULL,
    time_estimate TEXT, -- "2-3 weeks"
    expected_deliverables TEXT[] DEFAULT '{}',
    overview JSONB NOT NULL, -- {description, outcomes, prerequisites}
    checkpoints JSONB DEFAULT '[]'::jsonb,
    rubric JSONB NOT NULL, -- {items: [{id, criterion, weight, description}]}
    features JSONB DEFAULT '{"aiRoadmap": true, "aiGuide": true, "autoEvaluation": true}'::jsonb,
    status capstone_status DEFAULT 'Draft',
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Capstone instances (student enrollments)
CREATE TABLE public.capstone_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.capstone_templates(id) ON DELETE SET NULL,
    config_id UUID REFERENCES public.capstone_configs(id) ON DELETE SET NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    status instance_status DEFAULT 'Active',
    roadmap JSONB, -- Generated roadmap structure
    progress JSONB DEFAULT '{}'::jsonb, -- Progress tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Capstone submissions
CREATE TABLE public.capstone_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID REFERENCES public.capstone_instances(id) ON DELETE CASCADE NOT NULL,
    submission_type submission_type NOT NULL,
    title TEXT,
    description TEXT,
    submission_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    graded_at TIMESTAMP WITH TIME ZONE,
    grade NUMERIC(5,2), -- Out of 100
    feedback TEXT,
    graded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- =============================================
-- STUDENT PROGRESS & ANALYTICS
-- =============================================

-- Student certifications
CREATE TABLE public.student_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    issuing_body TEXT NOT NULL,
    date_awarded DATE NOT NULL,
    certificate_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Skill progress tracking
CREATE TABLE public.skill_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    overall_progress_percent INTEGER DEFAULT 0 CHECK (overall_progress_percent >= 0 AND overall_progress_percent <= 100),
    average_quiz_score INTEGER DEFAULT 0 CHECK (average_quiz_score >= 0 AND average_quiz_score <= 100),
    capstone_project_requested BOOLEAN DEFAULT false,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, skill_id)
);

-- Learning paths (student career goal selections)
CREATE TABLE public.learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    career_goal_id UUID REFERENCES public.career_goals(id) ON DELETE CASCADE NOT NULL,
    selected_skills UUID[] DEFAULT '{}', -- Array of skill IDs
    status TEXT DEFAULT 'active', -- 'active', 'completed', 'paused'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, career_goal_id)
);

-- =============================================
-- NOTIFICATION SYSTEM
-- =============================================

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'info',
    action_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notification preferences
CREATE TABLE public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    assignment_notifications BOOLEAN DEFAULT true,
    grade_notifications BOOLEAN DEFAULT true,
    announcement_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- =============================================
-- SYSTEM ADMINISTRATION
-- =============================================

-- Audit logs for comprehensive tracking
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- System settings
CREATE TABLE public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- User and tenant indexes
CREATE INDEX idx_profiles_tenant_id ON public.profiles(tenant_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_tenant_id ON public.user_roles(tenant_id);

-- Skills and career indexes
CREATE INDEX idx_skills_tenant_id ON public.skills(tenant_id);
CREATE INDEX idx_skills_is_global ON public.skills(is_global);
CREATE INDEX idx_career_goals_category_id ON public.career_goals(category_id);
CREATE INDEX idx_career_goals_tenant_id ON public.career_goals(tenant_id);

-- Content and learning indexes
CREATE INDEX idx_content_items_skill_id ON public.content_items(skill_id);
CREATE INDEX idx_content_items_tenant_id ON public.content_items(tenant_id);
CREATE INDEX idx_learning_sessions_user_id ON public.learning_sessions(user_id);
CREATE INDEX idx_learning_sessions_content_item_id ON public.learning_sessions(content_item_id);

-- Capstone indexes
CREATE INDEX idx_capstone_instances_user_id ON public.capstone_instances(user_id);
CREATE INDEX idx_capstone_instances_skill_id ON public.capstone_instances(skill_id);
CREATE INDEX idx_capstone_submissions_instance_id ON public.capstone_submissions(instance_id);

-- Progress and notification indexes
CREATE INDEX idx_skill_progress_user_id ON public.skill_progress(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(user_id, is_read);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- =============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================

-- Function to update updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to relevant tables
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_career_categories_updated_at BEFORE UPDATE ON public.career_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_career_goals_updated_at BEFORE UPDATE ON public.career_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_capstone_configs_updated_at BEFORE UPDATE ON public.capstone_configs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_capstone_instances_updated_at BEFORE UPDATE ON public.capstone_instances FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_skill_progress_updated_at BEFORE UPDATE ON public.skill_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON public.learning_paths FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- =============================================

-- Function to create profile when user signs up
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();