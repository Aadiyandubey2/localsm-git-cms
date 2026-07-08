import React, { useEffect, useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ConfirmModal from '../components/common/ConfirmModal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionCard from '../components/common/SectionCard';
import SaveButton from '../components/forms/SaveButton';
import TextArea from '../components/forms/TextArea';
import TextInput from '../components/forms/TextInput';
import { useSectionSave } from '../hooks/useSectionSave';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { contactsApi, getActiveDoc, getApiErrorMessage, websiteSettingsApi } from '../services/api';
import type { ContactDoc, WebsiteSettingsDoc } from '../types/cms';

const emptySettings: Omit<WebsiteSettingsDoc, '_id'> = {
  siteName: 'LocalSM Limited',
  tagline: '',
  description: '',
  email: '',
  phone: '',
  address: '',
  isActive: true,
};

export default function ContactPage() {
  const saveSection = useSectionSave();
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [form, setForm] = useState(emptySettings);
  const [initialForm, setInitialForm] = useState(emptySettings);
  const [messages, setMessages] = useState<ContactDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ContactDoc | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initialForm), [form, initialForm]);
  useUnsavedChanges(isDirty);

  const loadData = async () => {
    const [settingsItems, contactItems] = await Promise.all([websiteSettingsApi.list(), contactsApi.list()]);
    const active = getActiveDoc(settingsItems);
    if (active) {
      const payload = {
        siteName: active.siteName,
        tagline: active.tagline || '',
        description: active.description || '',
        email: active.email || '',
        phone: active.phone || '',
        address: active.address || '',
        isActive: active.isActive !== false,
      };
      setSettingsId(active._id);
      setForm(payload);
      setInitialForm(payload);
    }
    setMessages(contactItems);
  };

  useEffect(() => {
    loadData().finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection(async () => {
        if (settingsId) {
          await websiteSettingsApi.update(settingsId, form);
        } else {
          const created = await websiteSettingsApi.create(form);
          setSettingsId(created._id);
        }
        setInitialForm(form);
      });
    } finally {
      setIsSaving(false);
    }
  };

  const markAsRead = async (message: ContactDoc) => {
    try {
      await contactsApi.update(message._id, { isRead: true, status: 'read' });
      await loadData();
      toast.success('Marked as read');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    setIsDeleting(true);
    try {
      await contactsApi.remove(deleteTarget._id);
      toast.success('Message deleted');
      setDeleteTarget(null);
      await loadData();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
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
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Contact' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Contact & Inbox</h1>
          <p className="mt-1 text-sm text-slate-400">Manage the public contact details and review form submissions.</p>
        </div>
        <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!isDirty} />
      </div>

      <SectionCard title="Company Contact Info">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Company Name" value={form.siteName} onChange={(v) => setForm((prev) => ({ ...prev, siteName: v }))} />
          <TextInput label="Heading" value={form.tagline || ''} onChange={(v) => setForm((prev) => ({ ...prev, tagline: v }))} />
          <TextInput label="Email" value={form.email || ''} onChange={(v) => setForm((prev) => ({ ...prev, email: v }))} type="email" />
          <TextInput label="Phone" value={form.phone || ''} onChange={(v) => setForm((prev) => ({ ...prev, phone: v }))} />
          <div className="md:col-span-2">
            <TextArea label="Description" value={form.description || ''} onChange={(v) => setForm((prev) => ({ ...prev, description: v }))} rows={4} />
          </div>
          <TextArea label="Address" value={form.address || ''} onChange={(v) => setForm((prev) => ({ ...prev, address: v }))} rows={3} />
        </div>
      </SectionCard>

      <SectionCard title="Contact Form Submissions" description={`${messages.length} total messages`}>
        <div className="space-y-3">
          {messages.length === 0 ? (
            <p className="text-sm text-slate-400">No contact submissions yet.</p>
          ) : (
            messages.map((message) => (
              <div key={message._id} className="rounded-lg border border-slate-700 bg-slate-900/40 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-100">
                      {message.name} <span className="text-slate-400">· {message.email}</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {message.subject || 'General'} · {new Date(message.createdAt || '').toLocaleString()}
                    </p>
                    <p className="mt-3 text-sm text-slate-300">{message.message}</p>
                  </div>
                  <div className="flex gap-2">
                    {!message.isRead ? (
                      <button type="button" onClick={() => markAsRead(message)} className="admin-btn admin-btn-secondary">
                        Mark Read
                      </button>
                    ) : null}
                    <button type="button" onClick={() => setDeleteTarget(message)} className="admin-btn admin-btn-danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SectionCard>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete message?"
        message="This contact submission will be permanently removed."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
