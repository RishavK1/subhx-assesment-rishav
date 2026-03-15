'use client';

import { useEffect, useState } from 'react';
import { authApi } from '@/app/api/auth';
import { StatusBanner } from '@/app/components/status-banner';
import { useAuthStore } from '@/app/store/auth-store';
import type { AuthUser } from '@/app/types/auth';
import { getErrorMessage } from '@/app/utils/error';

const labelClasses = 'text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]';
const valueClasses = 'mt-2 text-lg font-semibold text-ink';

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
};

const buildSections = (user: AuthUser) => {
  return [
    {
      key: 'name',
      label: 'Name',
      value: user.name
    },
    {
      key: 'email',
      label: 'Email',
      value: user.email
    },
    {
      key: 'created',
      label: 'Created',
      value: formatDate(user.createdAt)
    },
    {
      key: 'updated',
      label: 'Updated',
      value: formatDate(user.updatedAt)
    }
  ];
};

export const UserProfileCard = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const updateUser = useAuthStore((state) => state.updateUser);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    void authApi
      .me()
      .then((response) => {
        setErrorMessage('');
        updateUser(response.user);
      })
      .catch((error) => {
        setErrorMessage(getErrorMessage(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [updateUser, user]);

  const loadingElement = isLoading ? <StatusBanner>Fetching authenticated profile...</StatusBanner> : null;
  const errorElement = errorMessage ? <StatusBanner tone="error">{errorMessage}</StatusBanner> : null;
  const sections = user ? buildSections(user) : [];
  const gridElement = sections.length ? (
    <div className="grid gap-4 md:grid-cols-2">
      {sections.map((section) => (
        <article
          className="rounded-[28px] border border-[color:var(--border)] bg-white/75 p-6"
          key={section.key}
        >
          <p className={labelClasses}>{section.label}</p>
          <p className={valueClasses}>{section.value}</p>
        </article>
      ))}
    </div>
  ) : null;

  return (
    <section className="space-y-5">
      {loadingElement}
      {errorElement}
      {gridElement}
    </section>
  );
};
