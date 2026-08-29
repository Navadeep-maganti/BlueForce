import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'elevated' | 'interactive' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'bg-white rounded-2xl transition-all duration-200';

  const variantStyles = {
    default: 'border border-slate-200/80 shadow-xs',
    flat: 'border border-slate-200/60 shadow-none bg-slate-50/50',
    elevated: 'border border-slate-100 shadow-md hover:shadow-lg',
    interactive: 'border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 cursor-pointer',
    glass: 'bg-white/80 backdrop-blur-md border border-white/60 shadow-sm',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ title: React.ReactNode; subtitle?: React.ReactNode; action?: React.ReactNode; className?: string }> = ({
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 ${className}`}>
      <div>
        <h3 className="text-sm sm:text-base font-black text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
