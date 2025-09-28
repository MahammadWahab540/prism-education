-- =============================================
-- SIMPLE SEED DATA FOR LMS PLATFORM
-- =============================================

-- Insert initial tenants (only if none exist)
INSERT INTO public.tenants (name, domain, settings, is_active) 
SELECT 'Demo University', 'demo.university.edu', '{"branding": {"primaryColor": "#3b82f6"}, "features": ["courses", "capstones", "analytics"]}', true
WHERE NOT EXISTS (SELECT 1 FROM public.tenants WHERE domain = 'demo.university.edu');

INSERT INTO public.tenants (name, domain, settings, is_active) 
SELECT 'TechCorp Training', 'training.techcorp.com', '{"branding": {"primaryColor": "#059669"}, "features": ["courses", "capstones", "analytics", "certifications"]}', true
WHERE NOT EXISTS (SELECT 1 FROM public.tenants WHERE domain = 'training.techcorp.com');

-- Insert global skills categories
INSERT INTO public.career_categories (name, description, icon, is_global, tenant_id) 
SELECT 'Technology', 'Software development, data science, and technical skills', '💻', true, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.career_categories WHERE name = 'Technology' AND is_global = true);

INSERT INTO public.career_categories (name, description, icon, is_global, tenant_id) 
SELECT 'Design', 'UI/UX design, visual design, and creative skills', '🎨', true, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.career_categories WHERE name = 'Design' AND is_global = true);

INSERT INTO public.career_categories (name, description, icon, is_global, tenant_id) 
SELECT 'Business', 'Management, marketing, and business skills', '📊', true, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.career_categories WHERE name = 'Business' AND is_global = true);

INSERT INTO public.career_categories (name, description, icon, is_global, tenant_id) 
SELECT 'Data Science', 'Analytics, machine learning, and data visualization', '📈', true, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.career_categories WHERE name = 'Data Science' AND is_global = true);

-- Insert system settings
INSERT INTO public.system_settings (key, value, description) 
SELECT 'platform_name', '"LMS Platform"', 'The name of the platform'
WHERE NOT EXISTS (SELECT 1 FROM public.system_settings WHERE key = 'platform_name');

INSERT INTO public.system_settings (key, value, description) 
SELECT 'enable_registrations', 'true', 'Whether new user registrations are enabled'
WHERE NOT EXISTS (SELECT 1 FROM public.system_settings WHERE key = 'enable_registrations');

INSERT INTO public.system_settings (key, value, description) 
SELECT 'default_user_role', '"student"', 'Default role for new users'
WHERE NOT EXISTS (SELECT 1 FROM public.system_settings WHERE key = 'default_user_role');