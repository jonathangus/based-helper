import ActionView from '@/components/action-view';
import { ConnectButton } from '@/components/connect-button';
import { Action } from '@/types';
// import { useAccount } from 'wagmi';
// import { startPoolListener } from '@/pool-listener';
// import { useEffect } from 'react';
import { kv } from '@vercel/kv';

export default async function Home() {
  const getExample = await kv.get('3f4d92ec-ccc5-4d77-bb73-cf1f720dc544');

  console.log(getExample);
  const action = {
    message: `The purchase plan involves buying three high-risk tokens: Bsop, SuperchainERC20, and KOANS. Each token is allocated approximately one-third of the total amount. These tokens were selected based on their high heat ratios, indicating a higher risk and potential for greater returns.`,
    order: [
      {
        contractAddress: '0x88fbb146bb61be687301eda2a5d3326be3227a60',
        percentage: '0.5',
        name: 'Nobi Official',
        symbol: 'NOBI',
        decimals: 18,
      },
      {
        contractAddress: '0x9704d2adbc02c085ff526a37ac64872027ac8a50',
        percentage: '0.5',
        name: 'Bsop',
        symbol: 'Bsop',
        decimals: 18,
      },
    ],
  } as Action;

  return (
    <>
      {getExample && JSON.stringify(getExample)}
      <ConnectButton />
      {/* {address && <ActionView action={action} />} */}
    </>
  );
}
