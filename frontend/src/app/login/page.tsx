import { LoginPage } from '@/features/auth/pages/login-page';

interface LoginRouteProps {
  searchParams: Promise<{
    registered?: string;
  }>;
}

export default async function LoginRoute({ searchParams }: LoginRouteProps) {
  const resolvedSearchParams = await searchParams;
  const registered = resolvedSearchParams.registered === '1';

  return <LoginPage registered={registered} />;
}
