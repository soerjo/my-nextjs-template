import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

import { IUserDetailResponse, Post } from '@/types/user';

const BASE_URL = 'https://bash-phi.vercel.app/api';

export const getUserDetail = async (): Promise<IUserDetailResponse> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<{ data: IUserDetailResponse }> = await axios.get(BASE_URL + '/users/bash', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log({ response: response.data });

    return response.data?.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getUsers = async (params?: string): Promise<Post[]> => {
  try {
    const response: AxiosResponse<Post[]> = await axios.get('https://jsonplaceholder.typicode.com/posts', {
      params: {
        userId: params,
      },
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(response.data);
      }, 1000);
    });
  } catch (error: any) {
    throw new Error(error);
  }
};
