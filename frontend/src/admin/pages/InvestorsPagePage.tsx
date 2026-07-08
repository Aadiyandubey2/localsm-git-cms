import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionCard from '../components/common/SectionCard';
import SaveButton from '../components/forms/SaveButton';
import TextArea from '../components/forms/TextArea';
import TextInput from '../components/forms/TextInput';
import { useSectionSave } from '../hooks/useSectionSave';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { investorsPageApi } from '../services/api';
import type { InvestorsPageDoc } from '../types/cms';

const emptyInvestorsPage: Omit<InvestorsPageDoc, '_id'> = {
  heroTitle: '',
  heroDescription: '',
  stockSymbol: '',
  stockIsin: '',
  stockBasePrice: 0,
  marketCap: '',
  peRatio: '',
  fiftyTwoWeekHigh: '',
  fiftyTwoWeekLow: '',
  ytdPerformance: '',
  chartStartDate: '',
  chartEndDate: '',
  isActive: true,
};

export default function InvestorsPagePage() {
  const saveSection = useSectionSave();
  const [docId, setDocId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyInvestorsPage);
  const [initialForm, setInitialForm] = useState(emptyInvestorsPage);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initialForm), [form, initialForm]);
  useUnsavedChanges(isDirty);

  useEffect(() => {
    const load = async () => {
      try {
        const active = await investorsPageApi.get();
        if (active) {
          const payload = {
            heroTitle: active.heroTitle || '',
            heroDescription: active.heroDescription || '',
            stockSymbol: active.stockSymbol || '',
            stockIsin: active.stockIsin || '',
            stockBasePrice: active.stockBasePrice || 0,
            marketCap: active.marketCap || '',
            peRatio: active.peRatio || '',
            fiftyTwoWeekHigh: active.fiftyTwoWeekHigh || '',
            fiftyTwoWeekLow: active.fiftyTwoWeekLow || '',
            ytdPerformance: active.ytdPerformance || '',
            chartStartDate: active.chartStartDate || '',
            chartEndDate: active.chartEndDate || '',
            isActive: active.isActive !== false,
          };
          setDocId(active._id);
          setForm(payload);
          setInitialForm(payload);
        }
      } catch (error) {
        console.error('Failed to load investors page doc:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection(async () => {
        if (docId) {
          await investorsPageApi.update(docId, form);
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
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Investors Page Settings' }]} />
          <h1 className="mt-2 text-2xl font-semibold text-white">Investor Relations Landing</h1>
          <p className="mt-1 text-sm text-slate-400">Configure corporate stock symbols, base prices, market cap, and performance summaries.</p>
        </div>
        <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!isDirty} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Hero copy">
          <div className="space-y-4">
            <TextInput label="Hero Title" value={form.heroTitle || ''} onChange={(v) => update('heroTitle', v)} />
            <TextArea label="Hero Description" value={form.heroDescription || ''} onChange={(v) => update('heroDescription', v)} rows={4} />
          </div>
        </SectionCard>

        <SectionCard title="Stock Quote Details">
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Stock Symbol (e.g. LOCALS)" value={form.stockSymbol || ''} onChange={(v) => update('stockSymbol', v)} />
            <TextInput label="ISIN Code (e.g. INE000001010)" value={form.stockIsin || ''} onChange={(v) => update('stockIsin', v)} />
            <div>
              <label className="admin-label">Base Simulation Price (₹)</label>
              <input
                type="number"
                step="0.01"
                className="admin-input"
                value={form.stockBasePrice}
                onChange={(e) => update('stockBasePrice', parseFloat(e.target.value))}
              />
            </div>
            <TextInput label="Market Capitalization" value={form.marketCap || ''} onChange={(v) => update('marketCap', v)} />
            <TextInput label="P/E Ratio" value={form.peRatio || ''} onChange={(v) => update('peRatio', v)} />
            <TextInput label="YTD Stock Performance (e.g. +84.5%)" value={form.ytdPerformance || ''} onChange={(v) => update('ytdPerformance', v)} />
            <TextInput label="52-Week High (₹)" value={form.fiftyTwoWeekHigh || ''} onChange={(v) => update('fiftyTwoWeekHigh', v)} />
            <TextInput label="52-Week Low (₹)" value={form.fiftyTwoWeekLow || ''} onChange={(v) => update('fiftyTwoWeekLow', v)} />
            <TextInput label="Chart Start Date (e.g. Feb 2025)" value={form.chartStartDate || ''} onChange={(v) => update('chartStartDate', v)} />
            <TextInput label="Chart End Date (e.g. Feb 2026)" value={form.chartEndDate || ''} onChange={(v) => update('chartEndDate', v)} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
