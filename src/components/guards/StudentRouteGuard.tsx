import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLearningPath } from '@/contexts/LearningPathContext';

interface StudentRouteGuardProps {
  children: React.ReactNode;
}

export function StudentRouteGuard({ children }: StudentRouteGuardProps) {
  const { user } = useAuth();
  const { needsOnboarding } = useLearningPath();
  const navigate = useNavigate();
  const location = useLocation();

  // Whitelist of paths that don't require learning path completion
  const whitelistedPaths = [
    '/learning-path',
    '/logout',
    '/',
    '/dashboard', // Allow dashboard access but show onboarding banner
    '/account/settings',
    '/settings',
    '/profile/learning-history'
  ];

  const isWhitelisted = whitelistedPaths.some(path => 
    location.pathname === path || location.pathname.startsWith(path)
  );

  useEffect(() => {
    // Only redirect students who need onboarding and aren't on whitelisted paths
    if (user?.role === 'student' && needsOnboarding && !isWhitelisted) {
      const searchParams = new URLSearchParams();
      searchParams.set('reason', 'no-active-skills');
      searchParams.set('redirect', location.pathname);
      
      navigate(`/learning-path?${searchParams.toString()}`, { replace: true });
    }
  }, [user, needsOnboarding, location.pathname, navigate, isWhitelisted]);

  return <>{children}</>;
}
