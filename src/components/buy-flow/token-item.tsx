import { Decimal } from 'decimal.js';
import { Slider } from '@/components/ui/slider';
import { useSwapParams } from '@/hooks/use-swap-params';
import { type Address, formatUnits, parseEther } from 'viem';
import type { Order } from '@/types';
import { AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../ui/accordion';

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
  }); // Using default slippage of 2.5% (250 basis points) from useSwapParams

  return (
    <div className=" ">
      <Card className="rounded-none border-none p-4 ">
        <CardHeader className="p-0">
          <div className="flex items-center space-x-4">
            {order.info?.imageUrl && (
              <img
                src={order.info.imageUrl}
                alt={order.name}
                className="w-10 h-10"
              />
            )}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-m font-regular">
                  {order.name} ({order.symbol})
                </h3>
                <span className="text-xs text-secondary">
                  Suggested target:{' '}
                  {(Number(order.percentage) * 100).toFixed(0)}%
                </span>
              </div>
              {order.summary && (
                <p className="text-secondary text-sm mt-1">{order.summary}</p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex items-center space-x-2 mt-2">
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

          <div className="flex flex-wrap gap-2 mt-4">
            {order.info?.websites?.map((website, index) => (
              <a
                key={index}
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 text-gray-300"
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
                className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 text-gray-300"
              >
                {social.type}
              </a>
            ))}
          </div>

          {order.explanation && order.keyMetrics && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="metrics" className="border-white/20">
                <AccordionTrigger className="text-xs">
                  View Details
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {params.data?.priceRoute.destAmount && (
                      <div className=" bg-gray-800/50 p-2 rounded text-xs w-full">
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
                    )}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                      <div className="col-span-2 bg-gray-800/50 p-2 rounded">
                        Smart Money Momentum:{' '}
                        {order.keyMetrics.smartMoneyMomentum}
                      </div>
                      <div className="bg-gray-800/50 p-2 rounded">
                        {order.explanation.goodTrader}
                      </div>
                      <div className="bg-gray-800/50 p-2 rounded">
                        {order.explanation.heat}
                      </div>
                      <div className="bg-gray-800/50 p-2 rounded">
                        {order.explanation.netBuys}
                      </div>
                      <div className="bg-gray-800/50 p-2 rounded">
                        {order.explanation.tvl}
                      </div>
                      <div className="bg-gray-800/50 p-2 rounded">
                        {order.explanation.volume}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </CardContent>

        <CardFooter className="p-0">
          {params.error && (
            <div className="text-red-400 text-sm bg-red-950/50 p-2 rounded-lg w-full flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {params.error.message || 'Failed to fetch swap data'}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
