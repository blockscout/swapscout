'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import type { WidgetConfig } from '@lifi/widget';
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget';

import { ClientOnly } from './ClientOnly';

declare global {
  interface Window {
    __WIDGET_CONFIG?: any;
  }
}

export function Widget() {
  const [ configData, setConfigData ] = useState<any>(() =>
    typeof window !== 'undefined' ? window.__WIDGET_CONFIG ?? null : null
  );

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
    const applyConfig = (nextConfig: any) => {
      if (!nextConfig) return;
      window.__WIDGET_CONFIG = nextConfig;
      setConfigData(nextConfig);
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) return;
      if (event.data?.type === 'config') {
        applyConfig(event.data);
      }
    };

    if (window.__WIDGET_CONFIG) {
      applyConfig(window.__WIDGET_CONFIG);
    }

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const onWalletConnect = useCallback(() => {
    window.parent.postMessage({ type: 'connect-wallet' }, '*');
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
            height: 'fit-content',
            border: `1px solid ${configData?.borderColor}`,
            borderRadius: 12,
          },
        },
        hiddenUI: [ 'appearance', 'language', 'gasRefuelMessage' ],
        fromChain: configData?.defaultChainId,
        fromToken: '0x0000000000000000000000000000000000000000',
        explorerUrls: configData?.explorerUrls,
        chains: {
          allow: configData?.chains,
        },
        walletConfig: {
          onConnect: onWalletConnect,
        },
        sdkConfig: {
          executionOptions: {
            disableMessageSigning: true,
          },
        }
      } as WidgetConfig),
    [configData, onWalletConnect]
  );

  if (!configData) return null;

  console.log('WIDGET CONFIG', config);

  return (
    <ClientOnly fallback={<WidgetSkeleton config={config} />}>
      <LiFiWidget config={config} integrator={configData?.integrator || 'blockscout'} />
    </ClientOnly>
  );
}
