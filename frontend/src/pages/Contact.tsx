import React, { useEffect, useState } from 'react';
import { Phone, MapPin, Check, X } from 'lucide-react';
import {
  fallbackWebsiteSettings,
  getActiveDocument,
  getCollection,
  submitContact,
  type WebsiteSettingsDocument,
  type ContactPageDocument,
  type OfficeDocument,
} from '../api/cms';

const fallbackOffices = [
  {
    city: 'Gurugram (Headquarters)',
    address: 'LocalSM Limited, 12th Floor, DLF Cyber City, Phase 3, Gurugram, Haryana - 122002',
    phone: '+91 124 499 9999',
  },
  {
    city: 'Bengaluru Office',
    address: 'LocalSM Limited, 3rd Floor, Prestige Tech Park, Outer Ring Road, Kadubeesanahalli, Bengaluru, Karnataka - 560103',
    phone: '+91 80 499 9999',
  },
  {
    city: 'Mumbai Office',
    address: 'LocalSM Limited, Level 4, Naman Centre, G Block, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra - 400051',
    phone: '+91 22 499 9999',
  },
];

const fallbackDepartmentalContacts = [
  {
    label: 'Media & Public Relations',
    email: 'press@localsm.com',
    description: 'For press releases, brand assets, and official statements.',
  },
  {
    label: 'Investor Relations',
    email: 'investors@localsm.com',
    description: 'For shareholding queries, financial results, and analyst meets.',
  },
  {
    label: 'Merchant Partnerships',
    email: 'merchants@localsm.com',
    description: 'For store onboarding, software training, and billing support.',
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Corporate', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [settings, setSettings] = useState<WebsiteSettingsDocument>(fallbackWebsiteSettings);

  const [contactPage, setContactPage] = useState<ContactPageDocument | null>(null);
  const [offices, setOffices] = useState<OfficeDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadContactContent = async () => {
      try {
        const [settingsDoc, pageDoc, officesList] = await Promise.all([
          getActiveDocument<WebsiteSettingsDocument>('/website-settings'),
          getActiveDocument<ContactPageDocument>('/contact-page'),
          getCollection<OfficeDocument>('/offices'),
        ]);

        if (!isMounted) {
          return;
        }

        if (settingsDoc) {
          setSettings(settingsDoc);
        }
        if (pageDoc) {
          setContactPage(pageDoc);
        }
        if (officesList) {
          setOffices(officesList.filter((o) => o.isActive !== false));
        }
      } catch (error) {
        console.error('Failed to load contact content:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadContactContent();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#f4f4f4] min-h-screen text-black font-sans pt-32 pb-20 selection:bg-[#0055ff]/10 selection:text-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 animate-pulse">
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="h-4 w-36 rounded bg-black/10"></div>
              <div className="h-12 w-3/4 rounded bg-black/10"></div>
            </div>
            <div className="space-y-4">
              <div className="h-6 w-48 rounded bg-black/10"></div>
              <div className="h-4 w-full rounded bg-black/10"></div>
              <div className="h-4 w-5/6 rounded bg-black/10"></div>
            </div>
          </div>
          <div className="bg-white border border-black/10 p-10 space-y-6">
            <div className="h-8 w-48 rounded bg-black/10"></div>
            <div className="space-y-4">
              <div className="h-10 w-full rounded bg-black/10"></div>
              <div className="h-10 w-full rounded bg-black/10"></div>
              <div className="h-28 w-full rounded bg-black/10"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const officesToRender = offices.length > 0
    ? [...offices].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : [];

  const departmentalContacts = contactPage?.departmentalContacts?.length
    ? contactPage.departmentalContacts
    : [];

  const showContactsColumn = departmentalContacts.length > 0 || !!settings.email;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      await submitContact({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });
      setShowSuccess(true);
      setForm({ name: '', email: '', subject: 'Corporate', message: '' });
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      setSubmitError('Unable to send your message right now. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f4f4f4] min-h-screen text-black font-sans pt-32 pb-20 selection:bg-[#0055ff]/10 selection:text-black">
      {/* Hero Section */}
      <section className="px-6 md:px-12 pb-20 border-b border-black/10">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="inline-block border-b border-[#0055ff] pb-1.5">
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-black/60">
              Contact Us
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.05] max-w-5xl">
            {contactPage?.heroTitle || 'Get in touch.'}
          </h1>
          <p className="text-xl md:text-2xl text-black/60 font-light max-w-3xl leading-relaxed">
            {contactPage?.heroDescription || 'Have a question about our operations, partnerships, investor relations, or media inquiries? Reach out to the appropriate team below, and we will get back to you as soon as possible.'}
          </p>
        </div>
      </section>

      {/* Contact Form & General Inquiries */}
      <section className="section-spacing px-6 md:px-12 border-b border-black/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* General Inquiries */}
          {showContactsColumn && (
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-4">
                <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40">
                  Departmental Contacts
                </h2>
                <p className="text-2xl font-light tracking-tight text-black">
                  Direct channels for specific inquiries.
                </p>
              </div>

              <div className="space-y-6">
                {departmentalContacts.map((contact) => (
                  <div key={contact.label} className="border-t border-black/10 pt-4 space-y-2">
                    <span className="text-xs font-mono text-[#0055ff] uppercase">{contact.label}</span>
                    <p className="text-sm font-medium">
                      <a href={`mailto:${contact.email}`} className="hover:text-[#0055ff] transition-colors">
                        {contact.email}
                      </a>
                    </p>
                    <p className="text-xs text-black/50 font-light">{contact.description}</p>
                  </div>
                ))}

                {settings.email ? (
                  <div className="border-t border-black/10 pt-4 space-y-2">
                    <span className="text-xs font-mono text-[#0055ff] uppercase">Corporate Office</span>
                    <p className="text-sm font-medium">
                      <a href={`mailto:${settings.email}`} className="hover:text-[#0055ff] transition-colors">
                        {settings.email}
                      </a>
                    </p>
                    <p className="text-xs text-black/50 font-light">For general corporate inquiries.</p>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Interactive Form */}
          <div className={showContactsColumn ? "lg:col-span-7" : "lg:col-span-12"}>
            <div className="border border-black/10 p-8 md:p-10 bg-[#f4f4f4] space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-light tracking-tight">
                  {contactPage?.formTitle || 'Send a Message'}
                </h3>
                <p className="text-xs text-black/50 font-mono uppercase">
                  {contactPage?.formInstructions || 'All fields are required'}
                </p>
              </div>

              {showSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="h-12 w-12 rounded-full border border-green-600 flex items-center justify-center text-green-600">
                    <Check size={24} />
                  </div>
                  <h3 className="text-2xl font-light">Message Sent Successfully</h3>
                  <p className="text-sm text-black/60 font-light max-w-md">
                    Thank you for reaching out. We have routed your inquiry to our team, and we will get in touch with you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-black/50">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleInputChange}
                        className="w-full bg-[#f4f4f4] border border-black/10 p-3 text-sm font-light focus:outline-none focus:border-[#0055ff] transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-black/50">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleInputChange}
                        className="w-full bg-[#f4f4f4] border border-black/10 p-3 text-sm font-light focus:outline-none focus:border-[#0055ff] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-black/50">Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleInputChange}
                      className="w-full bg-[#f4f4f4] border border-black/10 p-3 text-sm font-light focus:outline-none focus:border-[#0055ff] transition-colors cursor-pointer"
                    >
                      <option value="Corporate">Corporate Inquiries</option>
                      <option value="Investor">Investor Relations</option>
                      <option value="Media">Media & PR</option>
                      <option value="Partnership">Merchant Partnerships</option>
                      <option value="Support">General Support</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-black/50">Message</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleInputChange}
                      className="w-full bg-[#f4f4f4] border border-black/10 p-3 text-sm font-light focus:outline-none focus:border-[#0055ff] transition-colors resize-none"
                    />
                  </div>

                  {submitError ? (
                    <p className="text-sm text-red-600 font-light">{submitError}</p>
                  ) : null}

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-black text-[#f4f4f4] text-xs font-semibold uppercase tracking-wider hover:bg-[#0055ff] transition-all duration-300 disabled:bg-black/40 cursor-pointer"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      {officesToRender.length > 0 && (
        <section className="section-spacing px-6 md:px-12">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40">
                {contactPage?.officeSectionTitle || 'Our Offices'}
              </h2>
              <p className="text-3xl md:text-4xl font-light tracking-tight max-w-2xl">
                {contactPage?.officeSectionSubtitle || 'Where we build the future of hyper-local commerce.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {officesToRender.map((office, idx) => (
                <div key={idx} className="border-t border-black/10 pt-6 space-y-4">
                  <h3 className="text-xl font-medium tracking-tight flex items-center gap-2">
                    <MapPin size={18} className="text-[#0055ff]" strokeWidth={1.5} /> {office.city}
                  </h3>
                  <p className="text-sm text-black/60 font-light leading-relaxed">
                    {office.address}
                  </p>
                  {office.phone ? (
                    <p className="text-xs font-mono text-black/40">
                      <Phone size={12} className="inline mr-1" /> {office.phone}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
