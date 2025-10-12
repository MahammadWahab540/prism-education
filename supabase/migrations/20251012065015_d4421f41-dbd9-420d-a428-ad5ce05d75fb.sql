-- Fix RLS policies to be PERMISSIVE instead of RESTRICTIVE
-- Drop and recreate policies on user_profile_with_role

DROP POLICY IF EXISTS "Users can view their own profile with role" ON public.user_profile_with_role;
DROP POLICY IF EXISTS "Platform owners can view all profiles with roles" ON public.user_profile_with_role;
DROP POLICY IF EXISTS "Tenant admins can view tenant profiles with roles" ON public.user_profile_with_role;

-- Create PERMISSIVE policies (default behavior - any policy that passes grants access)
CREATE POLICY "Users can view their own profile with role"
ON public.user_profile_with_role
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Platform owners can view all profiles with roles"
ON public.user_profile_with_role
FOR SELECT
TO authenticated
USING (is_platform_owner(auth.uid()));

CREATE POLICY "Tenant admins can view tenant profiles with roles"
ON public.user_profile_with_role
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'tenant_admin'::user_role) AND tenant_id = get_user_tenant(auth.uid()));

-- Fix profiles table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Platform owners can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Tenant admins can view tenant profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Platform owners can update profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Platform owners can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (is_platform_owner(auth.uid()));

CREATE POLICY "Tenant admins can view tenant profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'tenant_admin'::user_role) AND tenant_id = get_user_tenant(auth.uid()));

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Platform owners can update profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (is_platform_owner(auth.uid()));

-- Fix user_roles table policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Platform owners can manage user roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Platform owners can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (is_platform_owner(auth.uid()));

-- Test the fix
SELECT 
    'Profile access test' as test_name,
    id, 
    email, 
    name, 
    role 
FROM public.user_profile_with_role 
WHERE id = '1557367a-67cd-4ff4-a622-cc30b8c9cc4e';