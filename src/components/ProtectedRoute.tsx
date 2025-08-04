import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isSettingUp } = useAuth();

  if (!isAuthenticated && !isSettingUp) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};