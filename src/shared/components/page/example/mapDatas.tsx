import { CircularProgress } from '@heroui/progress';

import { useGetUser } from '@/shared/hooks/users/useGetUser';

export const MapDatas = () => {
  const { data, isFetching } = useGetUser();

  if (isFetching) return <CircularProgress aria-label="Loading..." />;

  return data?.map((post) => (
    <div key={post.id}>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
    </div>
  ));
};
