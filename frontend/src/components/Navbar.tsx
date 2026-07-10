import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { getActiveDocument, type BrandingDocument, type NavigationDocument } from '../api/cms';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navigation, setNavigation] = useState<NavigationDocument | null>(null);
  const [branding, setBranding] = useState<BrandingDocument | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        isScrolled && setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  useEffect(() => {
  let isMounted = true;

  const loadNavigation = async () => {
    try {
      const [navigationDocument, brandingDocument] = await Promise.all([
        getActiveDocument<NavigationDocument>('/navigation'),
        getActiveDocument<BrandingDocument>('/branding'),
      ]);

      if (!isMounted) {
        return;
      }

      if (navigationDocument) {
        setNavigation(navigationDocument);
      }

      if (brandingDocument) {
        setBranding(brandingDocument);
      }
    } catch (error) {
      if (isMounted) {
        setLoadError(true);
      }
      console.error('Failed to load navigation content:', error);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  loadNavigation();

  return () => {
    isMounted = false;
  };
  }, []);

  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f4f4f4]/95 backdrop-blur-md border-b border-black/10 py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo & Name Skeleton */}
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-9 w-9 rounded-full bg-black/10"></div>
            <div className="h-5 w-24 rounded bg-black/10"></div>
          </div>
          {/* Nav Links Skeleton */}
          <div className="hidden md:flex items-center space-x-10 animate-pulse">
            <div className="h-4 w-14 rounded bg-black/10"></div>
            <div className="h-4 w-16 rounded bg-black/10"></div>
            <div className="h-4 w-16 rounded bg-black/10"></div>
            <div className="h-4 w-16 rounded bg-black/10"></div>
            <div className="h-4 w-14 rounded bg-black/10"></div>
          </div>
          <div className="md:hidden h-6 w-6 rounded bg-black/10 animate-pulse"></div>
        </div>
      </nav>
    );
  }

  const navLinks = navigation?.menuItems ?? [];
  const logoSrc = branding?.logo || navigation?.logo || '';
  const siteName = branding?.siteName || '';

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#f4f4f4]/95 backdrop-blur-md border-b border-black/10 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2 focus:outline-none">
          <img src={logoSrc} alt={siteName} className="h-9 w-9 object-contain" />
          <span className="localsm-wordmark text-xl tracking-tight text-black flex items-center">
            {branding?.wordmarkText ? (
              <>
                {branding?.wordmarkText.substring(0, branding?.wordmarkHighlightIndex ?? 5)}
                <span style={{ color: branding?.wordmarkHighlightColor || '#f4b000' }}>
                  {branding?.wordmarkText.substring(branding?.wordmarkHighlightIndex ?? 5)}
                </span>
              </>
            ) : siteName && siteName.startsWith('Local') ? (
              <>
                Local<span className="text-[#f4b000]">SM</span>
              </>
            ) : (
              siteName
            )}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => {
            const external = link.href.startsWith('http://') || link.href.startsWith('https://') || link.href.startsWith('//');
            return external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative text-sm font-medium text-black/70 hover:text-black transition-colors duration-300 py-1 focus:outline-none"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="relative text-sm font-medium text-black/70 hover:text-black transition-colors duration-300 py-1 focus:outline-none"
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#0055ff] transition-all duration-300" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-black hover:text-[#0055ff] transition-colors focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`fixed inset-0 top-[60px] bg-[#f4f4f4] z-40 md:hidden transition-all duration-500 ease-in-out border-t border-black/5 ${
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-10 pointer-events-none'
        }`}
      >
        <div className="flex flex-col px-8 py-12 space-y-8 h-full bg-[#f4f4f4]">
          {navLinks.map((link) => {
            const external = link.href.startsWith('http://') || link.href.startsWith('https://') || link.href.startsWith('//');
            return external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="text-2xl font-light text-black flex items-center justify-between group border-b border-black/5 pb-4 focus:outline-none"
              >
                <span className="group-hover:text-[#0055ff] transition-colors duration-300">
                  {link.label}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#0055ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-light text-black flex items-center justify-between group border-b border-black/5 pb-4 focus:outline-none"
              >
                <span className="group-hover:text-[#0055ff] transition-colors duration-300">
                  {link.label}
                </span>
                {isActive(link.href) ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0055ff]"></span>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0055ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

    </nav>
  );
}
