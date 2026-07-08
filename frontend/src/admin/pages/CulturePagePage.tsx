import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionCard from '../components/common/SectionCard';
import ImageUploader from '../components/forms/ImageUploader';
import ReorderList from '../components/forms/ReorderList';
import SaveButton from '../components/forms/SaveButton';
import TextArea from '../components/forms/TextArea';
import TextInput from '../components/forms/TextInput';
import { useSectionSave } from '../hooks/useSectionSave';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { culturePageApi } from '../services/api';
import type { CulturePageDoc } from '../types/cms';

const emptyCulturePage: Omit<CulturePageDoc, '_id'> = {
  heroTitle: '',
  heroDescription: '',
  philosophyImage: '',
  philosophyImageAlt: '',
  philosophyQuote: '',
  philosophyBody: [],
  valuesTitle: '',
  valuesSubtitle: '',
  valuesList: [],
  ctaTitle: '',
  ctaDescription: '',
  ctaButtonText: '',
  isActive: true,
};

export default function CulturePagePage() {
  const saveSection = useSectionSave();
  const [docId, setDocId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyCulturePage);
  const [initialForm, setInitialForm] = useState(emptyCulturePage);
  const [bodyText, setBodyText] = useState('');
  const [initialBodyText, setInitialBodyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm) || bodyText !== initialBodyText,
    [form, initialForm, bodyText, initialBodyText]
  );
  useUnsavedChanges(isDirty);

  useEffect(() => {
    const load = async () => {
      try {
        const active = await culturePageApi.get();
        if (active) {
          const payload = {
            heroTitle: active.heroTitle || '',
            heroDescription: active.heroDescription || '',
            philosophyImage: active.philosophyImage || '',
            philosophyImageAlt: active.philosophyImageAlt || '',
            philosophyQuote: active.philosophyQuote || '',
            philosophyBody: active.philosophyBody || [],
            valuesTitle: active.valuesTitle || '',
            valuesSubtitle: active.valuesSubtitle || '',
            valuesList: active.valuesList || [],
            ctaTitle: active.ctaTitle || '',
            ctaDescription: active.ctaDescription || '',
            ctaButtonText: active.ctaButtonText || '',
            isActive: active.isActive !== false,
          };
          const rawBody = (active.philosophyBody || []).join('\n\n');
          setDocId(active._id);
          setForm(payload);
          setInitialForm(payload);
          setBodyText(rawBody);
          setInitialBodyText(rawBody);
        }
      } catch (error) {
        console.error('Failed to load culture page doc:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateValueItem = (index: number, field: 'num' | 'title' | 'description', value: string) => {
    const valuesList = [...(form.valuesList || [])];
    valuesList[index] = { ...valuesList[index], [field]: value };
    update('valuesList', valuesList);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      ...form,
      philosophyBody: bodyText
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean),
    };

    try {
      await saveSection(async () => {
        if (docId) {
          await culturePageApi.update(docId, payload);
        }
        setForm(payload);
        setInitialForm(payload);
        setInitialBodyText(bodyText);
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
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Culture Page Settings' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Culture Page</h1>
          <p className="mt-1 text-sm text-slate-400">Configure hero titles, philosophy paragraphs, core values, and open career CTAs.</p>
        </div>
        <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!isDirty} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Hero & philosophy">
          <div className="space-y-4">
            <TextInput label="Hero Title" value={form.heroTitle || ''} onChange={(v) => update('heroTitle', v)} />
            <TextArea label="Hero Description" value={form.heroDescription || ''} onChange={(v) => update('heroDescription', v)} rows={3} />
            <TextInput label="Philosophy Quote" value={form.philosophyQuote || ''} onChange={(v) => update('philosophyQuote', v)} />
            <TextArea label="Philosophy Body Paragraphs" value={bodyText} onChange={setBodyText} rows={8} hint="Separate paragraphs with double newlines" />
          </div>
        </SectionCard>

        <SectionCard title="Philosophy Media & Call to Action">
          <div className="space-y-4">
            <ImageUploader label="Philosophy Image" value={form.philosophyImage || ''} onChange={(v) => update('philosophyImage', v)} />
            <TextInput label="Philosophy Image Alt" value={form.philosophyImageAlt || ''} onChange={(v) => update('philosophyImageAlt', v)} />
            <div className="border-t border-slate-700 pt-4 mt-4 space-y-4">
              <h4 className="text-sm font-semibold text-white">Careers CTA Section</h4>
              <TextInput label="CTA Title" value={form.ctaTitle || ''} onChange={(v) => update('ctaTitle', v)} />
              <TextArea label="CTA Description" value={form.ctaDescription || ''} onChange={(v) => update('ctaDescription', v)} rows={3} />
              <TextInput label="CTA Button Text" value={form.ctaButtonText || ''} onChange={(v) => update('ctaButtonText', v)} />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Core Values List"
          description="Manage the core operating values shown on the culture page."
          actions={
            <button
              type="button"
              onClick={() => update('valuesList', [...(form.valuesList || []), { num: '01', title: '', description: '' }])}
              className="admin-btn admin-btn-secondary"
            >
              <Plus size={16} />
              Add Value
            </button>
          }
        >
          <ReorderList
            items={form.valuesList || []}
            onChange={(values) => update('valuesList', values)}
            getId={(item, index) => `value-${index}`}
            renderItem={(item, index) => (
              <div className="grid gap-3 sm:grid-cols-[1fr_2fr_3fr_auto]">
                <TextInput label="Number" value={item.num} onChange={(v) => updateValueItem(index, 'num', v)} />
                <TextInput label="Title" value={item.title} onChange={(v) => updateValueItem(index, 'title', v)} />
                <TextInput label="Description" value={item.description} onChange={(v) => updateValueItem(index, 'description', v)} />
                <button
                  type="button"
                  onClick={() => update('valuesList', (form.valuesList || []).filter((_, i) => i !== index))}
                  className="admin-btn admin-btn-danger mt-6"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          />
        </SectionCard>
      </div>
    </div>
  );
}
