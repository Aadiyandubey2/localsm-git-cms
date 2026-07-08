import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionCard from '../components/common/SectionCard';
import ImageUploader from '../components/forms/ImageUploader';
import SaveButton from '../components/forms/SaveButton';
import TextArea from '../components/forms/TextArea';
import TextInput from '../components/forms/TextInput';
import { useSectionSave } from '../hooks/useSectionSave';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { brandingApi } from '../services/api';
import { getActiveDoc, websiteSettingsApi } from '../services/api';
import type { BrandingDoc, WebsiteSettingsDoc } from '../types/cms';

const emptySeo: Omit<WebsiteSettingsDoc, '_id'> = {
  siteName: 'LocalSM Limited',
  seo: { title: '', description: '', keywords: [] },
  isActive: true,
};

export default function SeoPage() {
  const saveSection = useSectionSave();
  const [docId, setDocId] = useState<string | null>(null);
  const [brandingId, setBrandingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptySeo);
  const [initialForm, setInitialForm] = useState(emptySeo);
  const [favicon, setFavicon] = useState('');
  const [initialFavicon, setInitialFavicon] = useState('');
  const [keywordsText, setKeywordsText] = useState('');
  const [initialKeywordsText, setInitialKeywordsText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm) || keywordsText !== initialKeywordsText || favicon !== initialFavicon,
    [form, initialForm, keywordsText, initialKeywordsText, favicon, initialFavicon]
  );
  useUnsavedChanges(isDirty);

  useEffect(() => {
    const load = async () => {
      try {
        const [settingsItems, brandingItems] = await Promise.all([websiteSettingsApi.list(), brandingApi.list()]);
        const active = getActiveDoc(settingsItems);
        const branding = getActiveDoc(brandingItems);
        if (active) {
          const payload = {
            siteName: active.siteName,
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
        if (branding) {
          setBrandingId(branding._id);
          setFavicon(branding.favicon || '');
          setInitialFavicon(branding.favicon || '');
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      ...form,
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
        if (brandingId) {
          await brandingApi.update(brandingId, { favicon } as Partial<BrandingDoc>);
        }
        setForm(payload);
        setInitialForm(payload);
        setInitialKeywordsText(keywordsText);
        setInitialFavicon(favicon);
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
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'SEO' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">SEO Settings</h1>
          <p className="mt-1 text-sm text-slate-400">Search engine title, description, and keywords.</p>
        </div>
        <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!isDirty} />
      </div>

      <SectionCard title="Search Metadata">
        <div className="space-y-4 max-w-3xl">
          <TextInput
            label="Site Title"
            value={form.seo?.title || ''}
            onChange={(v) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, title: v } }))}
          />
          <TextArea
            label="SEO Description"
            value={form.seo?.description || ''}
            onChange={(v) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, description: v } }))}
            rows={4}
          />
          <TextInput
            label="Keywords"
            value={keywordsText}
            onChange={setKeywordsText}
            hint="Comma-separated keywords, e.g. LocalSM, delivery, commerce"
          />
          <ImageUploader label="Favicon" value={favicon} onChange={setFavicon} />
        </div>
      </SectionCard>
    </div>
  );
}
