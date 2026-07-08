import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionCard from '../components/common/SectionCard';
import ReorderList from '../components/forms/ReorderList';
import SaveButton from '../components/forms/SaveButton';
import TextArea from '../components/forms/TextArea';
import TextInput from '../components/forms/TextInput';
import ToggleSwitch from '../components/forms/ToggleSwitch';
import { useSectionSave } from '../hooks/useSectionSave';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { getActiveDoc, websiteSettingsApi } from '../services/api';
import type { SocialLink, WebsiteSettingsDoc } from '../types/cms';

const emptySettings: Omit<WebsiteSettingsDoc, '_id'> = {
  siteName: '',
  tagline: '',
  description: '',
  email: '',
  phone: '',
  address: '',
  socialLinks: [],
  seo: { title: '', description: '', keywords: [] },
  isActive: true,
};

export default function WebsiteSettingsPage() {
  const saveSection = useSectionSave();
  const [docId, setDocId] = useState<string | null>(null);
  const [form, setForm] = useState(emptySettings);
  const [initialForm, setInitialForm] = useState(emptySettings);
  const [keywordsText, setKeywordsText] = useState('');
  const [initialKeywordsText, setInitialKeywordsText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm) || keywordsText !== initialKeywordsText,
    [form, initialForm, keywordsText, initialKeywordsText]
  );
  useUnsavedChanges(isDirty);

  useEffect(() => {
    const load = async () => {
      try {
        const items = await websiteSettingsApi.list();
        const active = getActiveDoc(items);
        if (active) {
          const payload = {
            siteName: active.siteName,
            tagline: active.tagline || '',
            description: active.description || '',
            email: active.email || '',
            phone: active.phone || '',
            address: active.address || '',
            socialLinks: active.socialLinks || [],
            seo: {
              title: active.seo?.title || '',
              description: active.seo?.description || '',
              keywords: active.seo?.keywords || [],
            },
            isActive: active.isActive !== false,
          };
          const keywords = (active.seo?.keywords || []).join(', ');
          setDocId(active._id);
          setForm(payload);
          setInitialForm(payload);
          setKeywordsText(keywords);
          setInitialKeywordsText(keywords);
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

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const socialLinks = [...(form.socialLinks || [])];
    socialLinks[index] = { ...socialLinks[index], [field]: value };
    update('socialLinks', socialLinks);
  };

  const handleSave = async () => {
    if (!form.siteName.trim()) {
      return;
    }

    setIsSaving(true);
    const payload = {
      ...form,
      siteName: form.siteName.trim(),
      seo: {
        title: form.seo?.title || '',
        description: form.seo?.description || '',
        keywords: keywordsText
          .split(',')
          .map((keyword) => keyword.trim())
          .filter(Boolean),
      },
    };

    try {
      await saveSection(async () => {
        if (docId) {
          await websiteSettingsApi.update(docId, payload);
        } else {
          const created = await websiteSettingsApi.create(payload);
          setDocId(created._id);
        }
        setForm(payload);
        setInitialForm(payload);
        setInitialKeywordsText(keywordsText);
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
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Website Settings' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Website Settings</h1>
          <p className="mt-1 text-sm text-slate-400">Manage company identity, social links, and site-wide metadata.</p>
        </div>
        <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!isDirty || !form.siteName.trim()} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Company Information" description="Primary website and contact details used across the site.">
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Website Name" value={form.siteName} onChange={(v) => update('siteName', v)} required />
            <TextInput label="Heading / Tagline" value={form.tagline || ''} onChange={(v) => update('tagline', v)} />
            <div className="md:col-span-2">
              <TextArea label="Description" value={form.description || ''} onChange={(v) => update('description', v)} rows={4} />
            </div>
            <TextInput label="Email" value={form.email || ''} onChange={(v) => update('email', v)} type="email" />
            <TextInput label="Phone" value={form.phone || ''} onChange={(v) => update('phone', v)} />
            <div className="md:col-span-2">
              <TextArea label="Address" value={form.address || ''} onChange={(v) => update('address', v)} rows={3} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="SEO & Status" description="Search metadata and global site visibility.">
          <div className="space-y-4">
            <TextInput label="Site Title" value={form.seo?.title || ''} onChange={(v) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, title: v } }))} />
            <TextArea
              label="Meta Description"
              value={form.seo?.description || ''}
              onChange={(v) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, description: v } }))}
              rows={4}
            />
            <TextInput
              label="Keywords"
              value={keywordsText}
              onChange={setKeywordsText}
              hint="Comma-separated keywords"
            />
            <ToggleSwitch label="Website active" checked={form.isActive !== false} onChange={(v) => update('isActive', v)} />
          </div>
        </SectionCard>

        <SectionCard
          title="Social Links"
          description="Add the profiles shown in the footer and across the site."
          actions={
            <button
              type="button"
              onClick={() => update('socialLinks', [...(form.socialLinks || []), { platform: 'LinkedIn', url: '' }])}
              className="admin-btn admin-btn-secondary"
            >
              <Plus size={16} />
              Add Link
            </button>
          }
        >
          <ReorderList
            items={form.socialLinks || []}
            onChange={(socialLinks) => update('socialLinks', socialLinks)}
            getId={(item, index) => `social-${item.platform}-${index}`}
            renderItem={(item, index) => (
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <TextInput label="Platform" value={item.platform} onChange={(v) => updateSocialLink(index, 'platform', v)} />
                <TextInput label="URL" value={item.url} onChange={(v) => updateSocialLink(index, 'url', v)} />
                <button
                  type="button"
                  onClick={() => update('socialLinks', (form.socialLinks || []).filter((_, i) => i !== index))}
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