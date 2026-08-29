import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none disabled:opacity-60 disabled:cursor-not-allowed';
  
  const sizeStyles: Record<ButtonSize, string> = {
    xs: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
    sm: 'text-xs px-3.5 py-1.5 rounded-xl gap-2',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2.5 shadow-sm',
    lg: 'text-base px-6 py-3.5 rounded-2xl gap-3 shadow-md',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white focus:ring-blue-500 shadow-blue-500/20 shadow-md hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-navy-900 hover:bg-navy-800 active:bg-navy-950 text-white focus:ring-navy-700 shadow-navy-900/20 shadow-md hover:shadow-lg hover:-translate-y-0.5',
    outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 focus:ring-slate-400',
    danger: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white focus:ring-rose-500 shadow-rose-600/20 shadow-md',
    success: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white focus:ring-emerald-500 shadow-emerald-600/20 shadow-md',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 active:bg-slate-200 focus:ring-slate-300',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
