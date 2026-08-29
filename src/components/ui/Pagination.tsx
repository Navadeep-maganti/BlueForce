import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 20,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : currentPage * pageSize;

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 ${className}`}>
      {totalItems !== undefined ? (
        <p className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{startItem}</span> to{' '}
          <span className="font-bold text-slate-900">{endItem}</span> of{' '}
          <span className="font-bold text-slate-900">{totalItems}</span> results
        </p>
      ) : (
        <p className="text-xs text-slate-500 font-medium">
          Page <span className="font-bold text-slate-900">{currentPage}</span> of{' '}
          <span className="font-bold text-slate-900">{totalPages}</span>
        </p>
      )}

      <div className="flex items-center gap-1.5 self-center">
        <Button
          variant="outline"
          size="xs"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1 px-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && <span className="text-slate-400 text-xs px-1">...</span>}
        </div>

        <Button
          variant="outline"
          size="xs"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
