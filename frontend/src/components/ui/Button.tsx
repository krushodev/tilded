import { Button as HeroUIButton } from '@heroui/react';
import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<typeof HeroUIButton>;

interface Props extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow';
}

export const Button = ({ variant = 'solid', color = 'primary', className, ...props }: Props) => {
  const heroUIVariant = variant === 'primary' ? 'solid' : variant === 'secondary' ? 'solid' : variant === 'ghost' ? 'light' : variant;
  const heroUIColor = variant === 'primary' ? 'primary' : variant === 'secondary' ? 'secondary' : color;

  return (
    <HeroUIButton
      variant={heroUIVariant}
      color={heroUIColor}
      className={className}
      {...props}
    />
  );
};
