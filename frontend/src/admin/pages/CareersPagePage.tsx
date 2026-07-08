import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionCard from '../components/common/SectionCard';
import ReorderList from '../components/forms/ReorderList';
import SaveButton from '../components/forms/SaveButton';
import TextArea from '../components/forms/TextArea';
import TextInput from '../components/forms/TextInput';
import { useSectionSave } from '../hooks/useSectionSave';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { careersPageApi } from '../services/api';
import type { CareersPageDoc } from '../types/cms';

const emptyCareersPage: Omit<CareersPageDoc, '_id'> = {
  heroTitle: '',
  heroDescription: '',
  philosophyTitle: '',
  philosophySubtitle: '',
  principles: [],
  isActive: true,
};

export default function CareersPagePage() {
  const saveSection = useSectionSave();
  const [docId, setDocId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyCareersPage);
  const [initialForm, setInitialForm] = useState(emptyCareersPage);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initialForm), [form, initialForm]);
  useUnsavedChanges(isDirty);

  useEffect(() => {
    const load = async () => {
      try {
        const active = await careersPageApi.get();
        if (active) {
          const payload = {
            heroTitle: active.heroTitle || '',
            heroDescription: active.heroDescription || '',
            philosophyTitle: active.philosophyTitle || '',
            philosophySubtitle: active.philosophySubtitle || '',
            principles: active.principles || [],
            isActive: active.isActive !== false,
          };
          setDocId(active._id);
          setForm(payload);
          setInitialForm(payload);
        }
      } catch (error) {
        console.error('Failed to load careers page doc:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updatePrinciple = (index: number, field: 'label' | 'title' | 'description', value: string) => {
    const principles = [...(form.principles || [])];
    principles[index] = { ...principles[index], [field]: value };
    update('principles', principles);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection(async () => {
        if (docId) {
          await careersPageApi.update(docId, form);
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
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Careers Page Settings' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Careers Landing Settings</h1>
          <p className="mt-1 text-sm text-slate-400">Configure careers hero title and candidate selection principles.</p>
        </div>
        <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!isDirty} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Careers Intro">
          <div className="space-y-4">
            <TextInput label="Hero Title" value={form.heroTitle || ''} onChange={(v) => update('heroTitle', v)} />
            <TextArea label="Hero Description" value={form.heroDescription || ''} onChange={(v) => update('heroDescription', v)} rows={4} />
          </div>
        </SectionCard>

        <SectionCard
          title="Selection Principles"
          description="Principles of high-agency, resiliency, and curiosity used in screening candidates."
          actions={
            <button
              type="button"
              onClick={() => update('principles', [...(form.principles || []), { label: '', title: '', description: '' }])}
              className="admin-btn admin-btn-secondary"
            >
              <Plus size={16} />
              Add Principle
            </button>
          }
        >
          <div className="space-y-4">
            <TextInput label="Philosophy Section Title" value={form.philosophyTitle || ''} onChange={(v) => update('philosophyTitle', v)} />
            <TextInput label="Philosophy Section Subtitle" value={form.philosophySubtitle || ''} onChange={(v) => update('philosophySubtitle', v)} />
            <ReorderList
              items={form.principles || []}
              onChange={(principles) => update('principles', principles)}
              getId={(item, index) => `principle-${index}`}
              renderItem={(item, index) => (
                <div className="grid gap-3 sm:grid-cols-[1fr_2fr_3fr_auto]">
                  <TextInput label="Label" value={item.label} onChange={(v) => updatePrinciple(index, 'label', v)} />
                  <TextInput label="Title" value={item.title} onChange={(v) => updatePrinciple(index, 'title', v)} />
                  <TextInput label="Description" value={item.description} onChange={(v) => updatePrinciple(index, 'description', v)} />
                  <button
                    type="button"
                    onClick={() => update('principles', (form.principles || []).filter((_, i) => i !== index))}
                    className="admin-btn admin-btn-danger mt-6"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
