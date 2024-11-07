import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { useCallback } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import { Button } from './common/Button';

export function ConnectButton() {
  const { open } = useAppKit();
  const { address } = useAppKitAccount();

  const handleClick = useCallback(() => {
    open();
  }, [open]);

  return (
    <Button dataExist={ Boolean(address) } onClick={ handleClick }>
      { address ? (
        <div className="flex items-center gap-2">
          <Jazzicon diameter={ 20 } seed={ jsNumberForAddress(address) } />
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
