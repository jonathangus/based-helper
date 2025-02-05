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
    const newAllocations = { ...watch('tokens'), [symbol]: value.toFixed(2) };
    const total = Object.values(newAllocations).reduce(
      (sum, val) => Number(sum) + Number(val),
      0
    ) as number;

    if (total > 100) {
      const excess = total - 100;
      const symbolsToAdjust = Object.keys(newAllocations).filter(
        (s) => s !== symbol
      );

      if (symbolsToAdjust.length > 0) {
        // Distribute excess evenly
        const adjustment = excess / symbolsToAdjust.length;

        // First pass: apply main adjustment
        symbolsToAdjust.forEach((s) => {
          newAllocations[s] = Math.max(
            0,
            Number((Number(newAllocations[s]) - adjustment).toFixed(2))
          ).toString();
        });

        // Calculate any remaining difference due to rounding
        const newTotal = Object.values(newAllocations).reduce(
          (sum, val) => Number(sum) + Number(val),
          0
        ) as number;
        const remaining = Number((100 - newTotal).toFixed(2));

        // If there's still a small difference, adjust the first available token
        if (Math.abs(remaining) > 0.01) {
          for (const s of symbolsToAdjust) {
            const currentVal = Number(newAllocations[s]);
            if (currentVal + remaining >= 0) {
              newAllocations[s] = (currentVal + remaining).toFixed(2);
              break;
            }
          }
        }
      }
    }

    setValue('tokens', newAllocations);
  };

  return (
    <div className="space-y-4 text-left w-full mb-4">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
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
