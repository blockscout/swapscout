import SafeAppsSDK, { Methods, SafeInfo } from '@safe-global/safe-apps-sdk';
import { SafeAppProvider as SafeAppProviderBase } from '@safe-global/safe-apps-provider';
import { MessageFormatter, InterfaceMessageEvent } from '@safe-global/safe-apps-sdk';
import { hexToNumber, numberToHex } from 'viem';

// eslint-disable-next-line
type Callback = (response: any) => void;

export default class SafeAppProvider extends SafeAppProviderBase {
  private callbacks = new Map<string, Callback>();
  private sdk_: SafeAppsSDK;

  constructor(safe: SafeInfo, sdk: SafeAppsSDK) {
    super(safe, sdk);
    this.sdk_ = sdk;
    window.addEventListener('message', this.handleIncomingMessage);
  }

  private handleIncomingMessage = (msg: InterfaceMessageEvent): void => {
    const { id } = msg.data;

    const cb = this.callbacks.get(id);

    if (cb) {
      cb(msg.data);

      this.callbacks.delete(id);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async request(request: { method: string; params?: any[] }): Promise<any> {
    const { method, params = [] } = request;

    switch (method) {
      case 'wallet_switchEthereumChain': {
        const request = MessageFormatter.makeRequest('wallet_switchEthereumChain' as Methods, params[0]);

        if (typeof window === 'undefined') {
          throw new Error("Window doesn't exist");
        }

        window.parent.postMessage(request, '*');

        return new Promise((resolve, reject) => {
          this.callbacks.set(request.id, (response) => {
            if (!response.success) {
              reject(new Error(response.error));
              return;
            }
            this.emit('chainChanged', response.data.id);
            resolve(response);
          });
        });
      }

      case 'eth_getTransactionByHash': {
        let txHash = params[0];
        return this.sdk_.eth.getTransactionByHash([txHash]).then((tx) => {
          // We set the tx hash to the one requested, as some provider assert this
          if (tx) {
            tx.hash = txHash;
          }
          return tx;
        });
      }

      case 'eth_getTransactionReceipt': {
        let txHash = params[0];
        return this.sdk_.eth.getTransactionReceipt([txHash]).then((tx) => {
          // We set the tx hash to the one requested, as some provider assert this
          if (tx) {
            tx.transactionHash = txHash;
          }
          return tx;
        });
      }

      // When the user retries the transaction, the LiFi widget sends the incorrect chainId (the original one),
      // even though the chainId has been updated in the provider.
      //
      // TODO: investigate further why this is happening.
      case 'wallet_sendCalls': {
        console.log('WALLET_SENDCALLS', params);
        return super.request(request);
      }

      default:
        return super.request(request);
    }
  }
}
