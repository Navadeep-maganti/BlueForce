import React from 'react';
import { ShieldCheck, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export type BadgeVariant =
  | 'verified'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'applied'
  | 'screening'
  | 'shortlisted'
  | 'interview'
  | 'selected'
  | 'hired'
  | 'active'
  | 'closed'
  | 'paused'
  | 'info'
  | 'neutral';

export interface StatusBadgeProps {
  variant?: BadgeVariant;
  label?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant = 'neutral',
  label,
  children,
  showIcon = true,
  size = 'md',
  className = '',
}) => {
  const text = label || children;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
  };

  const variantConfigs: Record<BadgeVariant, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
    verified: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />,
    },
    approved: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
    },
    hired: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300 font-black',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
    },
    selected: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
    },
    active: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />,
    },
    pending: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
    },
    applied: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      icon: <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />,
    },
    screening: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />,
    },
    shortlisted: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />,
    },
    interview: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      icon: <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />,
    },
    rejected: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />,
    },
    closed: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />,
    },
    paused: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
    },
    info: {
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-200',
      icon: <AlertCircle className="w-3.5 h-3.5 text-sky-600 shrink-0" />,
    },
    neutral: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      icon: null,
    },
  };

  const config = variantConfigs[variant] || variantConfigs.neutral;

  return (
    <span
      className={`inline-flex items-center font-bold border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && config.icon}
      <span>{text}</span>
    </span>
  );
};
