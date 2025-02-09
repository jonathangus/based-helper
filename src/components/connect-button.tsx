'use client';
import React from 'react';
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ConnectButton({ linkPage = false }: { linkPage?: boolean }) {
  return (
    <div className="max-w-6xl  ">
      <RainbowConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button onClick={openConnectModal} variant="default">
                      Connect Wallet
                    </Button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <Button onClick={openChainModal} variant="destructive">
                      Wrong network
                    </Button>
                  );
                }

                return (
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={openChainModal}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {chain.hasIcon && (
                        <div
                          className="w-3 h-3 rounded-full overflow-hidden"
                          style={{ background: chain.iconBackground }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              className="w-3 h-3"
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </Button>
                    <Button onClick={openAccountModal} variant="secondary">
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </Button>

                    {linkPage && (
                      <Link
                        href={`/portfolio/${account.address}`}
                        className="text-secondary"
                      >
                        portfolio
                      </Link>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        }}
      </RainbowConnectButton.Custom>
    </div>
  );
}
