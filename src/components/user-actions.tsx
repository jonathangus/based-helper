import { Action } from '@/types';
import { BuyTokenFlow } from './buy-flow/buy-token-flow';
// const actions = {
//   ['buy_token']: ButTokenFlow,
// };

export function UserActions({ action }: { action: Action }) {
  return <BuyTokenFlow action={action} />;
}
