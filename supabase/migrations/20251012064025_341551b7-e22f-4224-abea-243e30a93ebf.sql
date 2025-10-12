-- Insert missing profile for the user
INSERT INTO public.profiles (id, email, name, is_active)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', au.email),
  true
FROM auth.users au
WHERE au.id = '1557367a-67cd-4ff4-a622-cc30b8c9cc4e'
  AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = au.id)
ON CONFLICT (id) DO NOTHING;

-- Verify the fix by checking the view
SELECT * FROM user_profile_with_role WHERE id = '1557367a-67cd-4ff4-a622-cc30b8c9cc4e';