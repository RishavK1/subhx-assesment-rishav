import { AuthShell } from '@/app/layouts/auth-shell';
import { RegisterForm } from '../components/register-form';

export const RegisterPage = () => {
  return (
    <AuthShell
      subtitle="The registration flow enforces the same password rules and payload validation on both sides of the boundary."
      title="Provision a user account without diluting the backend guarantees."
    >
      <RegisterForm />
    </AuthShell>
  );
};
