'use client';

import { useEffect, useRef } from 'react';
import type { RouteExecutionUpdate } from '@lifi/widget';
import { useWidgetEvents, WidgetEvent } from '@lifi/widget';

const apiUrl = `${process.env.NEXT_PUBLIC_REWARDS_SERVICE_API_HOST}/api/v1`;

async function getActiveChains() {
  const response = await fetch(`${apiUrl}/instances`);
  if (response.ok) {
    const { items } = (await response.json()) as { items: { chain_id: string }[] };
    return items.map((item) => item.chain_id);
  }
  return [];
}

async function checkActivityPass(address: string) {
  const response = await fetch(`${apiUrl}/activity/check-pass?address=${address}`);
  if (response.ok) {
    const { is_valid } = (await response.json()) as { is_valid: boolean };
    return is_valid;
  }
  return false;
}

async function registerActivity(chainId: string, from: string, to: string) {
  const [activeChains, hasPass] = await Promise.all([getActiveChains(), checkActivityPass(from)]);
  if (!activeChains.includes(chainId) || !hasPass) {
    return;
  }
  const response = await fetch(`${apiUrl}/activity/track/transaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chain_id: chainId,
      from_address: from,
      to_address: to,
    }),
  });
  if (response.ok) {
    const { token } = (await response.json()) as { token: string };
    return token;
  }
}

function confirmActivity(token: string, txHash: string) {
  return fetch(`${apiUrl}/activity/track/transaction/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tx_hash: txHash,
      token,
    }),
  });
}

export const ActivityTracker = () => {
  const widgetEvents = useWidgetEvents();
  const token = useRef<string | undefined>();
  const routeId = useRef<string | undefined>();

  useEffect(() => {
    const onRouteExecutionUpdated = async (update: RouteExecutionUpdate) => {
      try {
        if (!token.current || routeId.current !== update.route.id) {
          const { chainId, from, to } = update.route.steps.at(-1)?.transactionRequest ?? {};
          if (chainId && from && to) {
            token.current = await registerActivity(String(chainId), from, to);
            routeId.current = update.route.id;
          }
        } else if (['SWAP', 'CROSS_CHAIN'].includes(update.process.type) && routeId.current === update.route.id) {
          const { txHash } = update.process;
          if (txHash) {
            await confirmActivity(token.current, txHash);
            token.current = undefined;
            routeId.current = undefined;
          }
        }
      } catch {}
    };

    widgetEvents.on(WidgetEvent.RouteExecutionUpdated, onRouteExecutionUpdated);

    return () => widgetEvents.all.clear();
  }, [widgetEvents]);

  return null;
}
