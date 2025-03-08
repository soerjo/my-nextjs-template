import { addToast } from '@heroui/toast';
import { useQuery } from '@tanstack/react-query';

import { getUserDetail } from '@/shared/services/users.service';

export const useUserDetails = () => {
  const query = useQuery({
    queryKey: ['users'],
    queryFn: () => getUserDetail(),
    refetchOnWindowFocus: false, // Prevent refetch when switching tabs
    refetchOnReconnect: false, // Prevent refetch when internet reconnects
    // staleTime: 1000 * 60 * 5,     // Keep data fresh for 5 minutes
  });

  if (query.isError) {
    addToast({
      title: 'Error',
      description: query.error?.message || 'Something went wrong',
      color: 'danger',
      variant: 'flat',
    });
  }

  return query;
};
