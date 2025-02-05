import { Action } from '@/types';
import { BuyTokenFlow } from './buy-flow/buy-token-flow';

export function UserActions({ action }: { action: Action }) {
  return <BuyTokenFlow action={action} />;
}
