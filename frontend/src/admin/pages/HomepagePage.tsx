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
import { homepageApi } from '../services/api';
import type { HomepageDoc } from '../types/cms';

const emptyHomepage: Omit<HomepageDoc, '_id'> = {
  heroImageCaption: '',
  heroImageCode: '',
  founderTeaser: '',
  founderLetterDate: '',
  businessSectionSubtitle: '',
  visionTitle: '',
  visionDescription: '',
  missionTitle: '',
  missionDescription: '',
  impactMetrics: [],
  cultureTeaserSubtitle: '',
  cultureTeaserTitle: '',
  cultureTeaserDescription: '',
  cultureTeaserImage: '',
  isActive: true,
};

export default function HomepagePage() {
  const saveSection = useSectionSave();
  const [docId, setDocId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyHomepage);
  const [initialForm, setInitialForm] = useState(emptyHomepage);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initialForm), [form, initialForm]);
  useUnsavedChanges(isDirty);

  useEffect(() => {
    const load = async () => {
      try {
        const active = await homepageApi.get();
        if (active) {
          const payload = {
            heroImageCaption: active.heroImageCaption || '',
            heroImageCode: active.heroImageCode || '',
            founderTeaser: active.founderTeaser || '',
            founderLetterDate: active.founderLetterDate || '',
            businessSectionSubtitle: active.businessSectionSubtitle || '',
            visionTitle: active.visionTitle || '',
            visionDescription: active.visionDescription || '',
            missionTitle: active.missionTitle || '',
            missionDescription: active.missionDescription || '',
            impactMetrics: active.impactMetrics || [],
            cultureTeaserSubtitle: active.cultureTeaserSubtitle || '',
            cultureTeaserTitle: active.cultureTeaserTitle || '',
            cultureTeaserDescription: active.cultureTeaserDescription || '',
            cultureTeaserImage: active.cultureTeaserImage || '',
            isActive: active.isActive !== false,
          };
          setDocId(active._id);
          setForm(payload);
          setInitialForm(payload);
        }
      } catch (error) {
        console.error('Failed to load homepage doc:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateMetric = (index: number, field: 'category' | 'value' | 'description', value: string) => {
    const impactMetrics = [...(form.impactMetrics || [])];
    impactMetrics[index] = { ...impactMetrics[index], [field]: value };
    update('impactMetrics', impactMetrics);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection(async () => {
        if (docId) {
          await homepageApi.update(docId, form);
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
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Homepage Settings' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Homepage Sections</h1>
          <p className="mt-1 text-sm text-slate-400">Configure corporate sections, vision, mission, and home metrics.</p>
        </div>
        <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!isDirty} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Hero & Leadership Teaser">
          <div className="space-y-4">
            <TextInput label="Hero Image Code (e.g. HQ-01 // GURUGRAM)" value={form.heroImageCode || ''} onChange={(v) => update('heroImageCode', v)} />
            <TextInput label="Hero Image Caption" value={form.heroImageCaption || ''} onChange={(v) => update('heroImageCaption', v)} />
            <TextInput label="Founder Teaser Date" value={form.founderLetterDate || ''} onChange={(v) => update('founderLetterDate', v)} />
            <TextArea label="Founder Teaser Paragraph" value={form.founderTeaser || ''} onChange={(v) => update('founderTeaser', v)} rows={4} />
          </div>
        </SectionCard>

        <SectionCard title="Businesses & Culture Teaser">
          <div className="space-y-4">
            <TextInput label="Business Section Subtitle" value={form.businessSectionSubtitle || ''} onChange={(v) => update('businessSectionSubtitle', v)} />
            <TextInput label="Culture Teaser Subtitle" value={form.cultureTeaserSubtitle || ''} onChange={(v) => update('cultureTeaserSubtitle', v)} />
            <TextInput label="Culture Teaser Title" value={form.cultureTeaserTitle || ''} onChange={(v) => update('cultureTeaserTitle', v)} />
            <TextArea label="Culture Teaser Description" value={form.cultureTeaserDescription || ''} onChange={(v) => update('cultureTeaserDescription', v)} rows={3} />
            <ImageUploader label="Culture Teaser Image" value={form.cultureTeaserImage || ''} onChange={(v) => update('cultureTeaserImage', v)} />
          </div>
        </SectionCard>

        <SectionCard title="Vision & Mission">
          <div className="space-y-4">
            <TextInput label="Vision Title" value={form.visionTitle || ''} onChange={(v) => update('visionTitle', v)} />
            <TextArea label="Vision Description" value={form.visionDescription || ''} onChange={(v) => update('visionDescription', v)} rows={3} />
            <TextInput label="Mission Title" value={form.missionTitle || ''} onChange={(v) => update('missionTitle', v)} />
            <TextArea label="Mission Description" value={form.missionDescription || ''} onChange={(v) => update('missionDescription', v)} rows={3} />
          </div>
        </SectionCard>

        <SectionCard
          title="Impact Metrics"
          description="Highlight metrics displayed on the homepage."
          actions={
            <button
              type="button"
              onClick={() => update('impactMetrics', [...(form.impactMetrics || []), { category: '', value: '', description: '' }])}
              className="admin-btn admin-btn-secondary"
            >
              <Plus size={16} />
              Add Metric
            </button>
          }
        >
          <ReorderList
            items={form.impactMetrics || []}
            onChange={(metrics) => update('impactMetrics', metrics)}
            getId={(item, index) => `metric-${index}`}
            renderItem={(item, index) => (
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_2fr_auto]">
                <TextInput label="Category" value={item.category} onChange={(v) => updateMetric(index, 'category', v)} />
                <TextInput label="Value" value={item.value} onChange={(v) => updateMetric(index, 'value', v)} />
                <TextInput label="Description" value={item.description} onChange={(v) => updateMetric(index, 'description', v)} />
                <button
                  type="button"
                  onClick={() => update('impactMetrics', (form.impactMetrics || []).filter((_, i) => i !== index))}
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
