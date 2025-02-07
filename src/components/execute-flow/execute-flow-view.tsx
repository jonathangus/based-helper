import React from 'react';
import { TokenExecutor } from '@/types';
import { TransactionCard } from '../transcation-card';

interface ExecuteFlowViewProps {
  data: TokenExecutor;
}

export const ExecuteFlowView: React.FC<ExecuteFlowViewProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Executor Data</h1>
      <div className="  rounded-lg p-4 mb-6">
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
