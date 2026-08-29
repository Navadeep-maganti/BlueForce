import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-8 text-center rounded-2xl bg-rose-50/50 border border-rose-200/80 shadow-xs flex flex-col items-center justify-center max-w-md mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-rose-900 mb-1">{title}</h3>
      <p className="text-xs text-rose-700 max-w-sm mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          size="sm"
          variant="danger"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
