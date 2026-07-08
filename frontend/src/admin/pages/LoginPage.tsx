import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { authApi, getApiErrorMessage } from '../services/api';
import { setUser } from '../store/authSlice';
import type { AdminDispatch } from '../store';

export default function LoginPage() {
  const dispatch = useDispatch<AdminDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('admin@localsm.com');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from || '/admin';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await authApi.login(email, password);
      dispatch(setUser(data.admin));
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Invalid email or password'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-root flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold">
            LS
          </div>
          <h1 className="text-2xl font-semibold text-white">LocalSM Admin</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to manage website content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="admin-label">Email</label>
            <input
              type="email"
              className="admin-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="admin-label">Password</label>
            <input
              type="password"
              className="admin-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="admin-btn admin-btn-primary w-full">
            {isSubmitting ? <Lock size={16} className="animate-pulse" /> : <LogIn size={16} />}
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
