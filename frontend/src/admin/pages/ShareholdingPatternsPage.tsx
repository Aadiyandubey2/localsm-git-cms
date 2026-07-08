import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ConfirmModal from '../components/common/ConfirmModal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionCard from '../components/common/SectionCard';
import ReorderList from '../components/forms/ReorderList';
import SaveButton from '../components/forms/SaveButton';
import TextInput from '../components/forms/TextInput';
import ToggleSwitch from '../components/forms/ToggleSwitch';
import { useSectionSave } from '../hooks/useSectionSave';
import { shareholdingPatternsApi, getApiErrorMessage } from '../services/api';
import type { ShareholdingPatternDoc } from '../types/cms';

const emptyPattern = (): Omit<ShareholdingPatternDoc, '_id'> => ({
  category: '',
  percentage: '',
  isActive: true,
  sortOrder: 0,
});

export default function ShareholdingPatternsPage() {
  const saveSection = useSectionSave();
  const [patterns, setPatterns] = useState<ShareholdingPatternDoc[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyPattern());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ShareholdingPatternDoc | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const selected = patterns.find((item) => item._id === selectedId) || null;

  const loadPatterns = async () => {
    const items = await shareholdingPatternsApi.list();
    const sorted = [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    setPatterns(sorted);
    if (!selectedId && sorted[0]) {
      selectPattern(sorted[0]);
    }
  };

  const selectPattern = (pattern: ShareholdingPatternDoc) => {
    setSelectedId(pattern._id);
    setForm({
      category: pattern.category,
      percentage: pattern.percentage || '',
      isActive: pattern.isActive !== false,
      sortOrder: pattern.sortOrder ?? 0,
    });
  };

  useEffect(() => {
    loadPatterns().finally(() => setIsLoading(false));
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
        await shareholdingPatternsApi.update(selectedId, form);
        await loadPatterns();
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      await saveSection(async () => {
        const created = await shareholdingPatternsApi.create({
          ...emptyPattern(),
          category: 'New Shareholder Category',
          percentage: '0%',
          sortOrder: patterns.length,
        });
        await loadPatterns();
        selectPattern(created);
      }, 'Category created');
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
      await shareholdingPatternsApi.remove(deleteTarget._id);
      toast.success('Category deleted');
      setDeleteTarget(null);
      setSelectedId(null);
      await loadPatterns();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to delete category'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorder = async (items: ShareholdingPatternDoc[]) => {
    setPatterns(items);
    try {
      await shareholdingPatternsApi.reorder(items);
      toast.success('Order saved');
      await loadPatterns();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to save order'));
      await loadPatterns();
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Shareholding Patterns' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Ownership Structure</h1>
          <p className="mt-1 text-sm text-slate-400">Manage categories and percentages for the shareholding pattern chart on the Investors page.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">All Categories</h2>
            <button
              type="button"
              onClick={handleCreate}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus size={16} />
            </button>
          </div>

          <ReorderList
            items={patterns}
            onChange={handleReorder}
            getId={(item) => item._id}
            renderItem={(item) => (
              <button
                type="button"
                onClick={() => selectPattern(item)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  item._id === selectedId
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="truncate">{item.category}</div>
                {item.percentage && <div className="text-xs text-slate-400 mt-0.5 truncate">{item.percentage}</div>}
              </button>
            )}
          />
        </div>

        <div>
          {selected ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-white">Edit Category Details</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(selected)}
                    className="admin-btn admin-btn-danger"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                  <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!form.category.trim()} />
                </div>
              </div>

              <SectionCard title="Category Information">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <TextInput label="Category Name" value={form.category} onChange={(v) => update('category', v)} required placeholder="e.g. Foreign Institutional Investors (FII)" />
                  </div>
                  <TextInput label="Percentage (e.g. 38.2%)" value={form.percentage} onChange={(v) => update('percentage', v)} required />
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
                    <ToggleSwitch label="Category active / visible" checked={form.isActive !== false} onChange={(v) => update('isActive', v)} />
                  </div>
                </div>
              </SectionCard>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-800 text-slate-500">
              No categories found. Click the plus button to create one.
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Shareholder Category?"
        message={`Are you sure you want to delete the category "${deleteTarget?.category}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
