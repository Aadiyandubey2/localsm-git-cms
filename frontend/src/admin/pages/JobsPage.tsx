import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ConfirmModal from '../components/common/ConfirmModal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionCard from '../components/common/SectionCard';
import SaveButton from '../components/forms/SaveButton';
import TextArea from '../components/forms/TextArea';
import TextInput from '../components/forms/TextInput';
import ToggleSwitch from '../components/forms/ToggleSwitch';
import { useSectionSave } from '../hooks/useSectionSave';
import { jobsApi, getApiErrorMessage } from '../services/api';
import type { JobDoc } from '../types/cms';

const emptyJob = (): Omit<JobDoc, '_id'> => ({
  title: '',
  department: '',
  location: '',
  type: 'Full-time',
  description: '',
  isActive: true,
});

export default function JobsPage() {
  const saveSection = useSectionSave();
  const [jobs, setJobs] = useState<JobDoc[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyJob());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<JobDoc | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const selected = jobs.find((item) => item._id === selectedId) || null;

  const loadJobs = async () => {
    const items = await jobsApi.list();
    setJobs(items);
    if (!selectedId && items[0]) {
      selectJob(items[0]);
    }
  };

  const selectJob = (job: JobDoc) => {
    setSelectedId(job._id);
    setForm({
      title: job.title,
      department: job.department || '',
      location: job.location || '',
      type: job.type || 'Full-time',
      description: job.description || '',
      isActive: job.isActive !== false,
    });
  };

  useEffect(() => {
    loadJobs().finally(() => setIsLoading(false));
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
        await jobsApi.update(selectedId, form);
        await loadJobs();
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      await saveSection(async () => {
        const created = await jobsApi.create({
          ...emptyJob(),
          title: 'New Position',
          department: 'Engineering',
          location: 'Gurugram',
        });
        await loadJobs();
        selectJob(created);
      }, 'Job created');
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
      await jobsApi.remove(deleteTarget._id);
      toast.success('Job deleted');
      setDeleteTarget(null);
      setSelectedId(null);
      await loadJobs();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to delete job'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Jobs' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Jobs Manager</h1>
          <p className="mt-1 text-sm text-slate-400">Create, edit, and delete job openings on the Careers page.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">All Openings</h2>
            <button
              type="button"
              onClick={handleCreate}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-1">
            {jobs.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => selectJob(item)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  item._id === selectedId
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="truncate">{item.title}</div>
                <div className="text-xs text-slate-400 mt-0.5 truncate">{item.department} &bull; {item.location}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          {selected ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-white">Edit Opening</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(selected)}
                    className="admin-btn admin-btn-danger"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                  <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!form.title.trim()} />
                </div>
              </div>

              <SectionCard title="Job Details">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextInput label="Job Title" value={form.title} onChange={(v) => update('title', v)} required />
                  <TextInput label="Department" value={form.department} onChange={(v) => update('department', v)} required placeholder="e.g. Engineering" />
                  <TextInput label="Location" value={form.location} onChange={(v) => update('location', v)} required placeholder="e.g. Gurugram" />
                  <div>
                    <label className="admin-label">Job Type</label>
                    <select
                      className="admin-input cursor-pointer"
                      value={form.type}
                      onChange={(e) => update('type', e.target.value)}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <TextArea label="Description" value={form.description || ''} onChange={(v) => update('description', v)} rows={5} />
                  </div>
                  <div className="md:col-span-2">
                    <ToggleSwitch label="Job active / visible" checked={form.isActive !== false} onChange={(v) => update('isActive', v)} />
                  </div>
                </div>
              </SectionCard>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-800 text-slate-500">
              No jobs found. Click the plus button to create one.
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Job Opening?"
        message={`Are you sure you want to delete the job opening for "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
