import { kv } from '@vercel/kv';
import { getAddress } from 'viem';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const executorData = await kv.get(`${getAddress(params.address)}-executor`);
    return NextResponse.json(executorData);
  } catch (error) {
    console.error('Error fetching executor data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch executor data' },
      { status: 500 }
    );
  }
}
