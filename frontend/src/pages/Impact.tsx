import React, { useEffect, useState } from 'react';
import { ArrowRight, Leaf, Shield, Heart } from 'lucide-react';
import { getActiveDocument, type ImpactPageDocument } from '../api/cms';

const renderIcon = (type?: string) => {
  switch (type) {
    case 'Leaf':
      return <Leaf size={24} className="text-[#0055ff]" strokeWidth={1.5} />;
    case 'Shield':
      return <Shield size={24} className="text-[#0055ff]" strokeWidth={1.5} />;
    case 'Heart':
    default:
      return <Heart size={24} className="text-[#0055ff]" strokeWidth={1.5} />;
  }
};

export default function Impact() {
  const [impactPage, setImpactPage] = useState<ImpactPageDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadImpactContent = async () => {
      try {
        const doc = await getActiveDocument<ImpactPageDocument>('/impact-page');
        if (isMounted && doc) {
          setImpactPage(doc);
        }
      } catch (error) {
        console.error('Failed to load impact page content:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadImpactContent();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#f4f4f4] min-h-screen text-black font-sans pt-32 pb-20 selection:bg-[#0055ff]/10 selection:text-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16 animate-pulse">
          <div className="space-y-4">
            <div className="h-4 w-32 rounded bg-black/10"></div>
            <div className="h-12 w-3/4 rounded bg-black/10"></div>
            <div className="h-6 w-1/2 rounded bg-black/10"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-black/10 p-8 space-y-4 bg-[#f4f4f4]">
                <div className="h-4 w-28 rounded bg-black/10"></div>
                <div className="h-10 w-20 rounded bg-black/10"></div>
                <div className="h-3 w-full rounded bg-black/10"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const metricsToRender = impactPage?.metrics?.length
    ? impactPage.metrics
    : [];

  const initiativesToRender = impactPage?.initiatives?.length
    ? impactPage.initiatives
    : [];

  const socialDescriptionHTML = impactPage?.socialDescription
    ? impactPage.socialDescription
        .split('\n\n')
        .map((p, idx) => {
          if (p.startsWith('Partner Welfare:') || p.startsWith('Merchant Empowerment:')) {
            const splitIdx = p.indexOf(':');
            const boldText = p.substring(0, splitIdx + 1);
            const normText = p.substring(splitIdx + 1);
            return (
              <p key={idx}>
                <strong>{boldText}</strong>{normText}
              </p>
            );
          }
          return <p key={idx}>{p}</p>;
        })
    : null;

  return (
    <div className="bg-[#f4f4f4] min-h-screen text-black font-sans pt-32 pb-20 selection:bg-[#0055ff]/10 selection:text-black">
      {/* Hero Section */}
      <section className="px-6 md:px-12 pb-20 border-b border-black/10">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="inline-block border-b border-[#0055ff] pb-1.5">
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-black/60">
              Impact & Sustainability
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.05] max-w-5xl">
            {impactPage?.heroTitle || 'Responsible growth at scale.'}
          </h1>
          <p className="text-xl md:text-2xl text-black/60 font-light max-w-3xl leading-relaxed">
            {impactPage?.heroDescription || 'We believe that corporate growth is meaningless if it occurs at the expense of our environment or communities. We integrate ESG (Environmental, Social, and Governance) principles into our core operations, setting hard targets and measuring progress with scientific discipline.'}
          </p>
        </div>
      </section>

      {/* ESG Dashboard Metrics */}
      {metricsToRender.length > 0 && (
        <section className="section-spacing px-6 md:px-12 border-b border-black/10">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40">
                {impactPage?.metricsTitle || 'Key Progress Metrics'}
              </h2>
              <p className="text-3xl md:text-4xl font-light tracking-tight max-w-2xl">
                {impactPage?.metricsSubtitle || 'Measuring our real-world impact in real-time.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {metricsToRender.map((m, idx) => (
                <div key={idx} className="border border-black/10 p-8 space-y-4 bg-[#f4f4f4]">
                  <p className="text-xs font-mono text-black/40 uppercase tracking-widest">{m.label}</p>
                  <p className="text-4xl md:text-5xl font-light tracking-tight text-black">{m.value}</p>
                  <p className="text-xs text-black/50 font-mono">{m.subText}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Detailed Initiatives */}
      {initiativesToRender.length > 0 && (
        <section className="section-spacing px-6 md:px-12 border-b border-black/10 bg-black/[0.01]">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40">
                {impactPage?.initiativesTitle || 'Environmental Stewardship'}
              </h2>
              <p className="text-3xl md:text-4xl font-light tracking-tight max-w-2xl">
                {impactPage?.initiativesSubtitle || 'Targeted actions for a healthier planet.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {initiativesToRender.map((ini, idx) => (
                <div key={idx} className="border border-black/10 p-8 space-y-6 bg-[#f4f4f4]">
                  <div className="p-3 border border-black/10 inline-block bg-[#f4f4f4]">
                    {renderIcon(ini.iconType)}
                  </div>
                  <h3 className="text-xl font-medium tracking-tight">{ini.title}</h3>
                  <p className="text-sm text-black/60 font-light leading-relaxed">
                    {ini.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social Responsibility / Partner Welfare */}
      {socialDescriptionHTML && (
        <section className="section-spacing px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-5">
              <div className="grayscale-hover-container relative aspect-[4/5] bg-black/5 overflow-hidden border border-black/10">
                <img
                  src={impactPage?.socialImage || '/images/delivery-rider.jpg'}
                  alt={impactPage?.socialImageAlt || 'LocalSM Delivery Partner'}
                  className="grayscale-hover-img w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-8">
              <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40">
                {impactPage?.socialTitle || 'Social Responsibility'}
              </h2>
              <h3 className="text-3xl md:text-4xl font-light tracking-tight leading-snug">
                Uplifting our delivery partners and local merchants.
              </h3>
              <div className="space-y-6 text-sm text-black/60 font-light leading-relaxed">
                {socialDescriptionHTML}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
