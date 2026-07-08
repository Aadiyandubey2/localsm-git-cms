import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  fallbackBusinesses,
  fallbackFounder,
  fallbackHero,
  getActiveBusinesses,
  getActiveDocument,
  type BusinessDocument,
  type FounderDocument,
  type HeroDocument,
} from '../api/cms';

const founderTeaser =
  'In my latest letter to shareholders and partners, I outline why we are bringing our delivery, quick-commerce, and merchant software arms under a single unified corporate identity: LocalSM. This isn\'t a rebranding of our customer-facing apps; it is an alignment of our long-term mission to build institutions that endure.';

export default function Home() {
  const [hero, setHero] = useState<HeroDocument>(fallbackHero);
  const [founder, setFounder] = useState<FounderDocument>(fallbackFounder);
  const [businesses, setBusinesses] = useState<BusinessDocument[]>(fallbackBusinesses);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadHomeContent = async () => {
      try {
        const [heroDocument, founderDocument, businessDocuments] = await Promise.all([
          getActiveDocument<HeroDocument>('/heroes'),
          getActiveDocument<FounderDocument>('/founders'),
          getActiveBusinesses(),
        ]);

        if (!isMounted) {
          return;
        }

        if (heroDocument) {
          setHero({ ...fallbackHero, ...heroDocument });
        }

        if (founderDocument) {
          setFounder({ ...fallbackFounder, ...founderDocument });
        }

        if (businessDocuments.length > 0) {
          setBusinesses(businessDocuments);
        }
      } catch (error) {
        console.error('Failed to load home content:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadHomeContent();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#f4f4f4] min-h-screen text-black font-sans pt-32 pb-20 selection:bg-[#0055ff]/10 selection:text-black">
        {/* HERO SECTION SKELETON */}
        <section className="relative min-h-[90vh] flex flex-col justify-center pb-20 px-6 md:px-12 border-b border-black/10">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center animate-pulse">
            <div className="lg:col-span-8 space-y-8">
              <div className="h-4 w-36 rounded bg-black/10"></div>
              <div className="space-y-3">
                <div className="h-16 w-full rounded bg-black/10"></div>
                <div className="h-16 w-5/6 rounded bg-black/10"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-black/10"></div>
                <div className="h-4 w-5/6 rounded bg-black/10"></div>
                <div className="h-4 w-2/3 rounded bg-black/10"></div>
              </div>
            </div>
            <div className="lg:col-span-4 aspect-[4/5] bg-black/10 border border-black/10 rounded"></div>
          </div>
        </section>

        {/* FOUNDER NOTE SECTION SKELETON */}
        <section className="section-spacing px-6 md:px-12 border-b border-black/10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 animate-pulse">
            <div className="lg:col-span-4 space-y-6">
              <div className="h-4 w-24 rounded bg-black/10"></div>
              <div className="aspect-[3/4] max-w-[320px] bg-black/10 border border-black/10 rounded"></div>
            </div>
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div className="space-y-6 mt-8 lg:mt-12">
                <div className="h-4 w-28 rounded bg-black/10"></div>
                <div className="space-y-2">
                  <div className="h-8 w-full rounded bg-black/10"></div>
                  <div className="h-8 w-11/12 rounded bg-black/10"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-black/10"></div>
                  <div className="h-4 w-5/6 rounded bg-black/10"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BUSINESSES SECTION SKELETON */}
        <section className="section-spacing px-6 md:px-12 border-b border-black/10">
          <div className="max-w-7xl mx-auto space-y-16 animate-pulse">
            <div className="space-y-4">
              <div className="h-4 w-28 rounded bg-black/10"></div>
              <div className="h-8 w-2/3 rounded bg-black/10"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-black/10 flex flex-col h-full bg-[#f4f4f4]">
                  <div className="aspect-[16/10] bg-black/10 border-b border-black/10"></div>
                  <div className="p-8 space-y-6 flex-grow">
                    <div className="flex justify-between items-center">
                      <div className="h-6 w-32 rounded bg-black/10"></div>
                      <div className="h-5 w-20 rounded bg-black/10"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded bg-black/10"></div>
                      <div className="h-4 w-5/6 rounded bg-black/10"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f4f4] min-h-screen text-black font-sans selection:bg-[#0055ff]/10 selection:text-black">
      {/* SECTION 1: HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-20 px-6 md:px-12 border-b border-black/10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-8">
            <div className="inline-block border-b border-[#0055ff] pb-1.5">
              <span className="text-xs uppercase tracking-[0.25em] font-medium text-black/60">
                {hero.subtitle || 'Corporate Announcement'}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.05] text-black">
              {hero.title}
            </h1>
            <p className="text-lg md:text-xl text-black/60 font-light max-w-2xl leading-relaxed">
              {hero.description}
            </p>
          </div>
          <div className="lg:col-span-4 h-full flex items-center justify-center">
            {/* Grayscale hover image container */}
            <div className="grayscale-hover-container relative w-full aspect-[4/5] bg-black/5 overflow-hidden border border-black/10">
              <img
                src={hero.image || '/images/hero-building.jpg'}
                alt="LocalSM Corporate Headquarters"
                className="grayscale-hover-img w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#f4f4f4]/90 backdrop-blur-sm p-4 border border-black/5">
                <p className="text-xs font-mono text-black/40">HQ-01 // GURUGRAM</p>
                <p className="text-sm font-medium mt-0.5 text-black">LocalSM Corporate Headquarters</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FOUNDER NOTE SECTION */}
      <section className="section-spacing px-6 md:px-12 border-b border-black/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40">
              Leadership
            </h2>
            <div className="grayscale-hover-container relative aspect-[3/4] max-w-[320px] bg-black/5 overflow-hidden border border-black/10">
              <img
                src={founder.portraitImage || '/images/founder.jpg'}
                alt={`${founder.name}, ${founder.title || 'Founder & CEO'}`}
                className="grayscale-hover-img w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="space-y-6 mt-8 lg:mt-12">
              <span className="text-sm font-mono text-black/50">February 6, 2026</span>
              <h3 className="text-3xl md:text-4xl font-light tracking-tight leading-snug">
                “{founder.quote}”
              </h3>
              <p className="text-base text-black/60 font-light leading-relaxed max-w-3xl">
                {founderTeaser}
              </p>
            </div>
            <div className="mt-10">
              <Link
                to="/founder-letter"
                className="inline-flex items-center gap-2 text-sm font-medium border-b border-[#0055ff] pb-1 hover:text-[#0055ff] transition-colors focus:outline-none"
              >
                Read the full Founder’s Letter <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: BUSINESSES SECTION */}
      <section className="section-spacing px-6 md:px-12 border-b border-black/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40">
              Our Businesses
            </h2>
            <p className="text-3xl md:text-4xl font-light tracking-tight max-w-2xl text-black">
              Under the LocalSM umbrella, we operate three market-leading hyper-local platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {businesses.map((business) => (
              <div
                key={business.title}
                className="grayscale-hover-container border border-black/10 flex flex-col h-full bg-[#f4f4f4] transition-all duration-300 hover:border-black/30"
              >
                <div className="aspect-[16/10] overflow-hidden bg-black/5 border-b border-black/10">
                  <img
                    src={business.image || '/images/delivery-rider.jpg'}
                    alt={business.title}
                    className="grayscale-hover-img w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col justify-between flex-grow space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-medium tracking-tight">{business.title}</h3>
                      {business.points?.[0]?.title ? (
                        <span className="text-xs font-mono px-2 py-0.5 border border-[#0055ff] text-[#0055ff]">
                          {business.points[0].title.toUpperCase()}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-black/60 font-light leading-relaxed">
                      {business.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-black/5">
                    <a
                      href={business.ctaLink || '#'}
                      onClick={(e) => {
                        if (!business.ctaLink || business.ctaLink === '#') {
                          e.preventDefault();
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-black hover:text-[#0055ff] transition-colors"
                    >
                      {business.ctaText || 'Explore Platform'} <span className="text-[#0055ff]">→</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 & 5: VISION & MISSION SECTION */}
      <section className="section-spacing px-6 md:px-12 border-b border-black/10 bg-black/[0.02]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Vision */}
          <div className="space-y-6">
            <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40 border-b border-[#0055ff] pb-2 inline-block">
              Our Vision
            </h2>
            <h3 className="text-3xl md:text-5xl font-light tracking-tight leading-tight text-black">
              Enduring institutions built on local empowerment.
            </h3>
            <p className="text-base text-black/60 font-light leading-relaxed">
              LocalSM envisions a future where local commerce, hyper-local connectivity, and sustainable growth form the foundation of enduring community success. We build systems that stand the test of time, adapting to changing consumer behaviors while keeping the local merchant at the core of the economy.
            </p>
          </div>

          {/* Mission */}
          <div className="space-y-6">
            <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40 border-b border-[#0055ff] pb-2 inline-block">
              Our Mission
            </h2>
            <h3 className="text-3xl md:text-5xl font-light tracking-tight leading-tight text-black">
              To endure, evolve, and empower.
            </h3>
            <p className="text-base text-black/60 font-light leading-relaxed">
              We build hyper-local platforms that redefine local commerce, uplift communities, and embody the promise of permanence through constant adaptation. We challenge our own ideas daily, dismantle what works to build what is better, and share our success with the millions of partners who depend on us.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: IMPACT SECTION */}
      <section className="section-spacing px-6 md:px-12 border-b border-black/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40">
                Impact & Responsibility
              </h2>
              <p className="text-3xl md:text-4xl font-light tracking-tight max-w-2xl text-black">
                Our growth is intrinsically linked to the health of our communities and planet.
              </p>
            </div>
            <div>
              <Link
                to="/impact"
                className="inline-flex items-center gap-2 text-sm font-medium border-b border-[#0055ff] pb-1 hover:text-[#0055ff] transition-colors focus:outline-none"
              >
                View our ESG Factsheet <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Metric 1 */}
            <div className="border border-black/10 p-8 space-y-4 bg-[#f4f4f4]">
              <span className="text-xs font-mono text-black/40 uppercase tracking-widest">Environmental</span>
              <p className="text-5xl md:text-6xl font-light tracking-tight text-black">100%</p>
              <p className="text-sm text-black/60 font-light leading-relaxed">
                Electric vehicle-based deliveries across our entire fleet by 2030.
              </p>
            </div>

            {/* Metric 2 */}
            <div className="border border-black/10 p-8 space-y-4 bg-[#f4f4f4]">
              <span className="text-xs font-mono text-black/40 uppercase tracking-widest">Climate</span>
              <p className="text-5xl md:text-6xl font-light tracking-tight text-black">2033</p>
              <p className="text-sm text-black/60 font-light leading-relaxed">
                Target date to achieve Net-Zero greenhouse gas emissions across our value chain.
              </p>
            </div>

            {/* Metric 3 */}
            <div className="border border-black/10 p-8 space-y-4 bg-[#f4f4f4]">
              <span className="text-xs font-mono text-black/40 uppercase tracking-widest">Socioeconomic</span>
              <p className="text-5xl md:text-6xl font-light tracking-tight text-black">1.2M+</p>
              <p className="text-sm text-black/60 font-light leading-relaxed">
                Delivery partners and local merchants empowered with active livelihoods.
              </p>
            </div>

            {/* Metric 4 */}
            <div className="border border-black/10 p-8 space-y-4 bg-[#f4f4f4]">
              <span className="text-xs font-mono text-black/40 uppercase tracking-widest">Ecology</span>
              <p className="text-5xl md:text-6xl font-light tracking-tight text-black">100%</p>
              <p className="text-sm text-black/60 font-light leading-relaxed">
                Plastic-neutral food and grocery delivery order fulfillment achieved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: CULTURE SECTION */}
      <section className="section-spacing px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40">
              Working at LocalSM
            </h2>
            <h3 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] text-black">
              This place is designed to make you feel uncomfortable.
            </h3>
            <p className="text-base text-black/60 font-light leading-relaxed max-w-2xl">
              We don’t settle. We don’t rest on legacy success. We operate with extreme transparency, high ownership, and a relentless pace. If you thrive on comfort, this is not the place for you. If you thrive on building enduring things that matter, we should talk.
            </p>
            <div className="pt-4">
              <Link
                to="/culture"
                className="inline-flex items-center gap-2 text-sm font-medium border-b border-[#0055ff] pb-1 hover:text-[#0055ff] transition-colors focus:outline-none"
              >
                Learn about our culture <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="grayscale-hover-container relative aspect-[4/3] bg-black/5 overflow-hidden border border-black/10">
              <img
                src="/images/office-interior.jpg"
                alt="LocalSM Work Environment"
                className="grayscale-hover-img w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
