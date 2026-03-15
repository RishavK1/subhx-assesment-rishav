'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authApi } from '@/app/api/auth';
import { Button } from '@/app/components/button';
import { appRoutes } from '@/app/router/routes';
import { useAuthStore } from '@/app/store/auth-store';

export const LogoutButton = () => {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);
  const [isLoading, setIsLoading] = useState(false);
  const label = isLoading ? 'Signing out...' : 'Logout';

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
    } finally {
      clearSession();
      router.replace(appRoutes.login);
      setIsLoading(false);
    }
  };

  return (
    <Button disabled={isLoading} onClick={handleClick} type="button" variant="secondary">
      {label}
    </Button>
  );
};
