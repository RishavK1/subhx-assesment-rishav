'use client';

import { create } from 'zustand';
import type { AuthUser } from '../types/auth';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'anonymous';

interface AuthState {
  status: AuthStatus;
  accessToken: string | null;
  user: AuthUser | null;
  setLoading: () => void;
  setSession: (accessToken: string, user: AuthUser) => void;
  clearSession: () => void;
  updateUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'idle',
  accessToken: null,
  user: null,
  setLoading: () => {
    set((state) => ({
      status: state.status === 'authenticated' ? 'authenticated' : 'loading'
    }));
  },
  setSession: (accessToken, user) => {
    set({
      status: 'authenticated',
      accessToken,
      user
    });
  },
  clearSession: () => {
    set({
      status: 'anonymous',
      accessToken: null,
      user: null
    });
  },
  updateUser: (user) => {
    set((state) => ({
      status: state.status,
      accessToken: state.accessToken,
      user
    }));
  }
}));
