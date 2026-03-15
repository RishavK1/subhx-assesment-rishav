import { DashboardShell } from '@/app/layouts/dashboard-shell';
import { AuthGuard } from '../components/auth-guard';
import { LogoutButton } from '../components/logout-button';
import { UserProfileCard } from '../components/user-profile-card';

export const DashboardPage = () => {
  return (
    <AuthGuard>
      <DashboardShell action={<LogoutButton />}>
        <UserProfileCard />
      </DashboardShell>
    </AuthGuard>
  );
};
