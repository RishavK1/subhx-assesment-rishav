import { AuthShell } from '@/app/layouts/auth-shell';
import { StatusBanner } from '@/app/components/status-banner';
import { LoginForm } from '../components/login-form';

interface LoginPageProps {
  registered: boolean;
}

export const LoginPage = ({ registered }: LoginPageProps) => {
  const bannerElement = registered ? (
    <StatusBanner tone="success">Registration completed. Sign in with your new credentials.</StatusBanner>
  ) : null;

  return (
    <AuthShell
      subtitle="Short-lived access tokens are kept in memory while refresh sessions stay in secure cookies."
      title="Ship a session model built for rotation, revocation, and recovery."
    >
      <div className="space-y-6">
        {bannerElement}
        <LoginForm />
      </div>
    </AuthShell>
  );
};
