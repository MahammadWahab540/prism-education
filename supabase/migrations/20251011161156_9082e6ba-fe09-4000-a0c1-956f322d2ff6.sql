-- Fix RLS policies on profiles table to use correct role checking
-- Drop existing policies that use the old is_platform_owner function
DROP POLICY IF EXISTS "Platform owners can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Platform owners can update profiles" ON public.profiles;

-- Recreate policies using the correct has_role function
CREATE POLICY "Platform owners can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  (auth.uid() IS NOT NULL) AND 
  public.has_role(auth.uid(), 'platform_owner'::user_role)
);

CREATE POLICY "Platform owners can update profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  (auth.uid() IS NOT NULL) AND 
  public.has_role(auth.uid(), 'platform_owner'::user_role)
);