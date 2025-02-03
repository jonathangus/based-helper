import { Action } from '@/types';
import { BuyTokenFlow } from './buy-flow/buy-token-flow';
import { TerminalItem, TerminalTitle, TerminalContent } from './terminal';
import { Terminal } from './terminal';
// const actions = {
//   ['buy_token']: ButTokenFlow,
// };

export function UserActions({ action }: { action: Action }) {


  
  return <BuyTokenFlow action={action} />;
}
