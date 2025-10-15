-- =============================================
-- SIMPLIFIED SEED DATA FOR LMS PLATFORM
-- =============================================

-- Insert initial tenants (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.tenants WHERE domain = 'demo.university.edu') THEN
        INSERT INTO public.tenants (name, domain, settings, is_active) VALUES
        ('Demo University', 'demo.university.edu', '{"branding": {"primaryColor": "#3b82f6"}, "features": ["courses", "capstones", "analytics"]}', true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.tenants WHERE domain = 'training.techcorp.com') THEN
        INSERT INTO public.tenants (name, domain, settings, is_active) VALUES
        ('TechCorp Training', 'training.techcorp.com', '{"branding": {"primaryColor": "#059669"}, "features": ["courses", "capstones", "analytics", "certifications"]}', true);
    END IF;
END $$;

-- Insert system settings
INSERT INTO public.system_settings (key, value, description) VALUES
('platform_name', '"LMS Platform"', 'The name of the platform'),
('enable_registrations', 'true', 'Whether new user registrations are enabled'),
('default_user_role', '"student"', 'Default role for new users'),
('ai_features_enabled', 'true', 'Whether AI features are enabled platform-wide')
ON CONFLICT (key) DO NOTHING;