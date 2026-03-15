'use client';

import { startTransition, useEffect, type ReactNode } from 'react';
import { authApi } from '@/app/api/auth';
import { useAuthStore } from '@/app/store/auth-store';
import { hasAuthHintCookie } from '@/app/utils/cookies';

interface AuthBootstrapProps {
  children: ReactNode;
}

export const AuthBootstrap = ({ children }: AuthBootstrapProps) => {
  const clearSession = useAuthStore((state) => state.clearSession);
  const setLoading = useAuthStore((state) => state.setLoading);
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    if (status !== 'idle') {
      return;
    }

    if (!hasAuthHintCookie()) {
      startTransition(() => {
        clearSession();
      });
      return;
    }

    startTransition(() => {
      setLoading();
    });

    void authApi
      .refresh()
      .catch(() => {
        startTransition(() => {
          clearSession();
        });
      });
  }, [clearSession, setLoading, status]);

  return <>{children}</>;
};
