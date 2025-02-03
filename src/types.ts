export type Order = {
  contractAddress: string;
  percentage: string;
  symbol: string;
  decimals: number;
  name: string;
  summary?: string;
  info?: {
    imageUrl?: string;
    websites?: Array<{
      label: string;
      url: string;
    }>;
    socials?: Array<{
      type: string;
      url: string;
    }>;
  };
};

export type BuyTokenAction = {
  summary: string;
  order: Order[];
  type: 'token_buy';
  amount: string | null;
  risk: 'LOW' | 'MID' | 'HIGH';
  date: string;
};

export type Action = BuyTokenAction;

export interface SwapResponse {
  priceRoute: {
    blockNumber: number;
    network: number;
    srcToken: string;
    srcDecimals: number;
    srcAmount: string;
    destToken: string;
    destDecimals: number;
    destAmount: string;
    bestRoute: Array<{
      percent: number;
      swaps: Array<{
        srcToken: string;
        srcDecimals: number;
        destToken: string;
        destDecimals: number;
        swapExchanges: Array<{
          exchange: string;
          srcAmount: string;
          destAmount: string;
          percent: number;
          poolAddresses: string[];
          data: {
            path: Array<{
              tokenIn: string;
              tokenOut: string;
              fee: string;
              currentFee: string;
            }>;
            gasUSD: string;
          };
        }>;
      }>;
    }>;
    gasCostUSD: string;
    gasCost: string;
    side: string;
    version: string;
    contractAddress: string;
    tokenTransferProxy: string;
    contractMethod: string;
    partnerFee: number;
    srcUSD: string;
    destUSD: string;
    partner: string;
    maxImpactReached: boolean;
    hmac: string;
  };
  txParams: {
    from: string;
    to: string;
    value: string;
    data: string;
    gasPrice: string;
    chainId: number;
  };
}

interface SwapExchange {
  exchange: string;
  srcAmount: string;
  destAmount: string;
  percent: number;
  poolAddresses: string[];
  data: {
    path: {
      tokenIn: string;
      tokenOut: string;
      fee: string;
      currentFee: string;
    }[];
    gasUSD: string;
  };
}
