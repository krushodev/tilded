import { ReactNode } from 'react';

interface IconProps {
  children: ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

export const Icon = ({ children, className = '', size = 'md' }: IconProps) => {
  return (
    <span className={`inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};

