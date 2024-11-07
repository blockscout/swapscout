type Props = {
  dataExist: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export function Button({ dataExist, onClick, children }: Props) {
  return (
    <button
      className={`
        h-[40px] px-4 rounded-md transition-colors
        bg-[#2B6CB0] hover:bg-[#22568c] text-white
        data-[selected=true]:bg-[#1011120A]
        data-[selected=true]:hover:bg-[#1011120A]
        data-[selected=true]:text-[#101112CC]
      `}
      data-selected={ dataExist }
      onClick={ onClick }
    >
      { children }
    </button>
  );
}
