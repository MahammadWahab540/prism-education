-- Fix security issue: Ensure profiles table is completely inaccessible to anonymous users
-- Add explicit authentication checks to all RLS policies on profiles table

-- Drop existing policies
DROP POLICY IF EXISTS "Platform owners can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Platform owners can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Tenant admins can view tenant profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Recreate policies with explicit authentication checks
CREATE POLICY "Platform owners can update profiles" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() IS NOT NULL AND is_platform_owner(auth.uid()));

CREATE POLICY "Platform owners can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL AND is_platform_owner(auth.uid()));

CREATE POLICY "Tenant admins can view tenant profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_user_role(auth.uid()) = 'tenant_admin'::user_role 
  AND tenant_id = get_user_tenant(auth.uid())
);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() IS NOT NULL AND auth.uid() = id);

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL AND auth.uid() = id);

-- Ensure no INSERT or DELETE operations are allowed (profiles are managed by triggers)
-- These policies explicitly deny all operations to provide defense in depth
CREATE POLICY "Deny profile inserts" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (false);

CREATE POLICY "Deny profile deletes" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (false);