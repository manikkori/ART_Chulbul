import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showClose={!loading}>
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-[#ffe5ee] text-[#ff0457] flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="text-xl font-bold text-[#111827] tracking-[-0.02em] mb-2">
          {title}
        </h4>
        <p className="text-[13px] text-[#6e6e73] mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex items-center gap-3 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            className="flex-1"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
