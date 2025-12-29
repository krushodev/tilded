import { Chip } from '@heroui/react';
import type { ComponentProps } from 'react';
import { ReactNode } from 'react';

type ChipProps = ComponentProps<typeof Chip>;

interface BadgeProps extends Omit<ChipProps, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'muted' | 'solid' | 'bordered' | 'light' | 'flat' | 'dot';
}

export const Badge = ({ 
  children, 
  variant = 'flat',
  color = 'primary',
  size = 'md',
  className = '',
  ...props
}: BadgeProps) => {
  const heroUIVariant = variant === 'primary' ? 'flat' : variant === 'secondary' ? 'flat' : variant === 'muted' ? 'light' : variant === 'default' ? 'flat' : variant;
  const heroUIColor = variant === 'primary' ? 'primary' : variant === 'secondary' ? 'secondary' : variant === 'muted' ? 'default' : color;

  return (
    <Chip
      variant={heroUIVariant}
      color={heroUIColor}
      size={size}
      className={className}
      {...props}
    >
      {children}
    </Chip>
  );
};

