import Link from 'next/link';
import Image from 'next/image';

import { Widget } from '@/components/Widget';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 items-center justify-between font-mono text-sm">
        <div className="mb-6 flex justify-center">
          <Image src="/logo.svg" alt="Swapscout Logo" width={172} height={30} />
        </div>
        <div className="shadow-custom rounded-[16px] overflow-hidden">
          {/* <QueryClientProvider client={queryClient}>
            <WalletProvider>
              <Widget/>
            </WalletProvider>
          </QueryClientProvider> */}
          {/* <LiFiWidget integrator="blockscout" config={widgetConfig} /> */}
          <Widget />
        </div>
        <div className="mt-8 flex justify-center space-x-8">
          <Link href="https://blockscout.com" className="text-gray-500 hover:text-gray-600">Blockscout</Link>
          <Link href="#" className="text-gray-500 hover:text-gray-600">Documentation</Link>
        </div>
      </div>
    </main>
  );
}
