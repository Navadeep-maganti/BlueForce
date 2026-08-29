import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`p-8 sm:p-12 text-center rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center max-w-md mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {action && (
        <Button
          size="sm"
          variant="primary"
          onClick={action.onClick}
          leftIcon={action.icon}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
