import React from 'react';

type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hint?: string;
  disabled?: boolean;
};

export default function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  hint,
  disabled,
}: TextInputProps) {
  return (
    <div>
      <label className="admin-label">
        {label}
        {required ? ' *' : ''}
      </label>
      <input
        type={type}
        className="admin-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}
