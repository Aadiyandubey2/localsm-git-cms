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
import ToggleSwitch from '../components/forms/ToggleSwitch';
import { useSectionSave } from '../hooks/useSectionSave';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { footerApi, getActiveDoc } from '../services/api';
import type { FooterDoc, FooterLink, SocialLink } from '../types/cms';

const emptyFooter: Omit<FooterDoc, '_id'> = {
  logo: '',
  description: '',
  links: [],
  socialLinks: [],
  copyrightText: '',
  isActive: true,
};

export default function FooterPage() {
  const saveSection = useSectionSave();
  const [docId, setDocId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyFooter);
  const [initialForm, setInitialForm] = useState(emptyFooter);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initialForm), [form, initialForm]);
  useUnsavedChanges(isDirty);

  useEffect(() => {
    const load = async () => {
      try {
        const items = await footerApi.list();
        const active = getActiveDoc(items);
        if (active) {
          const payload = {
            logo: active.logo || '',
            description: active.description || '',
            links: active.links || [],
            socialLinks: active.socialLinks || [],
            copyrightText: active.copyrightText || '',
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

  const updateLink = (index: number, field: keyof FooterLink, value: string) => {
    const links = [...(form.links || [])];
    links[index] = { ...links[index], [field]: value };
    setForm((prev) => ({ ...prev, links }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection(async () => {
        if (docId) {
          await footerApi.update(docId, form);
        } else {
          const created = await footerApi.create(form);
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
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Footer' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Footer Editor</h1>
          <p className="mt-1 text-sm text-slate-400">Edit footer description, links, and copyright text.</p>
        </div>
        <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!isDirty} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Footer Content">
          <div className="space-y-4">
            <ImageUploader label="Footer Logo" value={form.logo || ''} onChange={(v) => setForm((prev) => ({ ...prev, logo: v }))} />
            <TextArea label="Description" value={form.description || ''} onChange={(v) => setForm((prev) => ({ ...prev, description: v }))} rows={4} />
            <TextInput label="Copyright Text" value={form.copyrightText || ''} onChange={(v) => setForm((prev) => ({ ...prev, copyrightText: v }))} />
            <ToggleSwitch label="Footer active" checked={form.isActive !== false} onChange={(v) => setForm((prev) => ({ ...prev, isActive: v }))} />
          </div>
        </SectionCard>

        <SectionCard
          title="Footer Links"
          actions={
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, links: [...(prev.links || []), { label: 'New Link', href: '/' }] }))}
              className="admin-btn admin-btn-secondary"
            >
              <Plus size={16} />
              Add Link
            </button>
          }
        >
          <ReorderList
            items={form.links || []}
            onChange={(links) => setForm((prev) => ({ ...prev, links }))}
            getId={(item, index) => `${item.label}-${index}`}
            renderItem={(item, index) => (
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <TextInput label="Label" value={item.label} onChange={(v) => updateLink(index, 'label', v)} />
                <TextInput label="URL" value={item.href} onChange={(v) => updateLink(index, 'href', v)} />
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, links: (prev.links || []).filter((_, i) => i !== index) }))}
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
