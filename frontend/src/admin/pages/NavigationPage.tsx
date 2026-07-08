import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionCard from '../components/common/SectionCard';
import ImageUploader from '../components/forms/ImageUploader';
import ReorderList from '../components/forms/ReorderList';
import SaveButton from '../components/forms/SaveButton';
import TextInput from '../components/forms/TextInput';
import ToggleSwitch from '../components/forms/ToggleSwitch';
import { useSectionSave } from '../hooks/useSectionSave';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { getActiveDoc, navigationApi } from '../services/api';
import type { NavigationDoc, NavigationItem } from '../types/cms';

const emptyNav: Omit<NavigationDoc, '_id'> = {
  logo: '',
  menuItems: [],
  ctaLabel: '',
  ctaHref: '',
  isActive: true,
};

export default function NavigationPage() {
  const saveSection = useSectionSave();
  const [docId, setDocId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyNav);
  const [initialForm, setInitialForm] = useState(emptyNav);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initialForm), [form, initialForm]);
  useUnsavedChanges(isDirty);

  useEffect(() => {
    const load = async () => {
      try {
        const items = await navigationApi.list();
        const active = getActiveDoc(items);
        if (active) {
          const payload = {
            logo: active.logo || '',
            menuItems: active.menuItems || [],
            ctaLabel: active.ctaLabel || '',
            ctaHref: active.ctaHref || '',
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

  const updateMenuItem = (index: number, field: keyof NavigationItem, value: string) => {
    const menuItems = [...form.menuItems];
    menuItems[index] = { ...menuItems[index], [field]: value };
    setForm((prev) => ({ ...prev, menuItems }));
  };

  const addMenuItem = () => {
    setForm((prev) => ({
      ...prev,
      menuItems: [...prev.menuItems, { label: 'New Link', href: '/' }],
    }));
  };

  const removeMenuItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      menuItems: prev.menuItems.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection(async () => {
        if (docId) {
          await navigationApi.update(docId, form);
        } else {
          const created = await navigationApi.create(form);
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
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Navigation' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Navigation Manager</h1>
          <p className="mt-1 text-sm text-slate-400">Rename, reorder, add, or remove menu items.</p>
        </div>
        <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!isDirty} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Logo & Settings">
          <div className="space-y-4">
            <ImageUploader label="Logo" value={form.logo || ''} onChange={(v) => setForm((prev) => ({ ...prev, logo: v }))} />
            <TextInput label="CTA Label" value={form.ctaLabel || ''} onChange={(v) => setForm((prev) => ({ ...prev, ctaLabel: v }))} />
            <TextInput label="CTA Link" value={form.ctaHref || ''} onChange={(v) => setForm((prev) => ({ ...prev, ctaHref: v }))} />
            <ToggleSwitch
              label="Navigation active"
              checked={form.isActive !== false}
              onChange={(v) => setForm((prev) => ({ ...prev, isActive: v }))}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Menu Items"
          actions={
            <button type="button" onClick={addMenuItem} className="admin-btn admin-btn-secondary">
              <Plus size={16} />
              Add Item
            </button>
          }
        >
          <ReorderList
            items={form.menuItems}
            onChange={(menuItems) => setForm((prev) => ({ ...prev, menuItems }))}
            getId={(item, index) => `${item.label}-${index}`}
            renderItem={(item, index) => (
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <TextInput label="Label" value={item.label} onChange={(v) => updateMenuItem(index, 'label', v)} />
                <TextInput label="Link" value={item.href} onChange={(v) => updateMenuItem(index, 'href', v)} />
                <button type="button" onClick={() => removeMenuItem(index)} className="admin-btn admin-btn-danger mt-6">
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
