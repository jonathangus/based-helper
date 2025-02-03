'use client';

import { ConnectButton } from '@/components/connect-button';
import { useAccount } from 'wagmi';

export default function Home() {
  const { address } = useAccount();
  return (
    <>
      <ConnectButton />
    </>
  );
}
