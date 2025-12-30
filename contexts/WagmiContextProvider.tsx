'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { WagmiProvider } from 'wagmi';
import wagmiConfig from '@/config/wagmi';

const queryClient = new QueryClient();

function ContextProvider({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
