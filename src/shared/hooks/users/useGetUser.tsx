import { useQuery } from '@tanstack/react-query';

import { getUsers } from '@/shared/services/users.service';

export const useGetUser = (params?: string) => {
  return useQuery({
    queryKey: ['users', { params }],
    queryFn: () => getUsers(params),
    refetchOnMount: false, // default is true
  });
};
