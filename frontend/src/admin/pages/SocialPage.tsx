import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionCard from '../components/common/SectionCard';
import ReorderList from '../components/forms/ReorderList';
import SaveButton from '../components/forms/SaveButton';
import TextInput from '../components/forms/TextInput';
import { useSectionSave } from '../hooks/useSectionSave';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { footerApi, getActiveDoc, websiteSettingsApi } from '../services/api';
import type { SocialLink } from '../types/cms';

export default function SocialPage() {
  const saveSection = useSectionSave();
  const [footerId, setFooterId] = useState<string | null>(null);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [footerLinks, setFooterLinks] = useState<SocialLink[]>([]);
  const [settingsLinks, setSettingsLinks] = useState<SocialLink[]>([]);
  const [initialSnapshot, setInitialSnapshot] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const snapshot = JSON.stringify({ footerLinks, settingsLinks });
  const isDirty = useMemo(() => snapshot !== initialSnapshot, [snapshot, initialSnapshot]);
  useUnsavedChanges(isDirty);

  useEffect(() => {
    const load = async () => {
      try {
        const [footerItems, settingsItems] = await Promise.all([footerApi.list(), websiteSettingsApi.list()]);
        const footer = getActiveDoc(footerItems);
        const settings = getActiveDoc(settingsItems);

        const footerSocial = footer?.socialLinks || [];
        const settingsSocial = settings?.socialLinks || [];

        setFooterId(footer?._id || null);
        setSettingsId(settings?._id || null);
        setFooterLinks(footerSocial);
        setSettingsLinks(settingsSocial);
        setInitialSnapshot(JSON.stringify({ footerLinks: footerSocial, settingsLinks: settingsSocial }));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const updateFooterLink = (index: number, field: keyof SocialLink, value: string) => {
    const links = [...footerLinks];
    links[index] = { ...links[index], [field]: value };
    setFooterLinks(links);
  };

  const updateSettingsLink = (index: number, field: keyof SocialLink, value: string) => {
    const links = [...settingsLinks];
    links[index] = { ...links[index], [field]: value };
    setSettingsLinks(links);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection(async () => {
        if (footerId) {
          await footerApi.update(footerId, { socialLinks: footerLinks });
        }
        if (settingsId) {
          await websiteSettingsApi.update(settingsId, { socialLinks: settingsLinks });
        }
        setInitialSnapshot(snapshot);
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
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Social Links' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Social Links</h1>
          <p className="mt-1 text-sm text-slate-400">Manage social media profiles shown across the website.</p>
        </div>
        <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!isDirty} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Footer Social Links"
          actions={
            <button
              type="button"
              onClick={() => setFooterLinks((prev) => [...prev, { platform: 'LinkedIn', url: '' }])}
              className="admin-btn admin-btn-secondary"
            >
              <Plus size={16} />
              Add
            </button>
          }
        >
          <ReorderList
            items={footerLinks}
            onChange={setFooterLinks}
            getId={(item, index) => `footer-${item.platform}-${index}`}
            renderItem={(item, index) => (
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <TextInput label="Platform" value={item.platform} onChange={(v) => updateFooterLink(index, 'platform', v)} />
                <TextInput label="URL" value={item.url} onChange={(v) => updateFooterLink(index, 'url', v)} />
                <button type="button" onClick={() => setFooterLinks((prev) => prev.filter((_, i) => i !== index))} className="admin-btn admin-btn-danger mt-6">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          />
        </SectionCard>

        <SectionCard
          title="Company Social Links"
          actions={
            <button
              type="button"
              onClick={() => setSettingsLinks((prev) => [...prev, { platform: 'Twitter', url: '' }])}
              className="admin-btn admin-btn-secondary"
            >
              <Plus size={16} />
              Add
            </button>
          }
        >
          <ReorderList
            items={settingsLinks}
            onChange={setSettingsLinks}
            getId={(item, index) => `settings-${item.platform}-${index}`}
            renderItem={(item, index) => (
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <TextInput label="Platform" value={item.platform} onChange={(v) => updateSettingsLink(index, 'platform', v)} />
                <TextInput label="URL" value={item.url} onChange={(v) => updateSettingsLink(index, 'url', v)} />
                <button type="button" onClick={() => setSettingsLinks((prev) => prev.filter((_, i) => i !== index))} className="admin-btn admin-btn-danger mt-6">
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
