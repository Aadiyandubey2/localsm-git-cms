import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  Footprints,
  Image,
  LayoutDashboard,
  Link2,
  Mail,
  Menu,
  Palette,
  Settings2,
  Search,
  Share2,
  Sparkles,
  User,
  Layers3,
  Info,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOpen } from '../../store/uiSlice';
import type { AdminRootState, AdminDispatch } from '../../store';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/hero', label: 'Hero', icon: Sparkles },
  { to: '/admin/founder', label: 'Founder', icon: User },
  { to: '/admin/businesses', label: 'Businesses', icon: Briefcase },
  { to: '/admin/services', label: 'Services', icon: Layers3 },
  { to: '/admin/navigation', label: 'Navigation', icon: Menu },
  { to: '/admin/footer', label: 'Footer', icon: Footprints },
  { to: '/admin/contact', label: 'Contact', icon: Mail },
  { to: '/admin/company-information', label: 'Company Info', icon: Info },
  { to: '/admin/website-settings', label: 'Website Settings', icon: Settings2 },
  { to: '/admin/social', label: 'Social Links', icon: Share2 },
  { to: '/admin/branding', label: 'Branding', icon: Palette },
  { to: '/admin/media', label: 'Media Library', icon: Image },
  { to: '/admin/seo', label: 'SEO', icon: Search },
];

export default function Sidebar() {
  const dispatch = useDispatch<AdminDispatch>();
  const sidebarOpen = useSelector((state: AdminRootState) => state.ui.sidebarOpen);

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-800 bg-slate-950 transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold">LS</div>
          <div>
            <p className="text-sm font-semibold text-white">LocalSM CMS</p>
            <p className="text-xs text-slate-400">Content Manager</p>
          </div>
        </div>

        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => dispatch(setSidebarOpen(false))}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200"
          >
            <Link2 size={14} />
            View live website
          </a>
        </div>
      </aside>

      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
          aria-label="Close sidebar"
        />
      ) : null}
    </>
  );
}
