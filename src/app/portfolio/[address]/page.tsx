import { setOnchainKitConfig } from '@coinbase/onchainkit';
import { getPortfolios } from '@coinbase/onchainkit/api';
import { notFound } from 'next/navigation';
import { getAddress } from 'viem';
import { base } from 'viem/chains';
import { TokenRow } from '@coinbase/onchainkit/token';
import { formatUnits } from 'viem';

export const revalidate = 2;

setOnchainKitConfig({
  apiKey: process.env.NEXT_PUBLIC_CDP_CLIENT_KEY,
  chain: base,
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;

  return {
    title: `Portfolio - ${address}`,
    description: `View on-chain portfolio for address ${address}`,
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;

  try {
    const formatted = getAddress(address);
    console.log(formatted);
    const response = await getPortfolios({
      addresses: ['0xBA78CD28F7132958235D278fF3C5DC5e6d34cc15'],
    });

    const portfolio = response.portfolios[0];

    return (
      <div className="p-4   mx-auto max-w-4xl">
        <h1 className="text-lg md:text-2xl   mb-4 truncate">
          Portfolio for <div>{address}</div>
        </h1>
        <div className="space-y-2 tokens">
          {portfolio.tokenBalances.map((token) => (
            <div
              className="flex align-center"
              key={token.address || token.symbol}
            >
              <TokenRow
                className="cursor-auto flex-1 pointer-events-none"
                token={{
                  address: token.address,
                  chainId: token.chainId,
                  decimals: token.decimals,
                  name: token.name,
                  symbol: token.symbol,
                  image: token.image,
                }}
                amount={`${formatUnits(token.cryptoBalance, token.decimals)}`}
              />
              <div className="flex items-center justify-center text-xs text-secondary">
                ($
                {new Intl.NumberFormat('en-US').format(
                  Number(token.fiatBalance).toFixed(2)
                )}
                )
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-lg">
            Total Portfolio Value: $
            {Number(portfolio.portfolioBalanceInUsd).toFixed(2)}
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return notFound();
  }
}
