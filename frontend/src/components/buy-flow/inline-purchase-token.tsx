import { SwapResponse } from '@/types';
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Button } from '../ui/button';
import { Spinner } from '../spinner';
import { useState } from 'react';
import { Address } from 'viem';

type Props = {
  txParams: SwapResponse['txParams'];
  onSuccess?: () => void;
};

export function InlinePurchaseToken({ txParams, onSuccess }: Props) {
  const { sendTransaction, data: hash, isPending } = useSendTransaction();
  const { isSuccess, isError, isLoading } = useWaitForTransactionReceipt({
    hash,
  });

  const handlePurchase = async () => {
    try {
      sendTransaction({
        to: txParams.to as Address,
        value: BigInt(txParams.value || 0),
        data: txParams.data as `0x${string}`,
      });
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  if (isPending || isLoading) {
    return <Spinner />;
  }

  if (isSuccess) {
    return (
      <div>
        Purchase successful!
        <div>
          <a
            href={`https://basescan.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            View on Basescan
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

      <Button onClick={handlePurchase} disabled={isPending} className="w-full">
        Purchase Token
      </Button>
    </div>
  );
}
