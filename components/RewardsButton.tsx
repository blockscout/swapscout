import { useAppKitAccount } from '@reown/appkit/react';
import MeritsIcon from '@/public/merits.svg';

import { useRewardsQuery } from '@/hooks/useRewardsQuery';
import { Button } from './common/Button';

export function RewardsButton() {
  const { address } = useAppKitAccount();
  const rewardsQuery = useRewardsQuery(address);

  const dataExist = Boolean(rewardsQuery.data?.exists);

  return (
    <Button dataExist={ dataExist } href={ process.env.NEXT_PUBLIC_REWARDS_BUTTON_LINK }>
      <div className="flex items-center gap-1">
        <MeritsIcon width={18} height={18} />
        { dataExist ? rewardsQuery.data?.user?.total_balance : 'Merits' }
      </div>
    </Button>
  )
}
