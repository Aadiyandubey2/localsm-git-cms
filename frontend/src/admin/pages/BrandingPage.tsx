import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionCard from '../components/common/SectionCard';
import ImageUploader from '../components/forms/ImageUploader';
import SaveButton from '../components/forms/SaveButton';
import TextInput from '../components/forms/TextInput';
import ToggleSwitch from '../components/forms/ToggleSwitch';
import { useSectionSave } from '../hooks/useSectionSave';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { brandingApi, getActiveDoc } from '../services/api';
import type { BrandingDoc } from '../types/cms';

const emptyBranding: Omit<BrandingDoc, '_id'> & {
  wordmarkText?: string;
  wordmarkHighlightIndex?: number;
  wordmarkHighlightColor?: string;
} = {
  siteName: '',
  logo: '',
  favicon: '',
  primaryColor: '#0055ff',
  secondaryColor: '#f4f4f4',
  accentColor: '#f4b000',
  fontFamily: '',
  wordmarkText: '',
  wordmarkHighlightIndex: 5,
  wordmarkHighlightColor: '#f4b000',
  isActive: true,
};

export default function BrandingPage() {
  const saveSection = useSectionSave();
  const [docId, setDocId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyBranding);
  const [initialForm, setInitialForm] = useState(emptyBranding);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initialForm), [form, initialForm]);
  useUnsavedChanges(isDirty);

  useEffect(() => {
    const load = async () => {
      try {
        const items = await brandingApi.list();
        const active = getActiveDoc(items);
        if (active) {
          const payload = {
            siteName: active.siteName,
            logo: active.logo || '',
            favicon: active.favicon || '',
            primaryColor: active.primaryColor || '#0055ff',
            secondaryColor: active.secondaryColor || '#f4f4f4',
            accentColor: active.accentColor || '#f4b000',
            fontFamily: active.fontFamily || '',
            wordmarkText: (active as any).wordmarkText || '',
            wordmarkHighlightIndex: (active as any).wordmarkHighlightIndex ?? 5,
            wordmarkHighlightColor: (active as any).wordmarkHighlightColor || '#f4b000',
            isActive: active.isActive !== false,
          };
          setDocId(active._id);
          setForm(payload);
          setInitialForm(payload);
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection(async () => {
        if (docId) {
          await brandingApi.update(docId, form);
        } else {
          const created = await brandingApi.create({ ...form, siteName: form.siteName || 'LocalSM' });
          setDocId(created._id);
        }
        setInitialForm(form);
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Branding' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Branding</h1>
          <p className="mt-1 text-sm text-slate-400">Site name, logo, favicon, colors, and typography.</p>
        </div>
        <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!isDirty} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Identity">
          <div className="space-y-4">
            <TextInput label="Site Name" value={form.siteName} onChange={(v) => update('siteName', v)} required />
            <ImageUploader label="Logo" value={form.logo || ''} onChange={(v) => update('logo', v)} />
            <ImageUploader label="Favicon" value={form.favicon || ''} onChange={(v) => update('favicon', v)} />
            <TextInput label="Font Family" value={form.fontFamily || ''} onChange={(v) => update('fontFamily', v)} placeholder="Berkshire Swash" />
            <TextInput label="Wordmark Text" value={form.wordmarkText || ''} onChange={(v) => update('wordmarkText', v)} placeholder="LocalSM" />
            <TextInput label="Wordmark Highlight Index" value={String(form.wordmarkHighlightIndex ?? '')} onChange={(v) => update('wordmarkHighlightIndex', v ? parseInt(v, 10) : undefined)} type="number" />
            <TextInput label="Wordmark Highlight Color" value={form.wordmarkHighlightColor || ''} onChange={(v) => update('wordmarkHighlightColor', v)} placeholder="#f4b000" />
            <ToggleSwitch label="Branding active" checked={form.isActive !== false} onChange={(v) => update('isActive', v)} />
          </div>
        </SectionCard>

        <SectionCard title="Colors">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="admin-label">Primary</label>
              <input type="color" className="h-12 w-full rounded-lg border border-slate-700 bg-slate-900" value={form.primaryColor || '#0055ff'} onChange={(e) => update('primaryColor', e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Secondary</label>
              <input type="color" className="h-12 w-full rounded-lg border border-slate-700 bg-slate-900" value={form.secondaryColor || '#f4f4f4'} onChange={(e) => update('secondaryColor', e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Accent</label>
              <input type="color" className="h-12 w-full rounded-lg border border-slate-700 bg-slate-900" value={form.accentColor || '#f4b000'} onChange={(e) => update('accentColor', e.target.value)} />
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-700 p-6" style={{ background: form.secondaryColor || '#f4f4f4' }}>
            <div className="flex items-center gap-3">
              {form.logo ? <img src={form.logo} alt="Logo preview" className="h-10 w-10 object-contain" /> : null}
              <span className="text-xl font-semibold" style={{ color: form.primaryColor || '#0055ff' }}>
                {form.siteName || 'LocalSM'}
              </span>
              <span className="text-sm font-medium" style={{ color: form.accentColor || '#f4b000' }}>
                Preview
              </span>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
