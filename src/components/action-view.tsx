'use client';
import { Action } from '@/types';
import { UserActions } from './user-actions'; 

type Props = {
  action: Action;
};

export default function ActionView({ action }: Props) {
  return (
    <div className=" max-w-6xl mx-auto rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto  ">
        <div className="space-y-4">
          <h2 className="text-xl   mb-8">{action.summary}</h2>

          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1   text-sm font-medium
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
              {new Date(action.date).toLocaleDateString() +
                ' ' +
                new Date(action.date).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
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
