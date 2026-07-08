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
import { contactPageApi } from '../services/api';
import type { ContactPageDoc } from '../types/cms';

const emptyContactPage: Omit<ContactPageDoc, '_id'> = {
  heroTitle: '',
  heroDescription: '',
  departmentalContacts: [],
  formTitle: '',
  formInstructions: '',
  officeSectionTitle: '',
  officeSectionSubtitle: '',
  isActive: true,
};

export default function ContactPagePage() {
  const saveSection = useSectionSave();
  const [docId, setDocId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyContactPage);
  const [initialForm, setInitialForm] = useState(emptyContactPage);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initialForm), [form, initialForm]);
  useUnsavedChanges(isDirty);

  useEffect(() => {
    const load = async () => {
      try {
        const active = await contactPageApi.get();
        if (active) {
          const payload = {
            heroTitle: active.heroTitle || '',
            heroDescription: active.heroDescription || '',
            departmentalContacts: active.departmentalContacts || [],
            formTitle: active.formTitle || '',
            formInstructions: active.formInstructions || '',
            officeSectionTitle: active.officeSectionTitle || '',
            officeSectionSubtitle: active.officeSectionSubtitle || '',
            isActive: active.isActive !== false,
          };
          setDocId(active._id);
          setForm(payload);
          setInitialForm(payload);
        }
      } catch (error) {
        console.error('Failed to load contact page doc:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateContact = (index: number, field: 'label' | 'email' | 'description', value: string) => {
    const departmentalContacts = [...(form.departmentalContacts || [])];
    departmentalContacts[index] = { ...departmentalContacts[index], [field]: value };
    update('departmentalContacts', departmentalContacts);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection(async () => {
        if (docId) {
          await contactPageApi.update(docId, form);
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
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Contact Page Settings' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Contact Page Settings</h1>
          <p className="mt-1 text-sm text-slate-400">Configure contact landing copy, office sections, and team email routing channels.</p>
        </div>
        <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!isDirty} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Hero & Form Texts">
          <div className="space-y-4">
            <TextInput label="Hero Title" value={form.heroTitle || ''} onChange={(v) => update('heroTitle', v)} />
            <TextArea label="Hero Description" value={form.heroDescription || ''} onChange={(v) => update('heroDescription', v)} rows={3} />
            <TextInput label="Form Title" value={form.formTitle || ''} onChange={(v) => update('formTitle', v)} />
            <TextInput label="Form Instructions" value={form.formInstructions || ''} onChange={(v) => update('formInstructions', v)} />
          </div>
        </SectionCard>

        <SectionCard title="Offices Section Headers">
          <div className="space-y-4">
            <TextInput label="Office Section Title" value={form.officeSectionTitle || ''} onChange={(v) => update('officeSectionTitle', v)} />
            <TextArea label="Office Section Subtitle" value={form.officeSectionSubtitle || ''} onChange={(v) => update('officeSectionSubtitle', v)} rows={3} />
          </div>
        </SectionCard>

        <SectionCard
          title="Departmental Contact Channels"
          description="Specific direct routing email channels for media, support, partnerships, etc."
          actions={
            <button
              type="button"
              onClick={() => update('departmentalContacts', [...(form.departmentalContacts || []), { label: '', email: '', description: '' }])}
              className="admin-btn admin-btn-secondary"
            >
              <Plus size={16} />
              Add Channel
            </button>
          }
        >
          <ReorderList
            items={form.departmentalContacts || []}
            onChange={(contacts) => update('departmentalContacts', contacts)}
            getId={(item, index) => `contact-${index}`}
            renderItem={(item, index) => (
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_2fr_auto]">
                <TextInput label="Channel Name" value={item.label} onChange={(v) => updateContact(index, 'label', v)} />
                <TextInput label="Email Address" value={item.email} onChange={(v) => updateContact(index, 'email', v)} type="email" />
                <TextInput label="Description" value={item.description} onChange={(v) => updateContact(index, 'description', v)} />
                <button
                  type="button"
                  onClick={() => update('departmentalContacts', (form.departmentalContacts || []).filter((_, i) => i !== index))}
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
