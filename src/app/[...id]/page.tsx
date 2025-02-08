import ActionView from '@/components/action-view';
import { Action, TokenExecutor } from '@/types';
import { kv } from '@vercel/kv';
import { Metadata } from 'next';
import { getAddress } from 'viem';
import { ExecuteFlowView } from '@/components/execute-flow/execute-flow-view';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id[0];
  const data = (await kv.get(id)) as string;

  if (!data) {
    try {
      const otherData = (await kv.get(
        `${getAddress(id)}-executor`
      )) as TokenExecutor;

      if (otherData) {
        return {
          title: `Executor details for 0x3c635555B31003d3e2b4E3F750dcd95C9f7622af`,
        };
      }
    } catch (e) {
      console.error('Error fetching executor data:', e);
    }

    return {
      title: 'No data',
      description: 'No data',
      openGraph: {
        title: 'No data',
        description: 'No data',
      },
    };
  }
  const action: Action =
    typeof data === 'string'
      ? (JSON.parse(
          data.replace('```', '').replace('json', '').replace('```', '')
        ) as Action)
      : data;

  console.log(data);

  const title = `${
    action.order
      ? action.order.map((o) => '$' + o.symbol).join(', ')
      : 'No orders'
  } is suggested by based_helper`;
  return {
    title: title,
    description: action.summary,
    openGraph: {
      title: title,
      description: action.summary,
      images: [
        {
          url: `/api/og/${resolvedParams.id[0]}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ id: string[] }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id[0];
  const data = (await kv.get(id)) as string;

  if (data) {
    const action =
      typeof data === 'string'
        ? (JSON.parse(
            data.replace('```', '').replace('json', '').replace('```', '')
          ) as Action)
        : data;

    return (
      <>
        <ActionView action={action} />
      </>
    );
  }

  try {
    const otherData = await kv.get(`${getAddress(id)}-executor`);

    if (otherData) {
      return <ExecuteFlowView address={id} />;
    }
  } catch (e) {
    console.error('Error fetching executor data:', e);
  }

  return <div>No data</div>;
}
