import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-heading font-bold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none uppercase';
  
  const variants = {
    primary: 'bg-neon-cyan text-nebula-900 hover:bg-white hover:shadow-neon-cyan border border-transparent',
    secondary: 'bg-nebula-800 text-white border border-glass-200 hover:border-neon-cyan hover:text-neon-cyan',
    outline: 'border-2 border-neon-cyan text-neon-cyan bg-transparent hover:bg-neon-cyan hover:text-nebula-900',
    ghost: 'text-gray-300 hover:text-white hover:bg-white/10',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/20',
  };

  const sizes = {
    sm: 'h-9 px-4 text-xs',
    md: 'h-11 px-6 text-sm',
    lg: 'h-14 px-8 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
