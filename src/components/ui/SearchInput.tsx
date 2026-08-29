import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  sizeVariant?: 'sm' | 'md' | 'lg';
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search by trade, skill, keyword...',
  sizeVariant = 'md',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'py-1.5 pl-8 pr-7 text-xs',
    md: 'py-2.5 pl-10 pr-9 text-xs sm:text-sm',
    lg: 'py-3.5 pl-12 pr-10 text-sm sm:text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5 left-2.5',
    md: 'w-4 h-4 left-3.5',
    lg: 'w-5 h-5 left-4',
  };

  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
  };

  return (
    <div className="relative w-full rounded-xl shadow-xs">
      <div className={`absolute inset-y-0 flex items-center pointer-events-none text-slate-400 ${iconSizes[sizeVariant]}`}>
        <Search className="w-full h-full" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`block w-full bg-white rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 transition-all duration-150 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${sizeClasses[sizeVariant]} ${className}`}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
