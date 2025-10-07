-- Step 1: Add unique constraint to user_roles table
ALTER TABLE public.user_roles 
DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;

ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);

-- Step 2: Migrate existing roles from profiles to user_roles table
INSERT INTO public.user_roles (user_id, role, tenant_id)
SELECT id, role::user_role, tenant_id 
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Create security definer function to safely get user role
CREATE OR REPLACE FUNCTION public.get_user_role_safe(_user_id uuid)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1;
$$;

-- Step 4: Add RLS policy to allow authenticated users to read their own profile
DROP POLICY IF EXISTS "Authenticated users can view own profile" ON public.profiles;
CREATE POLICY "Authenticated users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Step 5: Drop the role column from profiles table (after migration complete)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;