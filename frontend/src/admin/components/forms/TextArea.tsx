import React from 'react';

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  hint?: string;
};

export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  required,
  hint,
}: TextAreaProps) {
  return (
    <div>
      <label className="admin-label">
        {label}
        {required ? ' *' : ''}
      </label>
      <textarea
        className="admin-input resize-y min-h-[120px]"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
      />
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}
