import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  fallbackBusinesses,
  fallbackFounder,
  getActiveBusinesses,
  getActiveDocument,
  type BusinessDocument,
  type FounderDocument,
} from '../api/cms';
import { FounderMessageContent } from '../utils/founderMessage';

export default function FounderLetter() {
  const [founder, setFounder] = useState<FounderDocument>(fallbackFounder);
  const [businesses, setBusinesses] = useState<BusinessDocument[]>(fallbackBusinesses);

  useEffect(() => {
    let isMounted = true;

    const loadFounderContent = async () => {
      try {
        const [founderDocument, businessDocuments] = await Promise.all([
          getActiveDocument<FounderDocument>('/founders'),
          getActiveBusinesses(),
        ]);

        if (!isMounted) {
          return;
        }

        if (founderDocument) {
          setFounder({ ...fallbackFounder, ...founderDocument });
        }

        if (businessDocuments.length > 0) {
          setBusinesses(businessDocuments);
        }
      } catch (error) {
        console.error('Failed to load founder letter content:', error);
      }
    };

    loadFounderContent();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-[#f4f4f4] min-h-screen text-black font-sans pt-32 pb-20 selection:bg-[#0055ff]/10 selection:text-black">
      <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-12">
        {/* Back link */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-black/50 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} /> Back to Homepage
          </Link>
        </div>

        {/* Letter Header */}
        <div className="space-y-6 border-b border-black/10 pb-8">
          <div className="inline-block border-b border-[#0055ff] pb-1.5">
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-black/60">
              Founder’s Statement
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">
            A note from our Founder, {founder.name}.
          </h1>
          <div className="flex justify-between items-center text-xs font-mono text-black/40 pt-4">
            <span>DATE: 6 FEBRUARY 2026</span>
            <span>READ TIME: 6 MINS</span>
          </div>
        </div>

        {/* Letter Body */}
        <div className="space-y-8 text-base md:text-lg text-black/80 font-light leading-relaxed">
          {founder.message ? (
            <FounderMessageContent
              message={founder.message}
              businesses={businesses}
              founderName={founder.name}
              founderTitle={founder.title || 'Founder & CEO'}
            />
          ) : null}

          <div className="pt-12 space-y-2">
            <p className="font-mono text-xs uppercase tracking-widest text-black/40">Sincerely,</p>
            <p className="font-semibold text-black text-xl">{founder.name}</p>
            <p className="text-sm text-black/50 font-mono">
              {founder.title || 'Founder & CEO'}, LocalSM Limited
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
