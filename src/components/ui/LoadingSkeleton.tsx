import React from 'react';

export interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'circle' | 'table-row';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  count = 1,
  className = '',
}) => {
  const items = Array.from({ length: count });

  if (variant === 'circle') {
    return (
      <div className="flex gap-2">
        {items.map((_, i) => (
          <div key={i} className={`w-10 h-10 rounded-full bg-slate-200 animate-pulse ${className}`} />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="space-y-4 w-full">
        {items.map((_, i) => (
          <div key={i} className={`p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 animate-pulse ${className}`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-200" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/4" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <div className="space-y-2 w-full">
        {items.map((_, i) => (
          <div key={i} className={`h-12 bg-slate-100/80 rounded-xl animate-pulse flex items-center px-4 gap-4 ${className}`}>
            <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
            <div className="h-3.5 bg-slate-200 rounded w-1/4" />
            <div className="h-3 bg-slate-200 rounded w-1/6 ml-auto" />
            <div className="h-6 w-16 bg-slate-200 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      {items.map((_, i) => (
        <div key={i} className={`h-4 bg-slate-200 rounded-lg animate-pulse ${className}`} />
      ))}
    </div>
  );
};
