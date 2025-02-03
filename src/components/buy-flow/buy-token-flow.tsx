import { BuyTokenAction } from '@/types';
import { useForm, FormProvider } from 'react-hook-form';
import SourceInput from './source-input';
import { TokenList } from './token-list';
import { PurchaseTokens } from './purchase-tokens';
import { useAccount } from 'wagmi';
import { TerminalContent, TerminalItem } from '../terminal';
import { TerminalTitle } from '../terminal';

type Props = {
  action: BuyTokenAction;
};

type FormValues = {
  inputAmount: string;
  tokens: Record<string, string>;
};

export function BuyTokenFlow({ action }: Props) {
  const { order } = action;
  const { address } = useAccount();
  const methods = useForm<FormValues>({
    defaultValues: {
      inputAmount: action?.amount || '0.00001',
      tokens: Object.fromEntries(
        order.map((token) => [
          token.symbol,
          (Number(token.percentage) * 100).toString(),
        ])
      ),
    },
  });

  return (
    <FormProvider {...methods}>
      <div>
        <TerminalItem trail={false}>
          <TerminalTitle>How much ETH would you like to spend?</TerminalTitle>
          <TerminalContent ><SourceInput /></TerminalContent>
        </TerminalItem>
 
        <TerminalItem>
          <TerminalTitle>Suggested token allocations:</TerminalTitle>
            <div className="h-2"></div>
          <TerminalContent border={false}><TokenList order={order} /></TerminalContent>
        </TerminalItem>

        {address ? <TerminalItem trail={false}>
           <TerminalTitle showCursor>Execute trade:</TerminalTitle>
         <TerminalContent border={false}>
          <div className="my-2">
             <PurchaseTokens order={order} />
          </div>
          </TerminalContent>
          </TerminalItem> : null}
      </div>
    </FormProvider>
  );
}
