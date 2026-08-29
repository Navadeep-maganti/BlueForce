import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  helperText,
  id,
  className = '',
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-bold text-slate-700 select-none">
          {label} {props.required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-xs">
        <select
          ref={ref}
          id={selectId}
          className={`block w-full appearance-none text-xs sm:text-sm font-medium bg-white rounded-xl border pl-3.5 pr-10 py-2.5 transition-all duration-150 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
            error
              ? 'border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-200 text-slate-900 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <p className="text-xs font-medium text-rose-600 animate-fadeIn">{error}</p>}
      {!error && helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}
    </div>
  );
});

Select.displayName = 'Select';
