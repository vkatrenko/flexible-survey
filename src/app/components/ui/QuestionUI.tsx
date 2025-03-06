'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ButtonProps {
  text: string;
  selected?: boolean;
  onClick: () => void;
}

interface QuestionUIProps {
  variant: 'dark' | 'light';
  questionText: string;
  options?: Record<string, string>;
  onAnswer: (option: string) => void;
  selectedAnswer?: string;
}

const theme = {
  light: {
    background: 'bg-[#FFF0F0]',
    text: 'text-[#1A1A1A]',
    logo: '/logo_black.svg',
    buttonBg: 'bg-[#EAEEF7]',
    buttonText: 'text-[#1A1A1A]',
    buttonBorder: 'border-[#E6E6E6]',
    chevron: '/chevron.svg',
  },
  dark: {
    background: 'bg-gradient-to-b from-[#141333] via-[#202261] to-[#6939A2]',
    text: 'text-[#FBFBFF]',
    logo: '/logo_white.svg',
    buttonBg: 'bg-gradient-to-r from-[#141333] via-[#202261] to-[#6939A2]',
    buttonText: 'text-white',
    buttonBorder: 'border-transparent',
    chevron: '/chevron_white.svg',
  },
};

const OptionButtonComponent: React.FC<ButtonProps> = ({ text, selected, onClick }) => {
  return (
    <button
      className={`w-full h-16 rounded-xl text-base font-normal transition-all duration-300 
        ${
          selected
            ? 'text-white bg-[linear-gradient(165.54deg,_#141333_-33.39%,_#202261_15.89%,_#543C97_55.84%,_#6939A2_74.96%)] border-[#E0E0E0]'
            : 'text-[#1A1A1A] bg-[#EAEEF7] border-[#E0E0E0]'
        }
        py-3 px-4 font-normal text-[14px] leading-[19.6px] cursor-pointer
      `}
      onClick={onClick}
      style={{
        boxShadow: selected
          ? '2px 2px 6px rgba(84, 60, 151, 0.25)'
          : '2px 2px 6px rgba(84, 60, 151, 0.25)', // Apply same shadow for both states
      }}
    >
      {text}
    </button>
  );
};

const Header = ({ onBack, variant }: { onBack: () => void; variant: 'light' | 'dark' }) => (
  <header className="w-full flex h-[54px] justify-center items-center relative">
    <button
      className="absolute left-[0] bg-transparent border-none cursor-pointer"
      onClick={onBack}
    >
      <Image
        alt="Back"
        height={24}
        src={theme?.[variant]?.chevron ?? '/chevron_white.svg'}
        width={24}
      />
    </button>
    <Logo variant={variant} />
  </header>
);

const Logo = ({ variant }: { variant: 'light' | 'dark' }) => {
  const logoSrc = theme?.[variant]?.logo ?? '/fallback-logo.png';

  return (
    <div>
      <Image alt="Logo" height={24} priority src={logoSrc} width={24} />
    </div>
  );
};

const QuestionUI: React.FC<QuestionUIProps> = ({
  variant,
  questionText,
  options,
  onAnswer,
  selectedAnswer,
}) => {
  const router = useRouter();

  return (
    <div
      className={`${theme[variant].background} min-h-screen flex flex-col items-center justify-start gap-5 px-[15px] lg:px-[165px] py-4`}
    >
      <Header onBack={() => router.back()} variant={variant} />

      <div className="flex flex-col w-[330px] text-left gap-7">
        <h1 className={`text-2xl font-bold leading-snug ${theme[variant].text}`}>{questionText}</h1>

        <div className="flex flex-col gap-2.5">
          {options && Object.keys(options).length > 0 ? (
            Object.keys(options).map(option => (
              <OptionButtonComponent
                key={option}
                onClick={() => onAnswer(option)}
                selected={selectedAnswer === option}
                text={option}
              />
            ))
          ) : (
            <OptionButtonComponent onClick={() => onAnswer('')} selected={false} text="Next" />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionUI;
