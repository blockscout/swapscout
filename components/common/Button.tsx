import SpinnerIcon from '@/public/spinner.svg';

type Props = {
  isLoading?: boolean;
  loadingText?: string;
  dataExist?: boolean;
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
};

export function Button({ isLoading, loadingText, dataExist, onClick, href, children }: Props) {
  const commonClasses = `
    h-[32px] px-3 rounded-lg transition-colors
    text-sm text-[#101112CC] font-semibold
    flex items-center justify-center
  `;

  const dataExistClasses = `
    data-[selected=true]:px-2
    data-[selected=true]:font-bold
    data-[selected=true]:bg-[#1011120A]
  `;

  if (isLoading) {
    return (
      <div className={`${commonClasses} text-[#718096] bg-[#1011120A]`}>
        <SpinnerIcon className="animate-spin w-4 h-4 mr-1" />
        { loadingText }
      </div>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        className={`
          ${commonClasses}
          ${dataExistClasses}
          px-2.5
          data-[selected=false]:hover:text-[#4299E1]
          data-[selected=false]:border-2
          data-[selected=false]:border-[#CBD5E0]
          data-[selected=false]:hover:border-[#4299E1]
        `}
        data-selected={dataExist}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={`
        ${commonClasses}
        ${dataExistClasses}
        data-[selected=false]:text-white
        data-[selected=false]:bg-[#2B6CB0]
        data-[selected=false]:hover:bg-[#4299E1]
      `}
      data-selected={dataExist}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
