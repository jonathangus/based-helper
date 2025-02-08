'use client';
import React from 'react';
import { TokenExecutor } from '@/types';
import { TransactionCard } from '../transcation-card';
import { useQuery } from '@tanstack/react-query';
interface ExecuteFlowViewProps {
  address: string;
}

const fetchExecutorData = async (address: string): Promise<TokenExecutor> => {
  const response = await fetch(`/api/executor/${address}`);
  if (!response.ok) {
    throw new Error('Failed to fetch executor data');
  }
  return response.json();
};

export const ExecuteFlowView: React.FC<ExecuteFlowViewProps> = ({
  address,
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['executor', address],
    queryFn: () => fetchExecutorData(address),
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  console.log('DATA:::', data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading executor data</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Executor Data</h1>
      <div className="rounded-lg p-4 mb-6">
        <p className="mb-2">
          <span className="font-medium">Order ID:</span> {data.orderId}
        </p>
        <p className="mb-2">
          <span className="font-medium">Address:</span> {data.address}
        </p>
        <p>
          <span className="font-medium">Deployment Status:</span>{' '}
          {data.isDeployed ? 'Deployed' : 'Not Deployed'}
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
      {data.txs && data.txs.length > 0 ? (
        data.txs.map((tx, index) =>
          Array.isArray(tx) && tx.length === 0 ? null : (
            <TransactionCard key={index} {...tx} />
          )
        )
      ) : (
        <p className="text-gray-600">No transactions available.</p>
      )}
    </div>
  );
};
