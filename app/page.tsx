'use client';

import Link from 'next/link';
import Image from 'next/image';

import { Widget } from '@/components/Widget';
import { BannerText } from '@/components/BannerText';
import { BannerImage } from '@/components/BannerImage';
import { ConnectButton } from '@/components/ConnectButton';
import { RewardsButton } from '@/components/RewardsButton';
import { ActivityTracker } from '@/components/ActivityTracker';

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-10">
      <div className="flex flex-col z-10 items-center justify-between text-sm">
        <div className="w-full mb-6 flex justify-between sm:w-[416px]">
          <Image
            className="hidden sm:block"
            src="/logo-full.svg"
            alt="Swapscout Logo"
            width={172}
            height={30}
          />
          <Image
            className="block sm:hidden"
            src="/logo.svg"
            alt="Swapscout Logo"
            width={30}
            height={30}
          />
          <div className="flex gap-2">
            <RewardsButton />
            <ConnectButton />
          </div>
        </div>
        <BannerText text={process.env.NEXT_PUBLIC_BANNER_TEXT} />
        <div className="shadow-custom rounded-[16px] overflow-hidden sm:w-[416px]">
          <Widget/>
        </div>
        <div className="mt-8 flex justify-center space-x-8">
          <Link
            href="https://blockscout.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#718096] hover:text-gray-500 font-bold"
          >
            Blockscout
          </Link>
          <Link
            href="https://docs.blockscout.com/using-blockscout/swapscout"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#718096] hover:text-gray-500 font-bold"
          >
            Documentation
          </Link>
        </div>
      </div>
      <BannerImage />
      <ActivityTracker />
    </main>
  );
}
