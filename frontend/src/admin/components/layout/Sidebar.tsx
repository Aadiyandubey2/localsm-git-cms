import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  Footprints,
  Image,
  LayoutDashboard,
  Link2,
  Menu,
  Palette,
  Settings2,
  Search,
  Share2,
  Sparkles,
  User,
  Globe,
  Home,
  Heart,
  Percent,
  Users,
  DollarSign,
  Building2,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOpen } from '../../store/uiSlice';
import type { AdminRootState, AdminDispatch } from '../../store';

const navGroups = [
  {
    title: 'General',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/admin/media', label: 'Media Library', icon: Image },
    ]
  },
  {
    title: 'Public Pages',
    items: [
      { to: '/admin/homepage', label: 'Homepage Sections', icon: Home },
      { to: '/admin/hero', label: 'Hero Block', icon: Sparkles },
      { to: '/admin/founder', label: 'Founder Note', icon: User },
      { to: '/admin/businesses', label: 'Businesses', icon: Briefcase },
      { to: '/admin/culture-page', label: 'Culture Page', icon: Globe },
      { to: '/admin/careers-page', label: 'Careers Page', icon: Sparkles },
      { to: '/admin/jobs', label: 'Job Openings', icon: Briefcase },
      { to: '/admin/impact-page', label: 'Impact Page', icon: Heart },
      { to: '/admin/investors-page', label: 'Investors Page', icon: DollarSign },
      { to: '/admin/board-members', label: 'Board of Directors', icon: Users },
      { to: '/admin/financial-reports', label: 'Financial Reports', icon: FileText },
      { to: '/admin/shareholding-patterns', label: 'Shareholding Patterns', icon: Percent },
      { to: '/admin/contact-page', label: 'Contact Page Settings', icon: Settings2 },
      { to: '/admin/offices', label: 'Offices', icon: Building2 },
    ]
  },
  {
    title: 'System Settings',
    items: [
      { to: '/admin/navigation', label: 'Navigation Menu', icon: Menu },
      { to: '/admin/footer', label: 'Footer Links', icon: Footprints },
      { to: '/admin/website-settings', label: 'Website Settings', icon: Settings2 },
      { to: '/admin/social', label: 'Social Links', icon: Share2 },
      { to: '/admin/branding', label: 'Branding Colors', icon: Palette },
      { to: '/admin/seo', label: 'SEO Config', icon: Search },
    ]
  }
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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">LS</div>
          <div>
            <p className="text-sm font-semibold text-white">LocalSM CMS</p>
            <p className="text-xs text-slate-400">Content Manager</p>
          </div>
        </div>

        <nav className="space-y-5 p-3 max-h-[calc(100vh-120px)] overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <h3 className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {group.title}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => dispatch(setSidebarOpen(false))}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-blue-600/20 text-blue-300 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`
                      }
                    >
                      <Icon size={16} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950 p-4">
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
