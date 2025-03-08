export interface ILoginResponse {
  message: string;
  success: boolean;
  userId?: string;
  email?: string;
  token?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IForgotResponse {
  message: string;
  success: boolean;
  userId?: string;
  email?: string;
  token?: string;
}

export interface IForgotRequest {
  email?: string;
}

export interface ISignUpResponse {
  message: string;
  success: boolean;
  userId?: string;
  email?: string;
  token?: string;
}

export interface ISignUpRequest {
  username?: string;
  email?: string;
  password?: string;
}
