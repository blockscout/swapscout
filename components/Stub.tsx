import Image from 'next/image';

export function Stub() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-[800px] flex-col items-center text-center">
        <Image
          src="/paper-airplane.svg"
          alt="Placeholder"
          width={177}
          height={100}
          className="mb-8"
          priority
        />

        <h1 className="text-3xl sm:text-5xl leading-[1.4] sm:leading-[1.4] font-medium text-[#101112CC]">
          Swap has moved to Blockscout essential dapps!
        </h1>

        <p className="mt-8 sm:mt-12 text-base leading-[30px] text-[#718096]">
          Essential Dapps are convenient, integrated tools available across all hosted explorers.
          <br />
          More dapps and functionality coming soon.
        </p>

        <a
          href="https://eth.blockscout.com/essential-dapps/swap?utm_source=swapscout&utm_medium=deprecation-banner"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#5459D6] px-3 py-2 text-base font-semibold text-white transition-opacity hover:opacity-[0.9]"
        >
          Access Swap dapp
        </a>
      </div>
    </main>
  );
}
