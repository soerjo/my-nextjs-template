import axios, { AxiosResponse } from 'axios';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

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
      }, 5000);
    });
  } catch (error) {
    console.error('Error fetching posts:', error);

    return [];
  }
};
