'use client';

import Link from 'next/link';
import Image from 'next/image';

import { Widget } from '@/components/Widget';
import { Banner } from '@/components/Banner';
import { ConnectButton } from '@/components/ConnectButton';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10">
      <div className="flex flex-col z-10 items-center justify-between font-mono text-sm">
        <div className="w-full mb-8 flex justify-between sm:w-[416px]">
          <Image src="/logo.svg" alt="Swapscout Logo" width={172} height={30} />
          <ConnectButton />
        </div>
        <Banner text={process.env.NEXT_PUBLIC_BANNER_TEXT} />
        <div className="shadow-custom rounded-[16px] overflow-hidden sm:w-[416px]">
          <Widget/>
        </div>
        <div className="mt-8 flex justify-center space-x-8">
          <Link
            href="https://blockscout.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-600"
          >
            Blockscout
          </Link>
          <Link
            href="https://docs.blockscout.com/using-blockscout/swapscout"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-600"
          >
            Documentation
          </Link>
        </div>
      </div>
    </main>
  );
}
