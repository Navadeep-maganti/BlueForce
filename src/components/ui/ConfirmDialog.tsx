import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" showCloseButton={false}>
      <div className="text-center space-y-4">
        <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${
          variant === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
        }`}>
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{message}</p>
        </div>
        <div className="flex items-center justify-center gap-2.5 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
