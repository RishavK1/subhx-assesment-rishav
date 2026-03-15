'use client';

import { apiClient, refreshSession } from './http';
import type {
  AuthSessionResponse,
  AuthSuccessResponse,
  AuthUserResponse
} from '../types/auth';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: async (payload: RegisterPayload) => {
    return apiClient.post('/api/auth/register', payload);
  },
  login: async (payload: LoginPayload) => {
    const response = await apiClient.post<AuthSessionResponse>('/api/auth/login', payload);
    return response.data;
  },
  me: async () => {
    const response = await apiClient.get<AuthUserResponse>('/api/auth/me');
    return response.data;
  },
  refresh: async () => {
    return refreshSession();
  },
  logout: async () => {
    const response = await apiClient.post<AuthSuccessResponse>('/api/auth/logout');
    return response.data;
  }
};
