import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getActiveBusinesses,
  getActiveDocument,
  type BusinessDocument,
  type FounderDocument,
  type WebsiteSettingsDocument,
} from '../api/cms';
import { FounderMessageContent } from '../utils/founderMessage';

export default function FounderLetter() {
  const [founder, setFounder] = useState<FounderDocument | null>(null);
  const [businesses, setBusinesses] = useState<BusinessDocument[]>([]);
  const [settings, setSettings] = useState<WebsiteSettingsDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadFounderContent = async () => {
      try {
        const [founderDocument, businessDocuments, settingsDocument] = await Promise.all([
          getActiveDocument<FounderDocument>('/founders'),
          getActiveBusinesses(),
          getActiveDocument<WebsiteSettingsDocument>('/website-settings'),
        ]);

        if (!isMounted) {
          return;
        }

        if (founderDocument) {
          setFounder(founderDocument);
        }

        if (businessDocuments.length > 0) {
          setBusinesses(businessDocuments);
        }

        if (settingsDocument) {
          setSettings(settingsDocument);
        }
      } catch (error) {
        console.error('Failed to load founder letter content:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFounderContent();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#f4f4f4] min-h-screen text-black font-sans pt-32 pb-20 selection:bg-[#0055ff]/10 selection:text-black">
        <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-12 animate-pulse">
          <div className="h-4 w-32 rounded bg-black/10"></div>
          <div className="space-y-6 border-b border-black/10 pb-8">
            <div className="h-4 w-36 rounded bg-black/10"></div>
            <div className="h-12 w-3/4 rounded bg-black/10"></div>
            <div className="flex justify-between items-center pt-4">
              <div className="h-3 w-28 rounded bg-black/10"></div>
              <div className="h-3 w-28 rounded bg-black/10"></div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-4 w-full rounded bg-black/10"></div>
            <div className="h-4 w-11/12 rounded bg-black/10"></div>
            <div className="h-4 w-full rounded bg-black/10"></div>
            <div className="h-4 w-5/6 rounded bg-black/10"></div>
            <div className="h-4 w-full rounded bg-black/10"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!founder) {
    return (
      <div className="bg-[#f4f4f4] min-h-screen text-black font-sans pt-32 pb-20 selection:bg-[#0055ff]/10 selection:text-black">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-black/50 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} /> Back to Homepage
          </Link>
          <p className="text-black/40 text-lg font-light">No founder letter available yet.</p>
        </div>
      </div>
    );
  }

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
              Founder's Statement
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">
            {founder.name
              ? `A note from our Founder, ${founder.name}.`
              : (founder.letterTitle || "A note from our Founder.")}
          </h1>
          <div className="flex justify-between items-center text-xs font-mono text-black/40 pt-4">
            {founder.letterDate && <span>DATE: {founder.letterDate}</span>}
            {founder.readTime && <span>READ TIME: {founder.readTime}</span>}
          </div>
        </div>

        {/* Letter Body */}
        <div className="space-y-8 text-base md:text-lg text-black/80 font-light leading-relaxed">
          {founder.message ? (
            <FounderMessageContent
              message={founder.message}
              businesses={businesses}
              founderName={founder.name}
              founderTitle={founder.title || ''}
            />
          ) : founder.introduction ? (
            <>
              {founder.introduction.split('\n\n').map((p, idx) => (
                <p key={idx} className={idx === 0 ? 'font-medium text-black' : ''}>
                  {p}
                </p>
              ))}

              {founder.calloutQuote && (
                <blockquote className="border-l-2 border-[#0055ff] pl-6 my-10 py-2 text-2xl md:text-3xl font-light tracking-tight text-black italic">
                  &ldquo;{founder.calloutQuote}&rdquo;
                </blockquote>
              )}

              {founder.middleText?.split('\n\n').map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}

              {founder.pillars && founder.pillars.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
                  {founder.pillars.map((pillar, idx) => (
                    <div key={idx} className="border border-black/10 p-6 bg-black/[0.01]">
                      <h4 className="font-semibold text-sm uppercase tracking-wider text-[#0055ff] mb-2">
                        {pillar.numberLabel}
                      </h4>
                      <p className="text-sm text-black/60 font-light leading-relaxed">
                        <strong>{pillar.title}</strong> — {pillar.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {founder.conclusion?.split('\n\n').map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </>
          ) : null}

          {/* Sign-off */}
          {founder.name && (
            <div className="pt-12 space-y-2">
              <p className="font-mono text-xs uppercase tracking-widest text-black/40">
                {founder.signOffLabel || 'Sincerely,'}
              </p>
              <p className="font-semibold text-black text-xl">{founder.name}</p>
              {(founder.title || settings?.siteName) && (
                <p className="text-sm text-black/50 font-mono">
                  {[founder.title, settings?.siteName].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
