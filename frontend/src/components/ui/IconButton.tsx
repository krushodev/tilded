import { ReactNode } from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'default' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = ({ 
  icon, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}: IconButtonProps) => {
  const base = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'text-txt-secondary hover:text-txt hover:bg-silver/10',
    danger: 'text-txt-muted hover:text-coral-glow hover:bg-silver/10',
    ghost: 'text-txt-muted hover:bg-silver/20'
  };

  const sizes = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2'
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};

