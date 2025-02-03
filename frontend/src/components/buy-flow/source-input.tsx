import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Address, formatEther, parseEther } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { useFormContext } from 'react-hook-form';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

export default function SourceInput() {
  const { address } = useAccount();
  const { setValue, watch } = useFormContext();
  const [tempInput, setTempInput] = useState('');
  const balance = useBalance({
    address: address as Address,
  });
  const watchInputAmount = watch('inputAmount');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (tempInput) {
        setValue('inputAmount', tempInput);
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [tempInput, setValue]);

  useEffect(() => {
    setTempInput(watchInputAmount);
  }, []);

  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="eth-amount">ETH Amount</Label>
      <div className="relative">
        <Input
          id="eth-amount"
          type="text"
          placeholder="0.0"
          className="pr-16"
          value={tempInput}
          onChange={(e) => setTempInput(e.target.value)}
          onBlur={() => setValue('inputAmount', tempInput)}
        />
        {balance.data?.value && balance.data?.value > 0n && (
          <Button
            onClick={() => {
              const newValue = balance.data.value - parseEther('0.0001');
              const formattedValue = formatEther(newValue);
              setTempInput(formattedValue);
              setValue('inputAmount', formattedValue);
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs px-2"
            variant="secondary"
          >
            Max
          </Button>
        )}
      </div>
      {balance.data && (
        <p className="text-sm text-muted-foreground">
          Balance: {balance.data?.formatted} ETH
        </p>
      )}
    </div>
  );
}
