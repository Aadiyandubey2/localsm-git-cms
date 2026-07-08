import React from 'react';
import { LogOut, Menu, Save } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../services/api';
import { clearAuth } from '../../store/authSlice';
import { setSidebarOpen } from '../../store/uiSlice';
import type { AdminDispatch, AdminRootState } from '../../store';

export default function TopBar() {
  const dispatch = useDispatch<AdminDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: AdminRootState) => state.auth.user);
  const { saveStatus, hasUnsavedChanges } = useSelector((state: AdminRootState) => state.ui);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      dispatch(clearAuth());
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const statusLabel = {
    idle: hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved',
    saving: 'Saving...',
    saved: 'Saved successfully',
    error: 'Save failed',
  }[saveStatus];

  const statusColor = {
    idle: hasUnsavedChanges ? 'text-amber-400' : 'text-emerald-400',
    saving: 'text-blue-400',
    saved: 'text-emerald-400',
    error: 'text-red-400',
  }[saveStatus];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(true))}
        >
          <Menu size={18} />
        </button>
        <div className={`flex items-center gap-2 text-sm ${statusColor}`}>
          <Save size={14} />
          <span>{statusLabel}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-100">{user?.name}</p>
          <p className="text-xs text-slate-400">{user?.email}</p>
        </div>
        <button type="button" onClick={handleLogout} className="admin-btn admin-btn-secondary">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
