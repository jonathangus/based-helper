import { useState, useEffect } from 'react';
import { TokenItem } from './token-item';
import { useFormContext } from 'react-hook-form';
import { Order } from '@/types';
import { useAccount } from 'wagmi';
import { Address } from 'viem';

type Props = {
  order: Order[];
};

export function TokenList({ order }: Props) {
  const { watch, setValue } = useFormContext();
  const inputAmount = watch('inputAmount');
  const { address } = useAccount();
  const handleAllocationChange = (symbol: string, value: number) => {
    const newAllocations = { ...watch('tokens'), [symbol]: value.toString() };
    const total = Object.values(newAllocations).reduce(
      (sum, val) => Number(sum) + Number(val),
      0
    ) as number;

    if (total > 100) {
      const excess = total - 100;
      const symbolsToAdjust = Object.keys(newAllocations).filter(
        (s) => s !== symbol
      );
      const adjustment = excess / symbolsToAdjust.length;

      symbolsToAdjust.forEach((s) => {
        newAllocations[s] = Math.max(
          0,
          Number(newAllocations[s]) - adjustment
        ).toString();
      });
    }

    setValue('tokens', newAllocations);
  };

  return (
    <div className="space-y-4 text-left w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {order.map((token) => (
          <TokenItem
            key={token.contractAddress}
            order={token}
            address={address as Address}
            allocation={Number(watch(`tokens.${token.symbol}`) || 0)}
            onAllocationChange={(value) =>
              handleAllocationChange(token.symbol, value)
            }
            ethAmount={inputAmount}
          />
        ))}
      </div>
    </div>
  );
}
