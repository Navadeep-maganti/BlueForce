import React from 'react';
import { ArrowLeft } from 'lucide-react';

export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  backButton?: {
    label?: string;
    onClick: () => void;
  };
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
  backButton,
  className = '',
}) => {
  return (
    <div className={`space-y-3 pb-2 ${className}`}>
      {backButton && (
        <button
          type="button"
          onClick={backButton.onClick}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{backButton.label || 'Back'}</span>
        </button>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
