import ActionView from '@/components/action-view';
import { Action } from '@/types';
import { kv } from '@vercel/kv';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id[0];
  const data = (await kv.get(id)) as string;
  const action: Action =
    typeof data === 'string'
      ? (JSON.parse(
          data.replace('```', '').replace('json', '').replace('```', '')
        ) as Action)
      : data;

  console.log(data);

  const title = `${action.order
    .map((o) => '$' + o.symbol)
    .join(', ')} is suggested by based_helper`;
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
  const action =
    typeof data === 'string'
      ? (JSON.parse(
          data.replace('```', '').replace('json', '').replace('```', '')
        ) as Action)
      : data;

  console.log(action);
  return (
    <>
      <ActionView action={action} />
    </>
  );
}
