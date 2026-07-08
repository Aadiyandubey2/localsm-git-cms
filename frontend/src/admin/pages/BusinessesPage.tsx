import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ConfirmModal from '../components/common/ConfirmModal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionCard from '../components/common/SectionCard';
import ImageUploader from '../components/forms/ImageUploader';
import ReorderList from '../components/forms/ReorderList';
import SaveButton from '../components/forms/SaveButton';
import TextArea from '../components/forms/TextArea';
import TextInput from '../components/forms/TextInput';
import ToggleSwitch from '../components/forms/ToggleSwitch';
import { useSectionSave } from '../hooks/useSectionSave';
import { businessesApi, getApiErrorMessage } from '../services/api';
import type { BusinessDoc, BusinessPoint } from '../types/cms';

const emptyBusiness = (): Omit<BusinessDoc, '_id'> => ({
  title: '',
  description: '',
  image: '',
  points: [{ title: '', description: '' }],
  ctaText: 'Explore Platform',
  ctaLink: '#',
  isActive: true,
  sortOrder: 0,
});

export default function BusinessesPage() {
  const saveSection = useSectionSave();
  const [businesses, setBusinesses] = useState<BusinessDoc[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyBusiness());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BusinessDoc | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const selected = businesses.find((item) => item._id === selectedId) || null;

  const loadBusinesses = async () => {
    const items = await businessesApi.list();
    const sorted = [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    setBusinesses(sorted);
    if (!selectedId && sorted[0]) {
      selectBusiness(sorted[0]);
    }
  };

  const selectBusiness = (business: BusinessDoc) => {
    setSelectedId(business._id);
    setForm({
      title: business.title,
      description: business.description || '',
      image: business.image || '',
      points: business.points?.length ? business.points : [{ title: '', description: '' }],
      ctaText: business.ctaText || '',
      ctaLink: business.ctaLink || '#',
      isActive: business.isActive !== false,
      sortOrder: business.sortOrder ?? 0,
    });
  };

  useEffect(() => {
    loadBusinesses().finally(() => setIsLoading(false));
  }, []);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updatePoint = (index: number, field: keyof BusinessPoint, value: string) => {
    const points = [...(form.points || [])];
    points[index] = { ...points[index], [field]: value };
    update('points', points);
  };

  const handleSave = async () => {
    if (!selectedId) {
      return;
    }
    setIsSaving(true);
    try {
      await saveSection(async () => {
        await businessesApi.update(selectedId, form);
        await loadBusinesses();
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      await saveSection(async () => {
        const created = await businessesApi.create({
          ...emptyBusiness(),
          title: 'New Business',
          sortOrder: businesses.length,
        });
        await loadBusinesses();
        selectBusiness(created);
      }, 'Business created');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    setIsDeleting(true);
    try {
      await businessesApi.remove(deleteTarget._id);
      toast.success('Business deleted');
      setDeleteTarget(null);
      setSelectedId(null);
      await loadBusinesses();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to delete business'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorder = async (items: BusinessDoc[]) => {
    setBusinesses(items);
    try {
      await businessesApi.reorder(items);
      toast.success('Order saved');
      await loadBusinesses();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to save order'));
      await loadBusinesses();
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Businesses' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Businesses Manager</h1>
          <p className="mt-1 text-sm text-slate-400">Add, edit, delete, and reorder platform cards on the homepage.</p>
        </div>
        <button type="button" onClick={handleCreate} className="admin-btn admin-btn-primary">
          <Plus size={16} />
          Add Business
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <SectionCard title="All Businesses" description="Drag to reorder. Click to edit.">
          <ReorderList
            items={businesses}
            onChange={handleReorder}
            getId={(item) => item._id}
            renderItem={(item) => (
              <button
                type="button"
                onClick={() => selectBusiness(item)}
                className={`w-full text-left ${selected?._id === item._id ? 'text-blue-300' : 'text-slate-200'}`}
              >
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-slate-400">{item.isActive === false ? 'Hidden' : 'Visible'}</p>
              </button>
            )}
          />
        </SectionCard>

        {selected ? (
          <div className="space-y-6">
            <SectionCard
              title={`Edit: ${selected.title}`}
              actions={
                <>
                  <SaveButton onClick={handleSave} isSaving={isSaving} />
                  <button type="button" onClick={() => setDeleteTarget(selected)} className="admin-btn admin-btn-danger">
                    <Trash2 size={16} />
                    Delete
                  </button>
                </>
              }
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <TextInput label="Title" value={form.title} onChange={(v) => update('title', v)} required />
                <TextInput
                  label="Badge / Subtitle"
                  value={form.points?.[0]?.title || ''}
                  onChange={(v) => updatePoint(0, 'title', v)}
                  placeholder="Food & More"
                />
                <div className="lg:col-span-2">
                  <TextArea label="Description" value={form.description || ''} onChange={(v) => update('description', v)} rows={4} />
                </div>
                <TextInput label="Button Text" value={form.ctaText || ''} onChange={(v) => update('ctaText', v)} />
                <TextInput label="Button URL" value={form.ctaLink || ''} onChange={(v) => update('ctaLink', v)} />
                <div className="lg:col-span-2">
                  <ImageUploader label="Cover Image" value={form.image || ''} onChange={(v) => update('image', v)} />
                </div>
                <div className="lg:col-span-2">
                  <ToggleSwitch label="Show on website" checked={form.isActive !== false} onChange={(v) => update('isActive', v)} />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Preview">
              <div className="overflow-hidden rounded-xl border border-slate-700">
                {form.image ? <img src={form.image} alt={form.title} className="h-40 w-full object-cover" /> : null}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-medium text-white">{form.title}</h3>
                    {form.points?.[0]?.title ? (
                      <span className="rounded border border-blue-500 px-2 py-0.5 text-xs text-blue-300">
                        {form.points[0].title.toUpperCase()}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{form.description}</p>
                </div>
              </div>
            </SectionCard>
          </div>
        ) : (
          <SectionCard title="Select a business">
            <p className="text-sm text-slate-400">Choose a business from the list or create a new one.</p>
          </SectionCard>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete business?"
        message={`This will permanently remove "${deleteTarget?.title}".`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
