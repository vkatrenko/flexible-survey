'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styled, { ThemeProvider } from 'styled-components';

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
    background: '#FFF0F0',
    text: '#1A1A1A',
    logo: '/logo_black.svg',
    buttonBg: '#EAEEF7',
    buttonText: '#1A1A1A',
    buttonBorder: '#E6E6E6',
  },
  dark: {
    background:
      'linear-gradient(165.54deg, #141333 -33.39%, #202261 15.89%, #543C97 55.84%, #6939A2 74.96%)',
    text: '#FBFBFF',
    logo: '/logo_black.svg',
    buttonBg: 'linear-gradient(to right, #141333, #202261, #6939A2)',
    buttonText: '#FFFFFF',
    buttonBorder: 'transparent',
  },
};

// Styled Components
const Section = styled.div`
  background: ${({ theme }) => theme.background};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  padding-top: 25px;
`;

const LogoContainer = styled.div`
  margin-bottom: 25px;
`;

const HeaderContainer = styled.header`
  position: absolute;
  top: 4px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-left: 16px;
`;

const BackButton = styled.button`
  width: 16.67%;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled.div`
  width: 295px;
  flex-direction: column;
  text-align: left;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  line-height: 1.2;
`;

const OptionButton = styled.button<ButtonProps>`
  width: 295px;
  height: 64px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: normal;
  border: 1px solid ${({ theme }) => theme.buttonBorder};
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  color: ${({ selected, theme }) => (selected ? '#FFFFFF' : theme.buttonText)};
  background: ${({ selected, theme }) =>
    selected
      ? theme.variant === 'dark'
        ? 'linear-gradient(to bottom, #6A5ACD, #4B0082)'
        : 'purple'
      : theme.variant === 'dark'
        ? '#4B0082'
        : theme.buttonBg};
`;

const OptionButtonComponent: React.FC<ButtonProps> = ({ text, selected, onClick }) => {
  return (
    <OptionButton
      onClick={onClick}
      style={{ backgroundColor: selected ? 'purple' : 'gray' }}
      text={text}
    >
      {text}
    </OptionButton>
  );
};

const Header = ({ onBack }: { onBack: () => void }) => (
  <HeaderContainer>
    <BackButton onClick={onBack}>
      <Image alt="Back" height={24} src="/chevron.png" width={24} />
    </BackButton>
  </HeaderContainer>
);

const Logo = ({ variant }: { variant: 'light' | 'dark' }) => (
  <LogoContainer>
    <Image alt="Logo" height={24} priority src={theme[variant].logo} width={24} />
  </LogoContainer>
);

const QuestionUI: React.FC<QuestionUIProps> = ({
  variant,
  questionText,
  options,
  onAnswer,
  selectedAnswer,
}) => {
  const router = useRouter();

  return (
    <ThemeProvider theme={theme[variant]}>
      <Section>
        <Logo variant={variant} />
        <Header onBack={() => router.back()} />

        <ContentContainer>
          <Title>{questionText}</Title>

          <div className="flex flex-col gap-4 mt-4">
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
        </ContentContainer>
      </Section>
    </ThemeProvider>
  );
};

export default QuestionUI;
