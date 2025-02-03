import { Decimal } from 'decimal.js';
import { Slider } from '@/components/ui/slider';
import { useSwapParams } from '@/hooks/use-swap-params';
import { type Address, formatUnits, parseEther } from 'viem';
import type { Order } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
    enabled: ethAmountNumber.gt('0') && Boolean(address),
  });

  return (
    <div className="space-y-4 bg-gray-800/50   p-4">
      <div className="flex items-center space-x-4">
        {order.info?.imageUrl && (
          <img
            src={order.info.imageUrl}
            alt={order.name}
            className="w-10 h-10 "
          />
        )}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-100">
              {order.name} ({order.symbol})
            </h3>
            <span className="text-sm text-gray-400">
              Target: {(Number(order.percentage) * 100).toFixed(0)}%
            </span>
          </div>
          {order.summary && (
            <p className="text-sm text-gray-400 mt-1">{order.summary}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Slider
          value={[allocation]}
          onValueChange={(values) => onAllocationChange(values[0])}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="min-w-[40px] text-right text-gray-200">
          {allocation.toFixed(1)}%
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {order.info?.websites?.map((website, index) => (
          <a
            key={index}
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1  text-gray-300"
          >
            {website.label}
          </a>
        ))}
        {order.info?.socials?.map((social, index) => (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1  text-gray-300"
          >
            {social.type}
          </a>
        ))}
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
          <div className="text-gray-300 text-sm bg-gray-700/50 p-3 rounded-lg">
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
