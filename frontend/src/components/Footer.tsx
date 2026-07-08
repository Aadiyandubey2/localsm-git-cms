import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fallbackBranding,
  fallbackFooter,
  fallbackWebsiteSettings,
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
  const [footer, setFooter] = useState<FooterDocument>(fallbackFooter);
  const [branding, setBranding] = useState<BrandingDocument>(fallbackBranding);
  const [settings, setSettings] = useState<WebsiteSettingsDocument>(fallbackWebsiteSettings);
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
          setFooter({
            ...fallbackFooter,
            ...footerDocument,
            links: footerDocument.links?.length ? footerDocument.links : fallbackFooter.links,
          });
        }

        if (brandingDocument) {
          setBranding({
            ...fallbackBranding,
            ...brandingDocument,
          });
        }

        if (settingsDocument) {
          setSettings({
            ...fallbackWebsiteSettings,
            ...settingsDocument,
          });
        }
      } catch (error) {
        console.error('Failed to load footer content:', error);
      }
    };

    loadFooterContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const logoSrc = footer.logo || branding.logo || fallbackBranding.logo || '/images/localsm-logo.svg';
  const siteName = branding.siteName || fallbackBranding.siteName;
  const { tagline, body: descriptionBody } = splitFooterDescription(
    footer.description || `${settings.tagline || ''} ${settings.description || ''}`.trim() || fallbackFooter.description || ''
  );
  const links = footer.links ?? fallbackFooter.links ?? [];

  const groupLinks = links.filter(
    (link) => GROUP_COMPANY_PATHS.has(link.href) && !CORPORATE_PATHS.has(link.href) && !LEGAL_LABELS.has(link.label)
  );
  const corporateLinks = links.filter((link) => CORPORATE_PATHS.has(link.href));
  const legalLinks = links.filter((link) => LEGAL_LABELS.has(link.label));

  const copyrightText =
    footer.copyrightText?.replace(String(currentYear - 1), String(currentYear)) ||
    `© ${currentYear} ${settings.siteName || 'LocalSM Limited'}. All rights reserved.`;

  const officeAddress = settings.address
    ? `${settings.siteName || 'LocalSM Limited'},\n${settings.address}`
    : 'LocalSM Limited,\n12th Floor, DLF Cyber City,\nPhase 3, Gurugram,\nHaryana - 122002, India';

  const officeLines = officeAddress.split('\n');

  return (
    <footer className="bg-[#f4f4f4] border-t border-black/10 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          {/* Logo & Corporate Tagline */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-xl tracking-tight text-black">
              <img src={logoSrc} alt={siteName} className="h-9 w-9 object-contain" />
              <span className="localsm-wordmark">
                {siteName.startsWith('Local') ? (
                  <>
                    Local<span className="text-[#f4b000]">SM</span>
                  </>
                ) : (
                  siteName
                )}
              </span>
            </Link>
            <p className="mt-4 text-xs tracking-wider text-black/50 uppercase font-medium">
              {tagline || settings.tagline || 'To endure, evolve, and empower.'}
            </p>
            <p className="mt-6 text-sm text-black/60 leading-relaxed font-light">
              {descriptionBody || settings.description || 'Building the hyper-local commerce infrastructure of tomorrow.'}
            </p>
          </div>

          {/* Group Companies */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-5">
              Group Companies
            </h4>
            <ul className="space-y-3">
              {groupLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-black/70 hover:text-[#0055ff] transition-colors duration-200 font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-5">
              Corporate
            </h4>
            <ul className="space-y-3">
              {corporateLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-black/70 hover:text-[#0055ff] transition-colors duration-200 font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-5">
              Corporate Office
            </h4>
            <p className="text-sm text-black/60 font-light leading-relaxed mb-4">
              {officeLines.map((line, index) => (
                <React.Fragment key={line}>
                  {line}
                  {index < officeLines.length - 1 ? <br /> : null}
                </React.Fragment>
              ))}
            </p>
            <p className="text-sm text-black/60 font-light">
              <span className="text-black/40">CIN:</span> L74999HR2026PLC099999<br />
              <span className="text-black/40">Email:</span>{' '}
              <a href={`mailto:${settings.email || 'corporate@localsm.com'}`} className="hover:text-[#0055ff] transition-colors">
                {settings.email || 'corporate@localsm.com'}
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-black/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-black/50 font-light">
            {copyrightText}
          </p>
          <div className="flex space-x-6">
            {(legalLinks.length > 0 ? legalLinks : [
              { label: 'Privacy Policy', href: '#' },
              { label: 'Terms of Use', href: '#' },
              { label: 'Sitemap', href: '#' },
            ]).map((link) => (
              <a key={link.label} href={link.href} className="text-xs text-black/50 hover:text-black transition-colors font-light">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
