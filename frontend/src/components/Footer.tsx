import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getActiveDocument,
  splitFooterDescription,
  type BrandingDocument,
  type FooterDocument,
  type WebsiteSettingsDocument,
} from '../api/cms';

const GROUP_COMPANY_PATHS = new Set(['/']);
const CORPORATE_PATHS = new Set(['/culture', '/careers', '/investors', '/impact', '/founder-letter', '/contact']);
const LEGAL_LABELS = new Set(['Privacy Policy', 'Terms of Use', 'Sitemap']);

export default function Footer() {
  const [footer, setFooter] = useState<FooterDocument | null>(null);
  const [branding, setBranding] = useState<BrandingDocument | null>(null);
  const [settings, setSettings] = useState<WebsiteSettingsDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    let isMounted = true;

    const loadFooterContent = async () => {
      try {
        const [footerDocument, brandingDocument, settingsDocument] = await Promise.all([
          getActiveDocument<FooterDocument>('/footer'),
          getActiveDocument<BrandingDocument>('/branding'),
          getActiveDocument<WebsiteSettingsDocument>('/website-settings'),
        ]);

        if (!isMounted) {
          return;
        }

        if (footerDocument) {
          setFooter(footerDocument);
        }

        if (brandingDocument) {
          setBranding(brandingDocument);
        }

        if (settingsDocument) {
          setSettings(settingsDocument);
        }
      } catch (error) {
        console.error('Failed to load footer content:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFooterContent();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <footer className="bg-black text-white py-16 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 animate-pulse">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="h-9 w-9 rounded-full bg-white/10"></div>
            <div className="h-4 w-3/4 rounded bg-white/10"></div>
            <div className="h-3 w-1/2 rounded bg-white/10"></div>
          </div>
          {/* Group Companies */}
          <div className="space-y-3">
            <div className="h-4 w-24 rounded bg-white/10"></div>
            <div className="h-3 w-32 rounded bg-white/10"></div>
            <div className="h-3 w-28 rounded bg-white/10"></div>
          </div>
          {/* Corporate */}
          <div className="space-y-3">
            <div className="h-4 w-24 rounded bg-white/10"></div>
            <div className="h-3 w-20 rounded bg-white/10"></div>
            <div className="h-3 w-24 rounded bg-white/10"></div>
            <div className="h-3 w-28 rounded bg-white/10"></div>
          </div>
          {/* Address */}
          <div className="space-y-3">
            <div className="h-4 w-24 rounded bg-white/10"></div>
            <div className="h-3 w-full rounded bg-white/10"></div>
            <div className="h-3 w-2/3 rounded bg-white/10"></div>
          </div>
        </div>
      </footer>
    );
  }

  const logoSrc = footer?.logo || branding?.logo || '';
  const siteName = branding?.siteName || '';
  const { tagline, body: descriptionBody } = splitFooterDescription(
    footer?.description || `${settings?.tagline || ''} ${settings?.description || ''}`.trim() || ''
  );
  const links = footer?.links ?? [];

  const GROUP_LABELS = new Set(['LocalSM Delivery', 'Janhal', 'Local Branding Software']);
  const LEGAL_LABELS = new Set(['Privacy Policy', 'Terms of Use', 'Sitemap']);

  const groupLinks = links.filter((link) => GROUP_LABELS.has(link.label));
  const legalLinks = links.filter((link) => LEGAL_LABELS.has(link.label));
  const corporateLinks = links.filter(
    (link) => !GROUP_LABELS.has(link.label) && !LEGAL_LABELS.has(link.label)
  );

  const copyrightText =
    footer?.copyrightText ||
    (settings?.siteName ? `© ${currentYear} ${settings.siteName}. All rights reserved.` : `© ${currentYear}`);

  const officeAddress = settings?.address
    ? `${settings.siteName || ''}\n${settings.address}`.trim()
    : '';

  const officeLines = officeAddress ? officeAddress.split('\n') : [];
  const hasOfficeInfo = !!(officeAddress || settings?.cin || settings?.email);

  const renderFooterLink = (link: { label: string; href: string }, className: string) => {
    const external = link.href.startsWith('http://') || link.href.startsWith('https://') || link.href.startsWith('//');
    return external ? (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
      </a>
    ) : (
      <Link to={link.href} className={className}>
        {link.label}
      </Link>
    );
  };

  return (
    <footer className="bg-[#f4f4f4] border-t border-black/10 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          {/* Logo & Corporate Tagline */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-xl tracking-tight text-black">
              <img src={logoSrc} alt={siteName} className="h-9 w-9 object-contain" />
              <span className="localsm-wordmark">
                {branding?.wordmarkText ? (
                  <>
                    {branding.wordmarkText.substring(0, branding?.wordmarkHighlightIndex ?? 5)}
                    <span style={{ color: branding?.wordmarkHighlightColor || '#f4b000' }}>
                      {branding.wordmarkText.substring(branding?.wordmarkHighlightIndex ?? 5)}
                    </span>
                  </>
                ) : siteName.startsWith('Local') ? (
                  <>
                    Local<span className="text-[#f4b000]">SM</span>
                  </>
                ) : (
                  siteName
                )}
              </span>
            </Link>
            <p className="mt-4 text-xs tracking-wider text-black/50 uppercase font-medium">
              {tagline || settings?.tagline || ''}
            </p>
            <p className="mt-6 text-sm text-black/60 leading-relaxed font-light">
              {descriptionBody || settings?.description || ''}
            </p>
          </div>

          {/* Group Companies */}
          {groupLinks.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-5">
                Group Companies
              </h4>
              <ul className="space-y-3">
                {groupLinks.map((link) => (
                  <li key={link.label}>
                    {renderFooterLink(link, "text-sm text-black/70 hover:text-[#0055ff] transition-colors duration-200 font-light")}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Corporate */}
          {corporateLinks.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-5">
                Corporate
              </h4>
              <ul className="space-y-3">
                {corporateLinks.map((link) => (
                  <li key={link.label}>
                    {renderFooterLink(link, "text-sm text-black/70 hover:text-[#0055ff] transition-colors duration-200 font-light")}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact & Support */}
          <div>
            {hasOfficeInfo && (
              <>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-5">
                  Corporate Office
                </h4>
                {officeAddress && (
                  <p className="text-sm text-black/60 font-light leading-relaxed mb-4">
                    {officeLines.map((line, index) => (
                      <React.Fragment key={line}>
                        {line}
                        {index < officeLines.length - 1 ? <br /> : null}
                      </React.Fragment>
                    ))}
                  </p>
                )}
                <p className="text-sm text-black/60 font-light">
                  {settings?.cin && (
                    <>
                      <span className="text-black/40">CIN:</span> {settings.cin}
                      <br />
                    </>
                  )}
                  {settings?.email && (
                    <>
                      <span className="text-black/40">Email:</span>{' '}
                      <a href={`mailto:${settings.email}`} className="hover:text-[#0055ff] transition-colors">
                        {settings.email}
                      </a>
                    </>
                  )}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-black/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-black/50 font-light">
            {copyrightText}
          </p>
          <div className="flex space-x-6">
            {legalLinks.length > 0 && legalLinks.map((link) => {
              const external = link.href.startsWith('http://') || link.href.startsWith('https://') || link.href.startsWith('//');
              return external ? (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-xs text-black/50 hover:text-black transition-colors font-light">
                  {link.label}
                </a>
              ) : (
                <a key={link.label} href={link.href} className="text-xs text-black/50 hover:text-black transition-colors font-light">
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
