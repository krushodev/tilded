interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({ 
  variant = 'default', 
  padding = 'md',
  className = '',
  children,
  ...props 
}: CardProps) => {
  const base = 'rounded-lg bg-bg';
  
  const variants = {
    default: 'border border-silver/30',
    elevated: 'shadow-sm border border-silver/20',
    outlined: 'border-2 border-silver/40'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={`${base} ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

