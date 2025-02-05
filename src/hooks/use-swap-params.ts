import { useQuery } from '@tanstack/react-query';
import { Address } from 'viem';
import { useEffect, useState } from 'react';
import { base } from 'viem/chains';
import { SwapResponse } from '@/types';

interface SwapParams {
  srcToken: string;
  destToken: string;
  destDecimals: number;
  userAddress: Address;
  amount: bigint;
  enabled?: boolean;
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export async function fetchSwapParams({
  srcToken,
  destToken,
  destDecimals,
  userAddress,
  amount,
}: Omit<SwapParams, 'enabled'>) {
  const params = new URLSearchParams({
    network: String(base.id),
    srcToken,
    destToken,
    destDecimals: destDecimals.toString(),
    userAddress,
    amount: String(amount),
    side: 'SELL',
    slippage: '250',
  });

  const response = await fetch(`https://api.paraswap.io/swap?${params}`);
  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || 'Failed to fetch swap parameters');
  }

  return data as SwapResponse;
}

export function useSwapParams({
  srcToken,
  destToken,
  destDecimals,
  userAddress,
  amount,
  enabled = true,
}: SwapParams) {
  const debouncedAmount = useDebounce(amount, 1500);

  return useQuery<SwapResponse>({
    queryKey: ['swap-params', srcToken, destToken, String(debouncedAmount)],
    enabled: enabled && !!debouncedAmount,
    queryFn: () =>
      fetchSwapParams({
        srcToken,
        destToken,
        destDecimals,
        userAddress,
        amount: debouncedAmount,
      }),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
  });
}
