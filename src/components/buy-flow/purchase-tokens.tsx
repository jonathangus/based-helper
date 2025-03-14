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
import { fetchSwapParams } from '../../hooks/use-swap-params';
import {
  useCallsStatus,
  useCapabilities,
  useSendCalls,
} from 'wagmi/experimental';
import { useMemo } from 'react';
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

  const { writeContract, data: writeData } = useWriteContract();

  const { data: availableCapabilities } = useCapabilities();
  const { data: id, sendCalls, isPending } = useSendCalls({});

  const status = useCallsStatus({
    id: id as `0x${string}`,
  });
  const statusHash = status.data?.receipts?.find(
    (receipt) => receipt.transactionHash
  )?.transactionHash;

  const tx = useWaitForTransactionReceipt({
    hash: writeData || statusHash,
  });

  const capabilities = useMemo(() => {
    if (!availableCapabilities || !base.id) return {};
    const capabilitiesForChain = availableCapabilities[base.id];
    if (
      capabilitiesForChain['paymasterService'] &&
      capabilitiesForChain['paymasterService'].supported
    ) {
      return {
        paymasterService: {
          // url: `${document.location.origin}/api/paymaster`,
          url: process.env.NEXT_PUBLIC_PAYMASTER_SERVICE_URL,
        },
      };
    }
    return {};
  }, [availableCapabilities, base.id]);

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
        capabilities,
      });
    } else {
      writeContract({
        address: '0xcA11bde05977b3631167028862bE2a173976CA11', // Multicall3
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

  const isSuccess = tx.isSuccess || status.data?.status === 'CONFIRMED';
  const isLoading =
    swapParamsMutation.isPending ||
    isPending ||
    tx.isFetching ||
    status.data?.status === 'PENDING';
  const hash = writeData || statusHash;

  if (totalAllocation !== 100) {
    return <div className="text-secondary">Allocations must total 100%</div>;
  }
  if (isSuccess) {
    return (
      <div className="w-full space-y-4">
        <div className="text-center text-green-500">
          Transaction successful!
        </div>
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
      </div>
    );
  }
  return (
    <div className="w-full space-y-4">
      {isSuccess && <div>Success!</div>}
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

      {isLoading && (
        <div className="ml-4">
          <Spinner />
        </div>
      )}
      {!isSuccess && !isLoading && (
        <Button
          disabled={totalAllocation !== 100}
          className="w-full max-w-[200px]"
          onClick={purchaseTokens}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Spinner />
              <span>Loading ...</span>
            </div>
          ) : totalAllocation !== 100 ? (
            'Allocations must total 100%'
          ) : (
            'Purchase Tokens'
          )}
        </Button>
      )}
    </div>
  );
}
