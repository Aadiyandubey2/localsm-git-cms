import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionCard from '../components/common/SectionCard';
import ImageUploader from '../components/forms/ImageUploader';
import RichTextEditor from '../components/forms/RichTextEditor';
import SaveButton from '../components/forms/SaveButton';
import TextArea from '../components/forms/TextArea';
import TextInput from '../components/forms/TextInput';
import ToggleSwitch from '../components/forms/ToggleSwitch';
import { useSectionSave } from '../hooks/useSectionSave';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { foundersApi, getActiveDoc } from '../services/api';
import type { FounderDoc } from '../types/cms';

const emptyFounder: Omit<FounderDoc, '_id'> = {
  name: '',
  title: '',
  message: '',
  signatureImage: '',
  portraitImage: '',
  quote: '',
  isActive: true,
};

export default function FounderPage() {
  const saveSection = useSectionSave();
  const [docId, setDocId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyFounder);
  const [initialForm, setInitialForm] = useState(emptyFounder);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initialForm), [form, initialForm]);
  useUnsavedChanges(isDirty);

  useEffect(() => {
    const load = async () => {
      try {
        const items = await foundersApi.list();
        const active = getActiveDoc(items);
        if (active) {
          const payload = {
            name: active.name,
            title: active.title || '',
            message: active.message || '',
            signatureImage: active.signatureImage || '',
            portraitImage: active.portraitImage || '',
            quote: active.quote || '',
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
          await foundersApi.update(docId, form);
        } else {
          const created = await foundersApi.create({ ...form, name: form.name || 'Founder' });
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
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Founder' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Founder Section</h1>
          <p className="mt-1 text-sm text-slate-400">Manage the founder profile, quote, and full letter content.</p>
        </div>
        <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!isDirty} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <SectionCard title="Profile">
            <div className="space-y-4">
              <TextInput label="Name" value={form.name} onChange={(v) => update('name', v)} required />
              <TextInput label="Title" value={form.title || ''} onChange={(v) => update('title', v)} placeholder="Founder & CEO" />
              <TextArea label="Homepage Quote" value={form.quote || ''} onChange={(v) => update('quote', v)} rows={4} />
              <ToggleSwitch label="Show on website" checked={form.isActive !== false} onChange={(v) => update('isActive', v)} />
            </div>
          </SectionCard>

          <SectionCard title="Images">
            <div className="space-y-4">
              <ImageUploader label="Portrait Image" value={form.portraitImage || ''} onChange={(v) => update('portraitImage', v)} />
              <ImageUploader label="Signature Image" value={form.signatureImage || ''} onChange={(v) => update('signatureImage', v)} />
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Founder Letter" description="Full letter content. Use blank lines between paragraphs.">
          <RichTextEditor
            label="Letter Body"
            value={form.message || ''}
            onChange={(v) => update('message', v)}
            hint="This content powers the full Founder Letter page."
          />
        </SectionCard>
      </div>
    </div>
  );
}
