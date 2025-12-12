import type { SafeAppProvider as SafeAppProviderType } from '@safe-global/safe-apps-provider';
import SafeAppsSDK from '@safe-global/safe-apps-sdk';
import {
  type Connector,
  createConnector,
  ProviderNotFoundError,
  ChainNotConfiguredError,
} from '@wagmi/core';
import { getAddress, SwitchChainError, withTimeout, numberToHex } from 'viem';
import type { SafeParameters } from 'wagmi/connectors';

import SafeAppProvider from './provider';

safe.type = 'safe' as const;

export function safe(parameters: SafeParameters = {}) {
  const { shimDisconnect = false } = parameters;

  type Provider = SafeAppProviderType | undefined;
  type Properties = Record<string, unknown>;
  type StorageItem = { 'safe.disconnected': true };

  let disconnect: Connector['onDisconnect'] | undefined;

  return createConnector<Provider, Properties, StorageItem>((config) => ({
    id: 'safe',
    name: 'Safe',
    type: safe.type,

    async connect({ withCapabilities } = {}) {
      const provider = await this.getProvider();
      if (!provider) throw new ProviderNotFoundError();

      const accounts = await this.getAccounts();
      const chainId = await this.getChainId();

      if (!disconnect) {
        disconnect = this.onDisconnect.bind(this);
        provider.on('disconnect', disconnect);
      }

      // Remove disconnected shim if it exists
      if (shimDisconnect) await config.storage?.removeItem('safe.disconnected');

      return {
        // TODO(v3): Make `withCapabilities: true` default behavior
        accounts: (withCapabilities
          ? accounts.map((address) => ({ address, capabilities: {} }))
          : accounts) as never,
        chainId,
      };
    },

    async disconnect() {
      const provider = await this.getProvider();
      if (!provider) throw new ProviderNotFoundError();

      // Manage EIP-1193 event listeners
      if (disconnect) {
        provider.removeListener('disconnect', disconnect);
        disconnect = undefined;
      }

      // Add shim signalling connector is disconnected
      if (shimDisconnect)
        await config.storage?.setItem('safe.disconnected', true);
    },

    async getAccounts() {
      const provider = await this.getProvider();
      if (!provider) throw new ProviderNotFoundError();
      return (await provider.request({ method: 'eth_accounts' })).map(
        getAddress,
      );
    },

    async getProvider() {
      // Only allowed in iframe context
      const isIframe = typeof window !== 'undefined' && window?.parent !== window;
      if (!isIframe) return;

      const sdk = new SafeAppsSDK(parameters);

      // `getInfo` hangs when not used in Safe App iFrame
      // https://github.com/safe-global/safe-apps-sdk/issues/263#issuecomment-1029835840
      const safe = await withTimeout(() => sdk.safe.getInfo(), {
        timeout: parameters.unstable_getInfoTimeout ?? 5000,
      });
      if (!safe) throw new Error('Could not load Safe information');

      return new SafeAppProvider(safe, sdk);
    },

    async getChainId() {
      const provider = await this.getProvider();
      if (!provider) throw new ProviderNotFoundError();
      return Number(provider.chainId);
    },

    async isAuthorized() {
      try {
        const isDisconnected =
          shimDisconnect &&
          // If shim exists in storage, connector is disconnected
          (await config.storage?.getItem('safe.disconnected'));
        if (isDisconnected) return false;

        const accounts = await this.getAccounts();
        return !!accounts.length;
      } catch {
        return false;
      }
    },

    async switchChain({ chainId }) {
      const provider = await this.getProvider();
      if (!provider) throw new ProviderNotFoundError();

      const chain = config.chains.find((x) => x.id === chainId);
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: numberToHex(chainId) }],
      });

      config.emitter.emit('change', { chainId });

      return chain;
    },

    onAccountsChanged() {
      // Not relevant for Safe because changing account requires app reload.
    },

    onChainChanged() {
      // The event is emitted in the switchChain function
    },

    onDisconnect() {
      config.emitter.emit('disconnect');
    },
  }));
}
