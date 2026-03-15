'use client';

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { AxiosHeaders } from 'axios';
import { useAuthStore } from '../store/auth-store';
import type { AuthSessionResponse } from '../types/auth';
import { readCsrfToken } from '../utils/cookies';
import { clientEnv } from '../utils/env';

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const attachCsrfHeader = (config: InternalAxiosRequestConfig) => {
  const method = config.method?.toUpperCase();
  const csrfToken = readCsrfToken();
  const shouldAttach = method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';

  if (csrfToken && shouldAttach) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set('x-csrf-token', csrfToken);
    config.headers = headers;
  }

  return config;
};

const isNonRetriableAuthRequest = (url: string) => {
  return url.includes('/api/auth/login') || url.includes('/api/auth/register') || url.includes('/api/auth/logout');
};

const apiClient = axios.create({
  baseURL: clientEnv.apiBaseUrl,
  withCredentials: true
});

const refreshClient = axios.create({
  baseURL: clientEnv.apiBaseUrl,
  withCredentials: true
});

let refreshPromise: Promise<AuthSessionResponse> | null = null;

const refreshSession = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<AuthSessionResponse>('/api/auth/refresh', undefined, {
        headers: {
          'x-csrf-token': readCsrfToken() ?? ''
        }
      })
      .then((response) => {
        useAuthStore.getState().setSession(response.data.accessToken, response.data.user);
        return response.data;
      })
      .catch((error: AxiosError) => {
        useAuthStore.getState().clearSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set('Authorization', `Bearer ${accessToken}`);
    config.headers = headers;
  }

  return attachCsrfHeader(config);
});

refreshClient.interceptors.request.use((config) => {
  return attachCsrfHeader(config);
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const responseStatus = error.response?.status;
    const config = error.config as RetriableRequestConfig | undefined;
    const requestUrl = config?.url ?? '';
    const isRefreshRequest = requestUrl.includes('/api/auth/refresh');

    if (responseStatus !== 401 || !config || config._retry || isRefreshRequest || isNonRetriableAuthRequest(requestUrl)) {
      throw error;
    }

    config._retry = true;

    const session = await refreshSession();
    const headers = AxiosHeaders.from(config.headers);
    headers.set('Authorization', `Bearer ${session.accessToken}`);
    config.headers = headers;

    return apiClient(config);
  }
);

export { apiClient, refreshSession };
