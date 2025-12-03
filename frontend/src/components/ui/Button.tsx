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
  const baseStyles = 'inline-flex items-center justify-center font-heading font-bold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none uppercase rounded-none';
  
  const variants = {
    primary: 'bg-architect-900 text-white hover:bg-accent-teal hover:shadow-soft border border-transparent',
    secondary: 'bg-white text-architect-900 border border-architect-900 hover:bg-gray-50',
    outline: 'border-2 border-architect-900 text-architect-900 bg-transparent hover:bg-architect-900 hover:text-white',
    ghost: 'text-gray-500 hover:text-architect-900 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/20',
  };

  const sizes = {
    sm: 'h-9 px-4 text-xs',
    md: 'h-12 px-6 text-sm',
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
