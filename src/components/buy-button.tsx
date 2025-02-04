'use client';
import { useCallback, useMemo } from 'react';
import { Avatar, Name } from '@coinbase/onchainkit/identity';
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { useSwapParams } from '@/hooks/use-swap-params';
import { Address, parseEther } from 'viem';
import { base } from 'viem/chains';
import {
  useCapabilities,
  useSendCalls,
  useWriteContracts,
} from 'wagmi/experimental';

const clickContractAddress = '0x67c97D1FB8184F038592b2109F854dfb09C77C75';

const clickContractAbi: readonly [
  {
    readonly type: 'function';
    readonly name: 'click';
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  }
] = [
  {
    type: 'function',
    name: 'click',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

export const calls = [
  {
    address: clickContractAddress,
    abi: clickContractAbi,
    functionName: 'click',
    args: [],
  },
];

export default function BuyComponents() {
  const { address } = useAccount();

  const { data: swapParams } = useSwapParams({
    srcToken: 'ETH',
    destToken: '0xf857b2764095b9a5f57c3e71f82f297fe4e45334',
    destDecimals: 18,
    userAddress: address as Address,
    amount: parseEther('0.00001'),
  });

  const { data: swapParamsTwo } = useSwapParams({
    srcToken: 'ETH',
    destToken: '0x333333c465a19c85f85c6cfbed7b16b0b26e3333',
    destDecimals: 18,
    userAddress: address as Address,
    amount: parseEther('0.00001'),
  });

  const { data: availableCapabilities } = useCapabilities();

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

  const { data: id, sendCalls } = useSendCalls({});

  const tx = useWaitForTransactionReceipt({
    hash: id as `0x${string}`,
  });

  console.log(capabilities);

  return (
    <>
      {JSON.stringify(swapParams)}
      ---
      {JSON.stringify(swapParamsTwo)}
      <button
        onClick={() => {
          sendCalls({
            calls: [
              {
                gasPrice: swapParams?.txParams.gasPrice,
                to: swapParams?.txParams.to as Address,
                data: swapParams?.txParams.data as `0x${string}`,
                value: BigInt(swapParams?.txParams?.value || 0),
              },
              {
                gasPrice: swapParams?.txParams.gasPrice,
                to: swapParamsTwo?.txParams.to as Address,
                data: swapParamsTwo?.txParams.data as `0x${string}`,
                value: BigInt(swapParamsTwo?.txParams?.value || 0),
              },
            ],
            capabilities,
          });
        }}
      >
        semd
      </button>
    </>
  );
}
