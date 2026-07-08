import React from 'react';

type RichTextEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
};

export default function RichTextEditor({ label, value, onChange, rows = 12, hint }: RichTextEditorProps) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      <textarea
        className="admin-input resize-y min-h-[240px] font-mono text-sm leading-relaxed"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder="Write content here. Use blank lines between paragraphs."
      />
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}
