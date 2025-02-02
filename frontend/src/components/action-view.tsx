import { Action } from '@/types';
import { UserActions } from './user-actions';

type Props = {
  action: Action;
};

export default function ActionView({ action }: Props) {
  return (
    <div className="  ">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <div className={`inline-block p-2 `}>{action.message}</div>
        </div>

        <div>
          <UserActions action={action} />
        </div>
      </div>
    </div>
  );
}
