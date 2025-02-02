'use client';
import { Action } from '@/types';
import { UserActions } from './user-actions';
import { useAccount } from 'wagmi';

type Props = {
  action: Action;
};

export default function ActionView({ action }: Props) {
  const { address } = useAccount();
  if (!address) {
    return null;
  }
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-100">{action.summary}</h2>

          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium
              ${
                action.risk === 'LOW'
                  ? 'bg-green-500/20 text-green-400'
                  : action.risk === 'MID'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {action.risk} RISK
            </span>
            <span className="text-sm text-gray-400">
              {new Date(action.date).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div>
          <UserActions action={action} />
        </div>
      </div>
    </div>
  );
}
