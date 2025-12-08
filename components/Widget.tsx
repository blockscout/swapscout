'use client';

import { useEffect, useMemo, useState } from 'react';
import type { WidgetConfig } from '@lifi/widget';
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget';

import { ClientOnly } from './ClientOnly';

export function Widget() {
  const [ configData, setConfigData ] = useState<any>(null);

  useEffect(() => {
    const sendHeight = () => {
      window.parent.postMessage(
        { type: 'window-height', height: document.body.scrollHeight },
        '*',
      );
    };
    sendHeight();

    const resizeObserver = new ResizeObserver(sendHeight);
    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'config') {
        setConfigData(event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const config = useMemo(
    () =>
      ({
        fee: configData?.fee,
        variant: 'compact',
        subvariant: 'default',
        theme: {
          typography: { fontFamily: configData?.fontFamily },
          palette: {
            primary: { main: configData?.mainColor },
            secondary: { main: configData?.mainColor },
          },
          shape: {
            borderRadius: 12,
            borderRadiusSecondary: 8,
          },
          container: {
            border: `1px solid ${configData?.borderColor}`,
            borderRadius: 12,
          },
        },
        hiddenUI: [ 'appearance' ],
        fromChain: configData?.defaultChainId,
        fromToken: '0x0000000000000000000000000000000000000000',
        explorerUrls: configData?.explorerUrls,
        chains: {
          allow: configData?.chains,
        },
        walletConfig: {
          onConnect: () => {},
        },
      } as Partial<WidgetConfig>),
    [configData]
  );

  if (!configData) return null;

  return (
    <ClientOnly fallback={<WidgetSkeleton config={config} />}>
      <LiFiWidget config={config} integrator={configData?.integrator || 'blockscout'} />
    </ClientOnly>
  );
}
