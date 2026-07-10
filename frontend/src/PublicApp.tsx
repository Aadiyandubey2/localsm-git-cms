import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Culture from './pages/Culture';
import Careers from './pages/Careers';
import Investors from './pages/Investors';
import Impact from './pages/Impact';
import Contact from './pages/Contact';
import FounderLetter from './pages/FounderLetter';
import { getActiveDocument, type BrandingDocument } from './api/cms';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function BrandingEffects() {
  useEffect(() => {
    let isMounted = true;

    const applyBranding = async () => {
      try {
        const branding = await getActiveDocument<BrandingDocument>('/branding');

        if (!isMounted || !branding) {
          return;
        }

        if (branding.siteName) {
          document.title = `${branding.siteName} — ${branding.siteName}`;
        }

        if (branding.favicon) {
          let faviconLink = document.querySelector<HTMLLinkElement>("link[rel='icon']");
          if (!faviconLink) {
            faviconLink = document.createElement('link');
            faviconLink.rel = 'icon';
            document.head.appendChild(faviconLink);
          }
          faviconLink.href = branding.favicon;
        }

        const root = document.documentElement;
        if (branding.primaryColor) {
          root.style.setProperty('--brand-primary', branding.primaryColor);
        }
        if (branding.secondaryColor) {
          root.style.setProperty('--brand-secondary', branding.secondaryColor);
        }
        if (branding.accentColor) {
          root.style.setProperty('--brand-accent', branding.accentColor);
        }
        if (branding.fontFamily) {
          root.style.setProperty('--brand-font', branding.fontFamily);
        }
      } catch (error) {
        console.error('Failed to apply branding:', error);
      }
    };

    applyBranding();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}

export default function PublicApp() {
  return (
    <>
      <ScrollToTop />
      <BrandingEffects />
      <div className="bg-[#f4f4f4] min-h-screen text-black flex flex-col justify-between">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/culture" element={<Culture />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/founder-letter" element={<FounderLetter />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}
