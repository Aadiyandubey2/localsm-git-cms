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
import { impactPageApi } from '../services/api';
import type { ImpactPageDoc } from '../types/cms';

const emptyImpactPage: Omit<ImpactPageDoc, '_id'> = {
  heroTitle: '',
  heroDescription: '',
  metricsTitle: '',
  metricsSubtitle: '',
  metrics: [],
  initiativesTitle: '',
  initiativesSubtitle: '',
  initiatives: [],
  socialTitle: '',
  socialDescription: '',
  socialImage: '',
  socialImageAlt: '',
  isActive: true,
};

export default function ImpactPagePage() {
  const saveSection = useSectionSave();
  const [docId, setDocId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyImpactPage);
  const [initialForm, setInitialForm] = useState(emptyImpactPage);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initialForm), [form, initialForm]);
  useUnsavedChanges(isDirty);

  useEffect(() => {
    const load = async () => {
      try {
        const active = await impactPageApi.get();
        if (active) {
          const payload = {
            heroTitle: active.heroTitle || '',
            heroDescription: active.heroDescription || '',
            metricsTitle: active.metricsTitle || '',
            metricsSubtitle: active.metricsSubtitle || '',
            metrics: active.metrics || [],
            initiativesTitle: active.initiativesTitle || '',
            initiativesSubtitle: active.initiativesSubtitle || '',
            initiatives: active.initiatives || [],
            socialTitle: active.socialTitle || '',
            socialDescription: active.socialDescription || '',
            socialImage: active.socialImage || '',
            socialImageAlt: active.socialImageAlt || '',
            isActive: active.isActive !== false,
          };
          setDocId(active._id);
          setForm(payload);
          setInitialForm(payload);
        }
      } catch (error) {
        console.error('Failed to load impact page doc:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateMetric = (index: number, field: 'label' | 'value' | 'subText', value: string) => {
    const metrics = [...(form.metrics || [])];
    metrics[index] = { ...metrics[index], [field]: value };
    update('metrics', metrics);
  };

  const updateInitiative = (index: number, field: 'iconType' | 'title' | 'description', value: string) => {
    const initiatives = [...(form.initiatives || [])];
    initiatives[index] = { ...initiatives[index], [field]: value };
    update('initiatives', initiatives);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection(async () => {
        if (docId) {
          await impactPageApi.update(docId, form);
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
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Impact Page Settings' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Impact & Sustainability</h1>
          <p className="mt-1 text-sm text-slate-400">Configure ESG Factsheet metrics, environmental stewardship plans, and social welfare details.</p>
        </div>
        <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!isDirty} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Hero & Social Responsibility">
          <div className="space-y-4">
            <TextInput label="Hero Title" value={form.heroTitle || ''} onChange={(v) => update('heroTitle', v)} />
            <TextArea label="Hero Description" value={form.heroDescription || ''} onChange={(v) => update('heroDescription', v)} rows={3} />
            <TextInput label="Social Responsibility Title" value={form.socialTitle || ''} onChange={(v) => update('socialTitle', v)} />
            <TextArea label="Social Description Text" value={form.socialDescription || ''} onChange={(v) => update('socialDescription', v)} rows={6} hint="Separate paragraphs with double newlines." />
            <ImageUploader label="Social Responsibility Image" value={form.socialImage || ''} onChange={(v) => update('socialImage', v)} />
            <TextInput label="Social Image Alt Text" value={form.socialImageAlt || ''} onChange={(v) => update('socialImageAlt', v)} />
          </div>
        </SectionCard>

        <SectionCard
          title="ESG Progress Metrics"
          description="Manage key ESG indicators displayed on the dashboard."
          actions={
            <button
              type="button"
              onClick={() => update('metrics', [...(form.metrics || []), { label: '', value: '', subText: '' }])}
              className="admin-btn admin-btn-secondary"
            >
              <Plus size={16} />
              Add Metric
            </button>
          }
        >
          <div className="space-y-4">
            <TextInput label="Metrics Section Title" value={form.metricsTitle || ''} onChange={(v) => update('metricsTitle', v)} />
            <TextInput label="Metrics Section Subtitle" value={form.metricsSubtitle || ''} onChange={(v) => update('metricsSubtitle', v)} />
            <ReorderList
              items={form.metrics || []}
              onChange={(metrics) => update('metrics', metrics)}
              getId={(item, index) => `metric-${index}`}
              renderItem={(item, index) => (
                <div className="grid gap-3 sm:grid-cols-[2fr_1fr_2fr_auto]">
                  <TextInput label="Label / Indicator" value={item.label} onChange={(v) => updateMetric(index, 'label', v)} />
                  <TextInput label="Value" value={item.value} onChange={(v) => updateMetric(index, 'value', v)} />
                  <TextInput label="Subtext" value={item.subText} onChange={(v) => updateMetric(index, 'subText', v)} />
                  <button
                    type="button"
                    onClick={() => update('metrics', (form.metrics || []).filter((_, i) => i !== index))}
                    className="admin-btn admin-btn-danger mt-6"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Stewardship Initiatives"
          description="Manage detailed environmental stewardship initiatives."
          actions={
            <button
              type="button"
              onClick={() => update('initiatives', [...(form.initiatives || []), { iconType: 'Leaf', title: '', description: '' }])}
              className="admin-btn admin-btn-secondary"
            >
              <Plus size={16} />
              Add Initiative
            </button>
          }
        >
          <div className="space-y-4">
            <TextInput label="Initiatives Section Title" value={form.initiativesTitle || ''} onChange={(v) => update('initiativesTitle', v)} />
            <TextInput label="Initiatives Section Subtitle" value={form.initiativesSubtitle || ''} onChange={(v) => update('initiativesSubtitle', v)} />
            <ReorderList
              items={form.initiatives || []}
              onChange={(items) => update('initiatives', items)}
              getId={(item, index) => `initiative-${index}`}
              renderItem={(item, index) => (
                <div className="grid gap-3 sm:grid-cols-[1fr_2fr_3fr_auto]">
                  <div>
                    <label className="admin-label">Icon</label>
                    <select
                      className="admin-input cursor-pointer"
                      value={item.iconType}
                      onChange={(e) => updateInitiative(index, 'iconType', e.target.value)}
                    >
                      <option value="Leaf">Leaf</option>
                      <option value="Shield">Shield</option>
                      <option value="Heart">Heart</option>
                    </select>
                  </div>
                  <TextInput label="Title" value={item.title} onChange={(v) => updateInitiative(index, 'title', v)} />
                  <TextInput label="Description" value={item.description} onChange={(v) => updateInitiative(index, 'description', v)} />
                  <button
                    type="button"
                    onClick={() => update('initiatives', (form.initiatives || []).filter((_, i) => i !== index))}
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
