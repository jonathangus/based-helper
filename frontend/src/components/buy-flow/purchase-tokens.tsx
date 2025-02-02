import { useFormContext } from 'react-hook-form';
import { Button } from '../ui/button';
import { Address, parseEther } from 'viem';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Order } from '@/types';
import { Decimal } from 'decimal.js';
import { Spinner } from '../spinner';
import { useMutation } from '@tanstack/react-query';
import { fetchSwapParams } from '@/hooks/use-swap-params';
import { useCapabilities, useSendCalls } from 'wagmi/experimental';
import { base } from 'viem/chains';

type Props = {
  order: Order[];
};

export function PurchaseTokens({ order }: Props) {
  const { watch } = useFormContext();
  const { address } = useAccount();
  const inputAmount = watch('inputAmount');
  const tokens = watch('tokens');

  const swapParamsMutation = useMutation({
    mutationFn: async () => {
      const swapPromises = order.map(async (token) => {
        const allocation = Number(tokens[token.symbol] || 0);
        const ethAmountNumber = new Decimal(inputAmount)
          .mul(allocation)
          .div(100);

        const enabled = ethAmountNumber.gt('0');
        if (!enabled) {
          return false;
        }
        const amount = parseEther(ethAmountNumber.toFixed());

        const result = await fetchSwapParams({
          srcToken: 'ETH',
          destToken: token.contractAddress,
          destDecimals: Number(token.decimals),
          userAddress: address as Address,
          amount,
        });

        return [token.contractAddress, result];
      });

      const results = await Promise.all(swapPromises);
      return Object.fromEntries(results.filter((r) => r !== false));
    },
  });

  const totalAllocation = Object.values(tokens).reduce(
    (sum, val) => Number(sum) + Number(val),
    0
  );

  const { writeContract } = useWriteContract();

  const { data: availableCapabilities } = useCapabilities();
  const { data: hash, sendCalls, isPending } = useSendCalls({});

  const tx = useWaitForTransactionReceipt({
    hash: hash as `0x${string}`,
  });

  const purchaseTokens = async () => {
    const swapParams: Record<
      string,
      Awaited<ReturnType<typeof fetchSwapParams>>
    > = await swapParamsMutation.mutateAsync();
    const batchSupported = Boolean(
      availableCapabilities?.[base.id]?.atomicBatch?.supported
    );
    const calls = Object.entries(swapParams).map(([address, params]) => ({
      gasPrice: params.txParams.gasPrice,
      to: params.txParams.to as Address,
      data: params.txParams.data as `0x${string}`,
      value: BigInt(params.txParams?.value || 0),
    }));

    if (batchSupported) {
      sendCalls({
        calls,
      });
    } else {
      writeContract({
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        abi: [
          {
            inputs: [
              {
                components: [
                  {
                    name: 'target',
                    type: 'address',
                  },
                  {
                    name: 'allowFailure',
                    type: 'bool',
                  },
                  {
                    name: 'value',
                    type: 'uint256',
                  },
                  {
                    name: 'callData',
                    type: 'bytes',
                  },
                ],
                name: 'calls',
                type: 'tuple[]',
              },
            ],
            name: 'aggregate3Value',
            outputs: [
              {
                components: [
                  {
                    name: 'success',
                    type: 'bool',
                  },
                  {
                    name: 'returnData',
                    type: 'bytes',
                  },
                ],
                name: 'returnData',
                type: 'tuple[]',
              },
            ],
            stateMutability: 'payable',
            type: 'function',
          },
        ],
        functionName: 'aggregate3Value',
        args: [
          calls.map((call) => ({
            target: call.to,
            allowFailure: false,
            value: call.value,
            callData: call.data,
          })),
        ],
        value: calls.reduce((sum, call) => sum + call.value, BigInt(0)),
      });
    }
  };

  const isLoading = swapParamsMutation.isPending || isPending || tx.isFetching;

  return (
    <div className="w-full space-y-4">
      {tx.isSuccess && <div>Success!</div>}
      {hash && (
        <div className="flex items-center justify-center">
          <a
            href={`https://basescan.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            View transaction on Basescan
          </a>
        </div>
      )}
      <Button
        disabled={totalAllocation !== 100}
        className="w-full"
        onClick={purchaseTokens}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Spinner />
            <span>Loading swap data...</span>
          </div>
        ) : totalAllocation !== 100 ? (
          'Allocations must total 100%'
        ) : (
          'Purchase Tokens'
        )}
      </Button>
    </div>
  );
}
