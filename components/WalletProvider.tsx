import { useSyncWagmiConfig } from '@lifi/wallet-management';
import { useAvailableChains } from '@lifi/widget';
import { safe } from 'wagmi/connectors';
import { useRef, useEffect, createContext, useContext, useState, type FC, type PropsWithChildren } from 'react';
import { createClient, http } from 'viem';
import { mainnet } from 'wagmi/chains';
import type { Config } from 'wagmi';
import { createConfig, WagmiProvider, useConnect, useChainId } from 'wagmi';

type WalletContextType = {
  chainId: number | null;
  setChainId: (chainId: number) => void;
};

const WalletContext = createContext<WalletContextType>({ chainId: null, setChainId: () => {} });

const AutoConnectWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { connect, connectors } = useConnect();
  const chainId = useChainId();
  const { setChainId } = useContext(WalletContext);

  useEffect(() => {
    const connectorInstance = connectors.find((c) => c.id === 'safe');
    if (connectorInstance) {
      connect({ connector: connectorInstance });
    }
  }, [connect, connectors]);

  useEffect(() => {
    if (chainId) {
      setChainId(chainId);
    }
  }, [chainId, setChainId]);

  return <>{children}</>;
};

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useAvailableChains();
  const wagmi = useRef<Config>();
  const isInIframe = typeof window !== 'undefined' && window.parent !== window;
  const [chainId, setChainId] = useState<number | null>(null);

  if (!wagmi.current) {
    wagmi.current = createConfig({
      chains: [mainnet],
      client({ chain }) {
        return createClient({ chain, transport: http() });
      },
      ssr: false,
    });
  }

  const connectors = [
    safe({
      allowedDomains: [/^.*$/], // Allow all domains
      debug: false,
    }),
  ];

  useSyncWagmiConfig(wagmi.current, connectors, chains);

  if (!isInIframe) {
    return <>{children}</>;
  }

  return (
    <WalletContext.Provider value={{ chainId, setChainId }}>
      <WagmiProvider config={wagmi.current} reconnectOnMount={false}>
        <AutoConnectWrapper>{children}</AutoConnectWrapper>
      </WagmiProvider>
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);
