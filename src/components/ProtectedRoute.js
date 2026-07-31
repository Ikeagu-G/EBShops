import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Gate for admin routes.
 *
 * Renders nothing conclusive while the session check is in flight, so an
 * authenticated admin is not redirected on a slow first load. On failure it
 * sends the user to the login page and remembers where they were heading.
 */
const ProtectedRoute = () => {
  const { isAdmin, checking } = useAuth();
  const location = useLocation();

  if (checking) {
    return <p className="auth-checking">Checking your session…</p>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
