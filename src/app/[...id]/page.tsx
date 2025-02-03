import ActionView from '@/components/action-view';
import { ConnectButton } from '@/components/connect-button';
import { Action } from '@/types';
// import { useAccount } from 'wagmi';
// import { startPoolListener } from '@/pool-listener';
// import { useEffect } from 'react';
import { kv } from '@vercel/kv';

export default async function Home({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const id = param.id[0];

  const data = (await kv.get(id)) as string;

  const action = JSON.parse(
    data.replace('```', '').replace('json', '').replace('```', '')
  ) as Action;

  return (
    <>
      <ConnectButton />
      <ActionView action={action} />
    </>
  );
}
