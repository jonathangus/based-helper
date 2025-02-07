import type React from 'react';

interface TransactionData {
  srcToken: string;
  destToken: string;
  destDecimals: number;
  receiver: string;
  userAddress: string;
  amount: string;
}

interface TransactionProps {
  hash: string;
  receiver: string;
  amount: string;
  data?: TransactionData[];
}

export const TransactionCard: React.FC<TransactionProps> = ({
  hash,
  receiver,
  amount,
  data,
}) => {
  return (
    <div className="  shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-semibold mb-2">Transaction Details</h2>
      <p className="mb-1">
        <span className="font-medium">Hash:</span> {hash}
      </p>
      <p className="mb-1">
        <span className="font-medium">Receiver:</span> {receiver}
      </p>
      <p className="mb-1">
        <span className="font-medium">Amount:</span> {amount}
      </p>

      {data &&
        data.map((txData, dataIndex) => (
          <div key={dataIndex} className="mt-4 border-t pt-2">
            <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
            <p className="mb-1">
              <span className="font-medium">Source Token:</span>{' '}
              {txData.srcToken}
            </p>
            <p className="mb-1">
              <span className="font-medium">Destination Token:</span>{' '}
              {txData.destToken}
            </p>
            <p className="mb-1">
              <span className="font-medium">Destination Decimals:</span>{' '}
              {txData.destDecimals}
            </p>
            <p className="mb-1">
              <span className="font-medium">Receiver:</span> {txData.receiver}
            </p>
            <p className="mb-1">
              <span className="font-medium">User Address:</span>{' '}
              {txData.userAddress}
            </p>
            <p className="mb-1">
              <span className="font-medium">Amount:</span> {txData.amount}
            </p>
          </div>
        ))}
    </div>
  );
};
