import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authApi, getStoredToken } from '../../services/api';
import { clearAuth, setAuthLoading, setUser } from '../../store/authSlice';
import type { AdminDispatch, AdminRootState } from '../../store';
import LoadingSkeleton from './LoadingSkeleton';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const dispatch = useDispatch<AdminDispatch>();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useSelector((state: AdminRootState) => state.auth);

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      const token = getStoredToken();
      if (!token) {
        dispatch(clearAuth());
        return;
      }

      dispatch(setAuthLoading(true));

      try {
        const user = await authApi.me();
        if (isMounted) {
          dispatch(setUser(user));
        }
      } catch {
        if (isMounted) {
          dispatch(clearAuth());
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="admin-root p-8">
        <LoadingSkeleton rows={3} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
