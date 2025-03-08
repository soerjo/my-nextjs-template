import Cookies from 'js-cookie';
import { create } from 'zustand';
import { useEffect } from 'react';

import { ILoginResponse } from '@/types/authentication';

interface IUserPayload {
  userId?: string;
  email?: string;
}

interface IAuthenticationState {
  payload: IUserPayload;
  isLogin: boolean;
  login: (dto: ILoginResponse) => void;
  logout: () => void;
  initializeAuth: () => void;
}
export const useAuthenticationStore = create<IAuthenticationState>((set) => ({
  payload: {}, // Default empty payload
  isLogin: false, // Assume logged out initially
  login: (dto) =>
    set(() => {
      Cookies.set('token', dto.token!, {
        expires: 1 / 3, // 8 hours
        secure: true,
        sameSite: 'Strict',
      });
      Cookies.set(
        'user',
        JSON.stringify({
          userId: dto.userId,
          email: dto.email,
        }),
        {
          expires: 1 / 3, // 8 hours
          secure: true,
          sameSite: 'Strict',
        },
      );

      return {
        payload: {
          userId: dto.userId,
          email: dto.email,
        },
        isLogin: true,
      };
    }),
  logout: () =>
    set(() => {
      Cookies.remove('token');
      Cookies.remove('user');

      return {
        payload: {},
        isLogin: false,
      };
    }),
  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      // Read cookies only on the client side
      const token = Cookies.get('token');
      const userData = Cookies.get('user');
      const initialPayload: IUserPayload = userData ? JSON.parse(userData) : {};

      set({
        isLogin: !!token,
        payload: initialPayload,
      });
    }
  },
}));

// Hook to call `initializeAuth` on mount
export const useInitializeAuth = () => {
  const initializeAuth = useAuthenticationStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
};
