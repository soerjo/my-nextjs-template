import { ILoginResponse } from '@/types/authentication';
import Cookies from 'js-cookie';
import { create } from 'zustand';

interface IUserPayload {
  userId?: string;
  email?: string;
}

interface IAuthenticationState {
  payload: IUserPayload;
  isLogin: boolean;
  login: (dto: ILoginResponse) => void;
  logout: () => void;
}

export const useAuthenticaitionStore = create<IAuthenticationState>((set) => ({
  payload: {},
  isLogin: false,
  login: (dto) =>
    set(() => {
      Cookies.set('token', dto.token!, {
        expires: 1 / 3, // 8 hours (1/3 of a day)
        secure: true, // Ensure HTTPS is used
        sameSite: 'Strict',
      });
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
      return {
        payload: {},
        isLogin: false,
      };
    }),
}));
