import React from 'react';
import { AlertTriangle } from 'lucide-react';

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-start gap-3">
          <div className="rounded-full bg-red-500/15 p-2 text-red-400">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
            <p className="mt-1 text-sm text-slate-400">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="admin-btn admin-btn-secondary" disabled={isLoading}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="admin-btn admin-btn-danger" disabled={isLoading}>
            {isLoading ? 'Working...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
