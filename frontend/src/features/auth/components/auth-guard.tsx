'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/api/auth';
import { PageLoader } from '@/app/components/page-loader';
import { appRoutes } from '@/app/router/routes';
import { useAuthStore } from '@/app/store/auth-store';
import { hasAuthHintCookie } from '@/app/utils/cookies';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const attemptedRefreshRef = useRef(false);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setLoading = useAuthStore((state) => state.setLoading);
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    if (status === 'authenticated') {
      attemptedRefreshRef.current = false;
      return;
    }

    if (!hasAuthHintCookie()) {
      clearSession();
      router.replace(appRoutes.login);
      return;
    }

    if (status === 'idle' && !attemptedRefreshRef.current) {
      attemptedRefreshRef.current = true;
      setLoading();

      void authApi.refresh().catch(() => {
        clearSession();
        router.replace(appRoutes.login);
      });
      return;
    }

    if (status === 'anonymous') {
      router.replace(appRoutes.login);
    }
  }, [clearSession, router, setLoading, status]);

  if (status === 'idle' || status === 'loading') {
    return <PageLoader />;
  }

  if (status === 'anonymous') {
    return <PageLoader />;
  }

  return <>{children}</>;
};
