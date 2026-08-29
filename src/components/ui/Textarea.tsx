import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  id,
  rows = 3,
  className = '',
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-bold text-slate-700 select-none">
          {label} {props.required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`block w-full text-xs sm:text-sm font-medium bg-white rounded-xl border p-3.5 transition-all duration-150 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
          error
            ? 'border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-slate-200 text-slate-900 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs font-medium text-rose-600 animate-fadeIn">{error}</p>}
      {!error && helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
