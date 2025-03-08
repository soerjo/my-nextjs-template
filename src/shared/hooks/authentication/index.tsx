import { addToast } from '@heroui/toast';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { authForgot, authLogin, authSignUp } from '@/shared/services/auth.service';
import { useAuthenticaitionStore } from '@/shared/store/authentication';
import { IForgotRequest, ILoginRequest, ISignUpRequest } from '@/types/authentication';

export const useAuthLogin = () => {
  const router = useRouter();
  const { login } = useAuthenticaitionStore();

  return useMutation({
    mutationFn: (params: ILoginRequest) => authLogin(params),
    onSuccess: (data) => {
      login(data);
      addToast({
        title: 'Success',
        description: 'You have successfully logged in',
        color: 'success',
        variant: 'flat',
      });
      router.push('/dashboard');
    },
    onError: (error) => {
      addToast({
        title: 'Error',
        description: error?.message || 'Something went wrong',
        color: 'danger',
        variant: 'flat',
      });
    },
  });
};

export const useAuthForgot = () => {
  return useMutation({
    mutationFn: (params: IForgotRequest) => authForgot(params),
  });
};

export const useAuthSignUp = () => {
  return useMutation({
    mutationFn: (params: ISignUpRequest) => authSignUp(params),
  });
};
