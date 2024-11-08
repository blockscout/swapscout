import React, { useEffect } from 'react';

import CrossIcon from '@/public/cross.svg';

const imageUrl = process.env.NEXT_PUBLIC_BANNER_IMAGE;
const link = process.env.NEXT_PUBLIC_BANNER_IMAGE_LINK;

export const BannerImage = () => {
  const [ showBanner, setShowBanner ] = React.useState(false);

  useEffect(() => {
    const bannerClosed = window.localStorage.getItem('bannerClosed');
    setShowBanner(bannerClosed !== link);
  }, []);

  const handleClose = (e) => {
    e.preventDefault();
    if (link) {
      window.localStorage.setItem('bannerClosed', link);
    }
    setShowBanner(false);
  }

  if (!imageUrl || !showBanner) {
    return null;
  }

  return (
    <a href={ link } target="_blank" className="z-10 hidden lg:block absolute right-[45px] bottom-[45px] cursor-pointer">
      <div className="relative">
        <img src={imageUrl} alt="Banner Image" width={320} height={100} />
        <div
          className="absolute top-0 right-0 p-1 text-[#718096] hover:text-[#2d3748]"
          onClick={handleClose}
        >
          <CrossIcon width={20} height={20} />
        </div>
      </div>
    </a>
  );
};
