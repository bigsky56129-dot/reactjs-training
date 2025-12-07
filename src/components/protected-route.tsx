import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { hasPermission, Permission } from '../utils/rbac';

type ProtectedRouteProps = {
  children: React.ReactElement;
  requiredPermission?: Permission;
  fallback?: string;
};

/**
 * Protected route wrapper that checks permissions
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  fallback = '/login',
}) => {
  const { user } = useAuth();

  // Not authenticated
  if (!user) {
    return <Navigate to={fallback} replace />;
  }

  // Check permission if required
  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    return <Navigate to="/pages/unauthorized" replace />;
  }

  return children;
};
