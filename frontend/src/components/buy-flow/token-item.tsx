import { Decimal } from 'decimal.js';
import { Slider } from '@/components/ui/slider';
import { useSwapParams } from '@/hooks/use-swap-params';
import { type Address, formatUnits, parseEther } from 'viem';
import type { Order } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useCapabilities } from 'wagmi/experimental';

interface Props {
  order: Order;
  address: Address;
  allocation: number;
  onAllocationChange: (value: number) => void;
  ethAmount: string;
}

export function TokenItem({
  order,
  allocation,
  onAllocationChange,
  ethAmount,
  address,
}: Props) {
  const ethAmountNumber = new Decimal(ethAmount).mul(allocation).div(100);
  const params = useSwapParams({
    srcToken: 'ETH',
    destToken: order.contractAddress,
    destDecimals: Number(order.decimals),
    userAddress: address,
    amount: ethAmountNumber.gt('0')
      ? parseEther(ethAmountNumber.toFixed())
      : 0n,
    enabled: ethAmountNumber.gt('0'),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">
          {order.name} ({order.symbol})
        </h3>
        <span className="text-sm text-gray-400">
          Decimals: {order.decimals}
        </span>
      </div>
      <p className="text-xs text-gray-400 truncate">
        Contract:{' '}
        <a
          href={`https://basecscan.io/address/${order.contractAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {order.contractAddress}
        </a>
      </p>
      <div className="flex items-center space-x-2">
        <Slider
          value={[allocation]}
          onValueChange={(values) => onAllocationChange(values[0])}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="min-w-[40px] text-right">
          {allocation.toFixed(1)}%
        </span>
      </div>
      {params.error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {params.error.message ||
              'An error occurred while fetching swap data.'}
          </AlertDescription>
        </Alert>
      ) : (
        params.data?.priceRoute.destAmount && (
          <div className="space-y-1 text-gray-300 text-sm">
            <div>
              Sell {ethAmountNumber.toString()} ETH for{' '}
              {new Decimal(
                formatUnits(
                  BigInt(params.data.priceRoute.destAmount),
                  order.decimals
                )
              )
                .toDecimalPlaces(2)
                .toString()}{' '}
              {order.symbol}
            </div>
          </div>
        )
      )}
    </div>
  );
}
