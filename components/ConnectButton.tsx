import { useAppKit } from '@reown/appkit/react';
import { useCallback } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useAccount } from 'wagmi';

import { Button } from './common/Button';

export function ConnectButton() {
  const { open } = useAppKit();
  const { address, isConnecting, isReconnecting } = useAccount();

  const handleClick = useCallback(() => {
    open();
  }, [open]);

  return (
    <Button
      isLoading={ isConnecting || isReconnecting }
      loadingText="Connect"
      dataExist={ Boolean(address) }
      onClick={ handleClick }
    >
      { address ? (
        <div className="flex items-center gap-1.5">
          <Jazzicon diameter={ 16 } seed={ jsNumberForAddress(address) } />
          <span>
            { address.slice(0, 4) }...{ address.slice(-4) }
          </span>
        </div>
      ) : (
        'Connect'
      ) }
    </Button>
  );
}
