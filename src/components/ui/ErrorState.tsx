import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error while loading this content. Please try again.',
  onRetry,
  retryLabel = 'Retry Now',
  className = '',
}) => {
  return (
    <div
      className={`p-8 sm:p-10 text-center rounded-2xl border border-red-200 bg-red-50/50 flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
      role="alert"
    >
      <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-3.5">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h3 className="text-sm sm:text-base font-bold text-red-900 mb-1">{title}</h3>
      <p className="text-xs text-red-700/80 max-w-sm leading-relaxed mb-5">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {retryLabel}
        </button>
      )}
    </div>
  );
};
