'use client';

import type { WidgetConfig } from '@lifi/widget';
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget';

import { useWalletContext } from '@/components/WalletProvider';
import { ClientOnly } from './ClientOnly';

const explorerUrls = {
  1: ['https://eth.blockscout.com/'],
  10: ['https://optimism.blockscout.com/'],
  30: ['https://rootstock.blockscout.com/'],
  100: ['https://gnosis.blockscout.com/'],
  122: ['https://explorer.fuse.io/'],
  137: ['https://polygon.blockscout.com/'],
  324: ['https://zksync.blockscout.com/'],
  1088: ['https://andromeda-explorer.metis.io/'],
  1101: ['https://zkevm.blockscout.com/'],
  5000: ['https://explorer.mantle.xyz/'],
  8453: ['https://base.blockscout.com/'],
  13371: ['https://explorer.immutable.com/'],
  34443: ['https://explorer.mode.network/'],
  42161: ['https://arbitrum.blockscout.com/'],
  42220: ['https://explorer.celo.org/mainnet/'],
  81457: ['https://blast.blockscout.com/'],
  1313161554: ['https://explorer.mainnet.aurora.dev/'],
};

export function Widget() {
  const { chainId } = useWalletContext();

  const config = {
    fee: 0.00075, // 0.075%
    variant: 'compact',
    subvariant: 'default',
    appearance: 'light',
    theme: {
      palette: {
        primary: { main: '#2B6CB0' },
        secondary: { main: '#2B6CB0' },
      },
      typography: { fontFamily: 'Inter, sans-serif' },
      container: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
      },
      shape: {
        borderRadius: 24,
        borderRadiusSecondary: 8,
      },
    },
    fromChain: chainId || 1,
    fromToken: '0x0000000000000000000000000000000000000000',
    explorerUrls,
    chains: {
      allow: Object.keys(explorerUrls).map(Number),
    }
  } as Partial<WidgetConfig>;

  return (
    <ClientOnly fallback={<WidgetSkeleton config={config} />}>
      <LiFiWidget config={config} integrator="blockscout" />
    </ClientOnly>
  );
}
