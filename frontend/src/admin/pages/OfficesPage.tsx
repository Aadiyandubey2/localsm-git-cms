import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ConfirmModal from '../components/common/ConfirmModal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionCard from '../components/common/SectionCard';
import ReorderList from '../components/forms/ReorderList';
import SaveButton from '../components/forms/SaveButton';
import TextArea from '../components/forms/TextArea';
import TextInput from '../components/forms/TextInput';
import ToggleSwitch from '../components/forms/ToggleSwitch';
import { useSectionSave } from '../hooks/useSectionSave';
import { officesApi, getApiErrorMessage } from '../services/api';
import type { OfficeDoc } from '../types/cms';

const emptyOffice = (): Omit<OfficeDoc, '_id'> => ({
  city: '',
  address: '',
  phone: '',
  isActive: true,
  sortOrder: 0,
});

export default function OfficesPage() {
  const saveSection = useSectionSave();
  const [offices, setOffices] = useState<OfficeDoc[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyOffice());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<OfficeDoc | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const selected = offices.find((item) => item._id === selectedId) || null;

  const loadOffices = async () => {
    const items = await officesApi.list();
    const sorted = [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    setOffices(sorted);
    if (!selectedId && sorted[0]) {
      selectOffice(sorted[0]);
    }
  };

  const selectOffice = (office: OfficeDoc) => {
    setSelectedId(office._id);
    setForm({
      city: office.city,
      address: office.address || '',
      phone: office.phone || '',
      isActive: office.isActive !== false,
      sortOrder: office.sortOrder ?? 0,
    });
  };

  useEffect(() => {
    loadOffices().finally(() => setIsLoading(false));
  }, []);

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
        await officesApi.update(selectedId, form);
        await loadOffices();
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      await saveSection(async () => {
        const created = await officesApi.create({
          ...emptyOffice(),
          city: 'New Office Location',
          sortOrder: offices.length,
        });
        await loadOffices();
        selectOffice(created);
      }, 'Office created');
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
      await officesApi.remove(deleteTarget._id);
      toast.success('Office deleted');
      setDeleteTarget(null);
      setSelectedId(null);
      await loadOffices();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to delete office'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorder = async (items: OfficeDoc[]) => {
    setOffices(items);
    try {
      await officesApi.reorder(items);
      toast.success('Order saved');
      await loadOffices();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to save order'));
      await loadOffices();
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Offices' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Offices Manager</h1>
          <p className="mt-1 text-sm text-slate-400">Add, edit, delete, and reorder office addresses shown on the Contact page.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">All Offices</h2>
            <button
              type="button"
              onClick={handleCreate}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus size={16} />
            </button>
          </div>

          <ReorderList
            items={offices}
            onChange={handleReorder}
            getId={(item) => item._id}
            renderItem={(item) => (
              <button
                type="button"
                onClick={() => selectOffice(item)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  item._id === selectedId
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="truncate">{item.city}</div>
                {item.phone && <div className="text-xs text-slate-400 mt-0.5 truncate">{item.phone}</div>}
              </button>
            )}
          />
        </div>

        <div>
          {selected ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-white">Edit Office</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(selected)}
                    className="admin-btn admin-btn-danger"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                  <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!form.city.trim()} />
                </div>
              </div>

              <SectionCard title="Office Location Details">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <TextInput label="City Name" value={form.city} onChange={(v) => update('city', v)} required />
                  </div>
                  <div className="md:col-span-2">
                    <TextArea label="Full Address" value={form.address || ''} onChange={(v) => update('address', v)} rows={4} required />
                  </div>
                  <TextInput label="Phone Number" value={form.phone || ''} onChange={(v) => update('phone', v)} />
                  <div>
                    <label className="admin-label">Sort Order</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={form.sortOrder}
                      onChange={(e) => update('sortOrder', parseInt(e.target.value, 10))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <ToggleSwitch label="Office active / visible" checked={form.isActive !== false} onChange={(v) => update('isActive', v)} />
                  </div>
                </div>
              </SectionCard>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-800 text-slate-500">
              No offices found. Click the plus button to create one.
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Office?"
        message={`Are you sure you want to delete the office location "${deleteTarget?.city}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
