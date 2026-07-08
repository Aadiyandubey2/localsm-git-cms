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
import { boardMembersApi, getApiErrorMessage } from '../services/api';
import type { BoardMemberDoc } from '../types/cms';

const emptyBoardMember = (): Omit<BoardMemberDoc, '_id'> => ({
  name: '',
  role: '',
  bio: '',
  isActive: true,
  sortOrder: 0,
});

export default function BoardMembersPage() {
  const saveSection = useSectionSave();
  const [members, setMembers] = useState<BoardMemberDoc[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyBoardMember());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BoardMemberDoc | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const selected = members.find((item) => item._id === selectedId) || null;

  const loadMembers = async () => {
    const items = await boardMembersApi.list();
    const sorted = [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    setMembers(sorted);
    if (!selectedId && sorted[0]) {
      selectMember(sorted[0]);
    }
  };

  const selectMember = (member: BoardMemberDoc) => {
    setSelectedId(member._id);
    setForm({
      name: member.name,
      role: member.role || '',
      bio: member.bio || '',
      isActive: member.isActive !== false,
      sortOrder: member.sortOrder ?? 0,
    });
  };

  useEffect(() => {
    loadMembers().finally(() => setIsLoading(false));
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
        await boardMembersApi.update(selectedId, form);
        await loadMembers();
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      await saveSection(async () => {
        const created = await boardMembersApi.create({
          ...emptyBoardMember(),
          name: 'New Board Director',
          role: 'Independent Director',
          sortOrder: members.length,
        });
        await loadMembers();
        selectMember(created);
      }, 'Director created');
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
      await boardMembersApi.remove(deleteTarget._id);
      toast.success('Director deleted');
      setDeleteTarget(null);
      setSelectedId(null);
      await loadMembers();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to delete director'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorder = async (items: BoardMemberDoc[]) => {
    setMembers(items);
    try {
      await boardMembersApi.reorder(items);
      toast.success('Order saved');
      await loadMembers();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to save order'));
      await loadMembers();
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Board of Directors' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Board Members</h1>
          <p className="mt-1 text-sm text-slate-400">Manage names, roles, and profiles of corporate governance directors shown on the Investors page.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">All Directors</h2>
            <button
              type="button"
              onClick={handleCreate}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus size={16} />
            </button>
          </div>

          <ReorderList
            items={members}
            onChange={handleReorder}
            getId={(item) => item._id}
            renderItem={(item) => (
              <button
                type="button"
                onClick={() => selectMember(item)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  item._id === selectedId
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="truncate">{item.name}</div>
                {item.role && <div className="text-xs text-slate-400 mt-0.5 truncate">{item.role}</div>}
              </button>
            )}
          />
        </div>

        <div>
          {selected ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-white">Edit Board Director</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(selected)}
                    className="admin-btn admin-btn-danger"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                  <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!form.name.trim()} />
                </div>
              </div>

              <SectionCard title="Director Information">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <TextInput label="Director Name" value={form.name} onChange={(v) => update('name', v)} required />
                  </div>
                  <div className="md:col-span-2">
                    <TextInput label="Corporate Governance Role / Title" value={form.role} onChange={(v) => update('role', v)} required placeholder="e.g. Lead Independent Director" />
                  </div>
                  <div className="md:col-span-2">
                    <TextArea label="Biography" value={form.bio || ''} onChange={(v) => update('bio', v)} rows={5} />
                  </div>
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
                    <ToggleSwitch label="Director active / visible" checked={form.isActive !== false} onChange={(v) => update('isActive', v)} />
                  </div>
                </div>
              </SectionCard>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-800 text-slate-500">
              No directors found. Click the plus button to create one.
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Director?"
        message={`Are you sure you want to delete director "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
