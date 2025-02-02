import { BuyTokenAction } from '@/types';
import { useForm, FormProvider } from 'react-hook-form';
import SourceInput from './source-input';
import { TokenList } from './token-list';
import { PurchaseTokens } from './purchase-tokens';

type Props = {
  action: BuyTokenAction;
};

type FormValues = {
  inputAmount: string;
  tokens: Record<string, string>;
};

export function BuyTokenFlow({ action }: Props) {
  const { order } = action;

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
        <SourceInput />
        <div className="h-16"></div>
        <TokenList order={order} />
        <div className="h-8"></div>
        <PurchaseTokens order={order} />
      </div>
    </FormProvider>
  );
}
