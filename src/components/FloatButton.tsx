import { type FC } from 'react';

interface FloatButtonProps {
  onClick: () => void;
}

const FloatButton: FC<FloatButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[9999] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#1677ff] text-lg text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      style={{ boxShadow: '0 4px 12px rgba(22,119,255,0.4)' }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
};

export default FloatButton;