import { useQuery } from '@tanstack/react-query';

import { getUsers } from '@/shared/services/users.service';

export const useGetUser = (params?: string) => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(params),
    refetchOnWindowFocus: false, // Prevent refetch when switching tabs
    refetchOnReconnect: false, // Prevent refetch when internet reconnects
    // staleTime: 1000 * 60 * 5,     // Keep data fresh for 5 minutes
  });
};
