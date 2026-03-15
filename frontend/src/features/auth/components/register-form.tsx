'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { authApi } from '@/app/api/auth';
import { Button } from '@/app/components/button';
import { StatusBanner } from '@/app/components/status-banner';
import { TextField } from '@/app/components/text-field';
import { appRoutes } from '@/app/router/routes';
import { getErrorMessage } from '@/app/utils/error';
import { type RegisterFormValues, registerSchema } from '../schemas/register-schema';

const formClasses = 'space-y-5';
const footerClasses = 'flex flex-col gap-4 border-t border-[color:var(--border)] pt-5';
const descriptionClasses = 'text-sm leading-7 text-[color:var(--muted)]';
const linkClasses = 'font-semibold text-ink underline decoration-[color:rgba(23,33,33,0.25)] underline-offset-4';

export const RegisterForm = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const submitLabel = isSubmitting ? 'Creating account...' : 'Create account';
  const errorElement = errorMessage ? <StatusBanner tone="error">{errorMessage}</StatusBanner> : null;
  const successElement = successMessage ? <StatusBanner tone="success">{successMessage}</StatusBanner> : null;

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      await authApi.register(values);
      setSuccessMessage('Account created. Redirecting to login.');
      router.replace(`${appRoutes.login}?registered=1`);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="font-heading text-sm uppercase tracking-[0.35em] text-[color:var(--accent)]">Register</p>
        <h2 className="font-heading text-3xl text-ink">Create a secure account profile</h2>
        <p className={descriptionClasses}>
          Passwords are validated on the client and the server before they are hashed and stored.
        </p>
      </div>
      <form className={formClasses} onSubmit={handleSubmit(onSubmit)}>
        {errorElement}
        {successElement}
        <TextField
          autoComplete="name"
          error={errors.name?.message}
          label="Name"
          placeholder="Your full name"
          type="text"
          {...register('name')}
        />
        <TextField
          autoComplete="email"
          error={errors.email?.message}
          label="Email"
          placeholder="you@company.com"
          type="email"
          {...register('email')}
        />
        <TextField
          autoComplete="new-password"
          error={errors.password?.message}
          label="Password"
          placeholder="Use at least one uppercase letter and one number"
          type="password"
          {...register('password')}
        />
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {submitLabel}
        </Button>
      </form>
      <div className={footerClasses}>
        <p className={descriptionClasses}>
          Already registered?{' '}
          <Link className={linkClasses} href={appRoutes.login}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
