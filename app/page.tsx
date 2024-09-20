'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';

import { Widget } from '@/components/Widget';
import { WalletProvider } from '@/components/WalletProvider';
import { Banner } from '@/components/Banner';

const queryClient = new QueryClient();

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col z-10 items-center justify-between font-mono text-sm">
        <div className="mb-8 flex justify-center">
          <Image src="/logo.svg" alt="Swapscout Logo" width={172} height={30} />
        </div>
        <Banner text={process.env.NEXT_PUBLIC_BANNER_TEXT} />
        <div className="shadow-custom rounded-[16px] overflow-hidden sm:w-[420px]">
          <QueryClientProvider client={queryClient}>
            <WalletProvider>
              <Widget/>
            </WalletProvider>
          </QueryClientProvider>
        </div>
        <div className="mt-8 flex justify-center space-x-8">
          <Link href="https://blockscout.com" className="text-gray-500 hover:text-gray-600">
            Blockscout
          </Link>
          <Link href="https://docs.blockscout.com/using-blockscout/swapscout" className="text-gray-500 hover:text-gray-600">
            Documentation
          </Link>
        </div>
      </div>
    </main>
  );
}
