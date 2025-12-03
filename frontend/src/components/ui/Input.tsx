import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          className={`flex h-12 w-full rounded-none border border-gray-200 bg-gray-50 px-4 py-3 text-architect-900 placeholder:text-gray-400 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {!error && helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
