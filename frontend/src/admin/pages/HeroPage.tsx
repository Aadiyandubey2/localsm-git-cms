import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionCard from '../components/common/SectionCard';
import ImageUploader from '../components/forms/ImageUploader';
import SaveButton from '../components/forms/SaveButton';
import TextArea from '../components/forms/TextArea';
import TextInput from '../components/forms/TextInput';
import ToggleSwitch from '../components/forms/ToggleSwitch';
import { useSectionSave } from '../hooks/useSectionSave';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { getActiveDoc, heroesApi } from '../services/api';
import type { HeroDoc } from '../types/cms';

const emptyHero: Omit<HeroDoc, '_id'> = {
  title: '',
  subtitle: '',
  description: '',
  image: '',
  ctaText: '',
  ctaLink: '',
  isActive: true,
};

export default function HeroPage() {
  const saveSection = useSectionSave();
  const [docId, setDocId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyHero);
  const [initialForm, setInitialForm] = useState(emptyHero);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initialForm), [form, initialForm]);
  useUnsavedChanges(isDirty);

  useEffect(() => {
    const load = async () => {
      try {
        const items = await heroesApi.list();
        const active = getActiveDoc(items);
        if (active) {
          const payload = {
            title: active.title,
            subtitle: active.subtitle || '',
            description: active.description || '',
            image: active.image || '',
            ctaText: active.ctaText || '',
            ctaLink: active.ctaLink || '',
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
          await heroesApi.update(docId, form);
        } else {
          const created = await heroesApi.create(form);
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
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Hero' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Hero Section</h1>
          <p className="mt-1 text-sm text-slate-400">Edit the homepage hero headline, description, and image.</p>
        </div>
        <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!isDirty} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Content" description="Main hero copy shown at the top of the homepage.">
          <div className="space-y-4">
            <TextInput label="Eyebrow / Subtitle" value={form.subtitle || ''} onChange={(v) => update('subtitle', v)} placeholder="Corporate Announcement" />
            <TextInput label="Heading" value={form.title} onChange={(v) => update('title', v)} required />
            <TextArea label="Description" value={form.description || ''} onChange={(v) => update('description', v)} rows={5} />
            <TextInput label="Button Text" value={form.ctaText || ''} onChange={(v) => update('ctaText', v)} />
            <TextInput label="Button URL" value={form.ctaLink || ''} onChange={(v) => update('ctaLink', v)} placeholder="#" />
            <ToggleSwitch label="Show on website" checked={form.isActive !== false} onChange={(v) => update('isActive', v)} />
          </div>
        </SectionCard>

        <SectionCard title="Image & Preview" description="Upload or paste the hero image URL.">
          <ImageUploader label="Hero Image" value={form.image || ''} onChange={(v) => update('image', v)} />
          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-6">
            <p className="text-xs uppercase tracking-wider text-slate-500">Preview</p>
            <p className="mt-3 text-xs text-blue-300">{form.subtitle}</p>
            <h2 className="mt-2 text-2xl font-light text-white">{form.title || 'Hero title preview'}</h2>
            <p className="mt-3 text-sm text-slate-400">{form.description}</p>
            {form.image ? <img src={form.image} alt="Hero preview" className="mt-4 h-40 w-full rounded-lg object-cover" /> : null}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
