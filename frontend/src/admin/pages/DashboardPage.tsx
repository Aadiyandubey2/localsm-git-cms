import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Layers3,
  Image,
  Mail,
  Menu,
  Palette,
  Settings2,
  Sparkles,
  User,
} from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import {
  brandingApi,
  businessesApi,
  collectImageUrls,
  contactsApi,
  footerApi,
  foundersApi,
  heroesApi,
  navigationApi,
} from '../services/api';

const quickLinks = [
  { to: '/admin/hero', label: 'Hero', icon: Sparkles, description: 'Homepage headline and image' },
  { to: '/admin/founder', label: 'Founder', icon: User, description: 'Founder letter and portrait' },
  { to: '/admin/businesses', label: 'Businesses', icon: Briefcase, description: 'Platform cards and CTAs' },
  { to: '/admin/services', label: 'Services', icon: Layers3, description: 'Service cards and ordering' },
  { to: '/admin/navigation', label: 'Navigation', icon: Menu, description: 'Menu links and logo' },
  { to: '/admin/contact', label: 'Contact Inbox', icon: Mail, description: 'Form submissions' },
  { to: '/admin/company-information', label: 'Company Info', icon: Settings2, description: 'Website identity and contact details' },
  { to: '/admin/branding', label: 'Branding', icon: Palette, description: 'Colors, logo, site name' },
  { to: '/admin/media', label: 'Media Library', icon: Image, description: 'Uploaded and site images' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    businesses: 0,
    contacts: 0,
    images: 0,
    unreadContacts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [heroes, founders, businesses, navigation, footer, branding, contacts] = await Promise.all([
          heroesApi.list(),
          foundersApi.list(),
          businessesApi.list(),
          navigationApi.list(),
          footerApi.list(),
          brandingApi.list(),
          contactsApi.list(),
        ]);

        const imageUrls = collectImageUrls([heroes, founders, businesses, navigation, footer, branding]);

        setStats({
          businesses: businesses.length,
          contacts: contacts.length,
          images: imageUrls.length,
          unreadContacts: contacts.filter((contact) => !contact.isRead).length,
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return <LoadingSkeleton rows={3} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs items={[{ label: 'Dashboard' }]} />
        <h1 className="mt-2 text-2xl font-semibold text-white">Content Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage all website sections from one place. Changes appear on the live site after saving.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="admin-card">
          <p className="text-xs uppercase tracking-wider text-slate-400">Businesses</p>
          <p className="mt-2 text-3xl font-semibold text-white">{stats.businesses}</p>
        </div>
        <div className="admin-card">
          <p className="text-xs uppercase tracking-wider text-slate-400">Contact Messages</p>
          <p className="mt-2 text-3xl font-semibold text-white">{stats.contacts}</p>
        </div>
        <div className="admin-card">
          <p className="text-xs uppercase tracking-wider text-slate-400">Unread Messages</p>
          <p className="mt-2 text-3xl font-semibold text-amber-400">{stats.unreadContacts}</p>
        </div>
        <div className="admin-card">
          <p className="text-xs uppercase tracking-wider text-slate-400">Site Images</p>
          <p className="mt-2 text-3xl font-semibold text-white">{stats.images}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              className="admin-card block transition-colors hover:border-blue-500/40 hover:bg-slate-800/60"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-600/20 p-2 text-blue-300">
                  <Icon size={18} />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-100">{link.label}</h2>
                  <p className="mt-1 text-sm text-slate-400">{link.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
