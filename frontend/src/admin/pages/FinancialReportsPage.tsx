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
import { financialReportsApi, getApiErrorMessage } from '../services/api';
import type { FinancialReportDoc } from '../types/cms';

const emptyReport = (): Omit<FinancialReportDoc, '_id'> => ({
  period: '',
  revenue: '',
  growth: '',
  profit: '',
  isActive: true,
  sortOrder: 0,
});

export default function FinancialReportsPage() {
  const saveSection = useSectionSave();
  const [reports, setReports] = useState<FinancialReportDoc[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyReport());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FinancialReportDoc | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const selected = reports.find((item) => item._id === selectedId) || null;

  const loadReports = async () => {
    const items = await financialReportsApi.list();
    const sorted = [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    setReports(sorted);
    if (!selectedId && sorted[0]) {
      selectReport(sorted[0]);
    }
  };

  const selectReport = (report: FinancialReportDoc) => {
    setSelectedId(report._id);
    setForm({
      period: report.period,
      revenue: report.revenue || '',
      growth: report.growth || '',
      profit: report.profit || '',
      isActive: report.isActive !== false,
      sortOrder: report.sortOrder ?? 0,
    });
  };

  useEffect(() => {
    loadReports().finally(() => setIsLoading(false));
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
        await financialReportsApi.update(selectedId, form);
        await loadReports();
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      await saveSection(async () => {
        const created = await financialReportsApi.create({
          ...emptyReport(),
          period: 'New Fiscal Quarter / Annual Report',
          sortOrder: reports.length,
        });
        await loadReports();
        selectReport(created);
      }, 'Report created');
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
      await financialReportsApi.remove(deleteTarget._id);
      toast.success('Report deleted');
      setDeleteTarget(null);
      setSelectedId(null);
      await loadReports();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to delete report'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorder = async (items: FinancialReportDoc[]) => {
    setReports(items);
    try {
      await financialReportsApi.reorder(items);
      toast.success('Order saved');
      await loadReports();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to save order'));
      await loadReports();
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Financial Performance' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Financial Results</h1>
          <p className="mt-1 text-sm text-slate-400">Manage quarterly and annual reports shown in the Investors section.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">All Reports</h2>
            <button
              type="button"
              onClick={handleCreate}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus size={16} />
            </button>
          </div>

          <ReorderList
            items={reports}
            onChange={handleReorder}
            getId={(item) => item._id}
            renderItem={(item) => (
              <button
                type="button"
                onClick={() => selectReport(item)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  item._id === selectedId
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="truncate">{item.period}</div>
                {item.revenue && <div className="text-xs text-slate-400 mt-0.5 truncate">{item.revenue} &bull; {item.growth}</div>}
              </button>
            )}
          />
        </div>

        <div>
          {selected ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-white">Edit Report Details</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(selected)}
                    className="admin-btn admin-btn-danger"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                  <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!form.period.trim()} />
                </div>
              </div>

              <SectionCard title="Report Information">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <TextInput label="Reporting Period (e.g. Q3 FY26)" value={form.period} onChange={(v) => update('period', v)} required />
                  </div>
                  <TextInput label="Revenue (e.g. ₹4,820 Cr)" value={form.revenue} onChange={(v) => update('revenue', v)} />
                  <TextInput label="YoY Growth (e.g. +32% YoY)" value={form.growth} onChange={(v) => update('growth', v)} />
                  <TextInput label="Adjusted EBITDA / Profit (e.g. ₹285 Cr)" value={form.profit} onChange={(v) => update('profit', v)} />
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
                    <ToggleSwitch label="Report active / visible" checked={form.isActive !== false} onChange={(v) => update('isActive', v)} />
                  </div>
                </div>
              </SectionCard>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-800 text-slate-500">
              No reports found. Click the plus button to create one.
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Financial Report?"
        message={`Are you sure you want to delete the financial report for "${deleteTarget?.period}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
