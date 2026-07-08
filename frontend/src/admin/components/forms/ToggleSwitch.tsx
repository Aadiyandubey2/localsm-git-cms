import React from 'react';

type ToggleSwitchProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
};

export default function ToggleSwitch({ label, checked, onChange, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-100">{label}</p>
        {description ? <p className="text-xs text-slate-400 mt-0.5">{description}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-slate-600'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
