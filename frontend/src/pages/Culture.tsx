import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getActiveDocument, type CulturePageDocument } from '../api/cms';

export default function Culture() {
  const [culturePage, setCulturePage] = useState<CulturePageDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCultureContent = async () => {
      try {
        const doc = await getActiveDocument<CulturePageDocument>('/culture-page');
        if (isMounted && doc) {
          setCulturePage(doc);
        }
      } catch (error) {
        console.error('Failed to load culture content:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCultureContent();

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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-5 aspect-[4/5] bg-black/10 border border-black/10 rounded"></div>
            <div className="lg:col-span-7 space-y-6">
              <div className="h-4 w-36 rounded bg-black/10"></div>
              <div className="h-8 w-2/3 rounded bg-black/10"></div>
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-black/10"></div>
                <div className="h-4 w-11/12 rounded bg-black/10"></div>
                <div className="h-4 w-5/6 rounded bg-black/10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const valuesToRender = culturePage?.valuesList?.length
    ? culturePage.valuesList
    : [
        {
          num: '01',
          title: 'Extreme Ownership',
          description: 'We do not wait to be told what to do. If you see a problem, you own it until it is solved. We do not have room for spectators or commentators.',
        },
        {
          num: '02',
          title: 'Radical Candor',
          description: 'We speak the truth directly and immediately. We do not sugarcoat feedback because we believe that politeness at the expense of growth is a disservice.',
        },
        {
          num: '03',
          title: 'First Principles Thinking',
          description: 'We do not do things because "that is how they have always been done." We break problems down to their fundamental truths and build upward from there.',
        },
        {
          num: '04',
          title: 'Bias for Action',
          description: 'Speed matters in hyper-local commerce. A good decision made today is infinitely better than a perfect decision made next week. We iterate in public.',
        },
        {
          num: '05',
          title: 'Obsession with Partners',
          description: 'Our merchants and delivery partners are our lifeblood. Every product we build and every operational decision we make must make their lives better.',
        },
        {
          num: '06',
          title: 'Intellectual Honesty',
          description: 'We celebrate being wrong because it means we are closer to being right. We dismantle our own successful models if we find a better way forward.',
        },
      ];

  const bodyToRender = culturePage?.philosophyBody?.length
    ? culturePage.philosophyBody
    : [
        'At LocalSM, we do not believe in bureaucratic processes, elaborate hierarchies, or micro-management. Instead, we hire extremely high-agency individuals, align them behind clear, audacious missions, and get out of their way.',
        'This means you have complete autonomy over your work, your budget, and your decisions. It also means you carry full accountability for the outcomes. There are no excuses, no shifting of blame, and no hiding behind committees.',
        'We work long hours, we debate fiercely, and we challenge each other’s ideas constantly. We do this not because we are difficult, but because we care deeply about the quality of what we build.'
      ];

  return (
    <div className="bg-[#f4f4f4] min-h-screen text-black font-sans pt-32 pb-20 selection:bg-[#0055ff]/10 selection:text-black">
      {/* Hero Section */}
      <section className="px-6 md:px-12 pb-20 border-b border-black/10">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="inline-block border-b border-[#0055ff] pb-1.5">
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-black/60">
              Working at LocalSM
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.05] max-w-5xl">
            {culturePage?.heroTitle || 'This place is designed to make you feel uncomfortable.'}
          </h1>
          <p className="text-xl md:text-2xl text-black/60 font-light max-w-3xl leading-relaxed">
            {culturePage?.heroDescription || 'Comfort is the enemy of progress. We operate with high intensity, relentless focus, and absolute transparency. If you seek stability and a predictable 9-to-5, you will find our culture challenging. If you seek to build enduring institutions, you will find it liberating.'}
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-spacing px-6 md:px-12 border-b border-black/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5">
            <div className="grayscale-hover-container relative aspect-[4/5] bg-black/5 overflow-hidden border border-black/10">
              <img
                src={culturePage?.philosophyImage || '/images/office-interior.jpg'}
                alt={culturePage?.philosophyImageAlt || 'LocalSM Collaboration Space'}
                className="grayscale-hover-img w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40">
              Our Core Philosophy
            </h2>
            <h3 className="text-3xl md:text-4xl font-light tracking-tight leading-snug">
              {culturePage?.philosophyQuote || '"We don\'t manage people. We manage missions."'}
            </h3>
            <div className="space-y-6 text-base text-black/60 font-light leading-relaxed">
              {bodyToRender.map((p, index) => (
                <p key={index}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="section-spacing px-6 md:px-12 border-b border-black/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40">
              {culturePage?.valuesTitle || 'Our Values'}
            </h2>
            <p className="text-3xl md:text-4xl font-light tracking-tight max-w-2xl">
              {culturePage?.valuesSubtitle || 'The operating principles we live and work by every single day.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valuesToRender.map((val) => (
              <div key={val.num} className="border border-black/10 p-8 space-y-6 bg-[#f4f4f4] hover:border-black/30 transition-colors duration-300">
                <span className="text-xs font-mono text-[#0055ff] font-semibold">{val.num} /</span>
                <h3 className="text-xl font-medium tracking-tight">{val.title}</h3>
                <p className="text-sm text-black/60 font-light leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-spacing px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight">
            {culturePage?.ctaTitle || 'Are you ready to do the most challenging work of your life?'}
          </h2>
          <p className="text-base text-black/60 font-light leading-relaxed max-w-2xl mx-auto">
            {culturePage?.ctaDescription || 'We are always looking for exceptional engineers, product thinkers, operational leaders, and designers who want to build the future of hyper-local commerce.'}
          </p>
          <div className="pt-4">
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 text-sm font-medium border-b border-[#0055ff] pb-1 hover:text-[#0055ff] transition-colors focus:outline-none"
            >
              {culturePage?.ctaButtonText || 'Explore Open Roles'} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
