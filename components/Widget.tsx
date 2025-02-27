"use client";

import { useMemo } from "react";
import type { WidgetConfig } from "@lifi/widget";
import { LiFiWidget, WidgetSkeleton } from "@lifi/widget";
import { useAppKit, useAppKitNetwork } from "@reown/appkit/react";

import { explorerUrls, networks } from "@/networks";
import { ClientOnly } from "./ClientOnly";

export function Widget() {
  const { open } = useAppKit();
  const { chainId } = useAppKitNetwork();

  const config = useMemo(
    () =>
      ({
        fee: 0.004, // 0.4% instead of 0.075%
        variant: "compact",
        subvariant: "default",
        appearance: "light",
        theme: {
          palette: {
            primary: { main: "#2B6CB0" },
            secondary: { main: "#2B6CB0" },
          },
          typography: { fontFamily: "Inter, sans-serif" },
          container: {
            boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.08)",
            borderRadius: "16px",
          },
          shape: {
            borderRadius: 24,
            borderRadiusSecondary: 8,
          },
        },
        fromChain: chainId || 1,
        fromToken: "0x0000000000000000000000000000000000000000",
        explorerUrls,
        chains: {
          allow: networks.map((n) => n.id),
        },
        walletConfig: {
          onConnect: open,
        },
      } as Partial<WidgetConfig>),
    []
  );

  return (
    <ClientOnly fallback={<WidgetSkeleton config={config} />}>
      <LiFiWidget config={config} integrator="blockscout" />
    </ClientOnly>
  );
}
