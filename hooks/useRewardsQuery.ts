import { useQuery } from '@tanstack/react-query';

export function useRewardsQuery(address: string | undefined) {
  return useQuery({
    queryKey: ['rewards', address],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REWARDS_SERVICE_API_HOST}/api/v1/auth/user/${address}`);
      return response.json();
    },
    enabled: Boolean(address),
  });
}
