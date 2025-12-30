import { createConfig, http } from '@wagmi/core';
import { createClient } from 'viem';

import { safe } from '@/connector';
import chains from '@/chains';

const config = createConfig({
  chains,
  connectors: [
    safe({
      allowedDomains: [/^.*$/], // Allow all domains
      debug: false,
    })
  ],
  ssr: true,
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
});

export default config;
