import React, { useEffect, useMemo, useState } from 'react';
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
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { businessesApi, getApiErrorMessage } from '../services/api';
import type { BusinessDoc } from '../types/cms';

const emptyService = (): Omit<BusinessDoc, '_id'> => ({
  title: '',
  description: '',
  image: '',
  points: [],
  ctaText: '',
  ctaLink: '',
  isActive: true,
  sortOrder: 0,
});

export default function ServicesPage() {
  const saveSection = useSectionSave();
  const [services, setServices] = useState<BusinessDoc[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyService());
  const [initialForm, setInitialForm] = useState(emptyService());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BusinessDoc | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const selected = services.find((item) => item._id === selectedId) || null;

  const loadServices = async () => {
    const items = await businessesApi.list();
    const sorted = [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    setServices(sorted);
    if (!selectedId && sorted[0]) {
      selectService(sorted[0]);
    }
  };

  const selectService = (service: BusinessDoc) => {
    setSelectedId(service._id);
    const payload = {
      title: service.title,
      description: service.description || '',
      image: service.image || '',
      points: service.points || [],
      ctaText: service.ctaText || '',
      ctaLink: service.ctaLink || '',
      isActive: service.isActive !== false,
      sortOrder: service.sortOrder ?? 0,
    };
    setForm(payload);
    setInitialForm(payload);
  };

  useEffect(() => {
    loadServices().finally(() => setIsLoading(false));
  }, []);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initialForm), [form, initialForm]);
  useUnsavedChanges(isDirty);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!selectedId) {
      return;
    }

    setIsSaving(true);
    try {
      await saveSection(async () => {
        const selectedDoc = selected;
        const payload = {
          ...(selectedDoc || emptyService()),
          ...form,
          title: form.title.trim(),
        };
        await businessesApi.update(selectedId, payload);
        await loadServices();
        setInitialForm(form);
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
          ...emptyService(),
          title: 'New Service',
          sortOrder: services.length,
        });
        await loadServices();
        selectService(created);
      }, 'Service created');
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
      toast.success('Service deleted');
      setDeleteTarget(null);
      setSelectedId(null);
      await loadServices();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to delete service'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorder = async (items: BusinessDoc[]) => {
    setServices(items);
    try {
      await businessesApi.reorder(items);
      toast.success('Order saved');
      await loadServices();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to save order'));
      await loadServices();
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Services' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Services Manager</h1>
          <p className="mt-1 text-sm text-slate-400">Manage service cards with drag-and-drop ordering.</p>
        </div>
        <button type="button" onClick={handleCreate} className="admin-btn admin-btn-primary">
          <Plus size={16} />
          Add Service
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <SectionCard title="All Services" description="Drag to reorder. Click to edit.">
          <ReorderList
            items={services}
            onChange={handleReorder}
            getId={(item) => item._id}
            renderItem={(item) => (
              <button
                type="button"
                onClick={() => selectService(item)}
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
                  <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!isDirty} />
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
                  label="Order"
                  value={String(form.sortOrder ?? 0)}
                  onChange={(v) => update('sortOrder', Number.parseInt(v || '0', 10) || 0)}
                  type="number"
                />
                <div className="lg:col-span-2">
                  <TextArea label="Description" value={form.description || ''} onChange={(v) => update('description', v)} rows={4} />
                </div>
                <div className="lg:col-span-2">
                  <ImageUploader label="Service Image" value={form.image || ''} onChange={(v) => update('image', v)} />
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
                  <h3 className="text-lg font-medium text-white">{form.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{form.description}</p>
                </div>
              </div>
            </SectionCard>
          </div>
        ) : (
          <SectionCard title="Select a service">
            <p className="text-sm text-slate-400">Choose a service from the list or create a new one.</p>
          </SectionCard>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete service?"
        message={`This will permanently remove "${deleteTarget?.title}".`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}