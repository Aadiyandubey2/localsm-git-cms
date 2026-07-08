import React from 'react';
import { Loader2, Save } from 'lucide-react';

type SaveButtonProps = {
  onClick: () => void;
  isSaving?: boolean;
  disabled?: boolean;
  label?: string;
};

export default function SaveButton({ onClick, isSaving, disabled, label = 'Save Changes' }: SaveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isSaving}
      className="admin-btn admin-btn-primary"
    >
      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
      {isSaving ? 'Saving...' : label}
    </button>
  );
}
