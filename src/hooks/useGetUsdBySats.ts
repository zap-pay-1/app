import { satsToUsd } from '@/lib/currencyRates';
import { useQuery } from '@tanstack/react-query';

export function useSatsToUsd(sats: number) {
  return useQuery({
    queryKey: ['satsToUsd', sats],
    queryFn: async () => {
      if (sats <= 0) return 0;
      return await satsToUsd(sats);
    },
    staleTime: 60 * 1000, // 1 min cache
    enabled: sats > 0,    // only run if sats is positive
  });
}