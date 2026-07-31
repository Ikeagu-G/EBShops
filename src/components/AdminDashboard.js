import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  // Access control lives in ProtectedRoute; this component no longer inspects
  // localStorage for a token that cookie-based auth never writes.
  const handleLogout = async () => {
    setLoggingOut(true);
    // logout() swallows request errors, so navigation always happens. The old
    // version awaited an un-caught POST to a route that did not exist, so a
    // 404 rejected the promise and the redirect never ran.
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-links">
        <Link to="/admin/orders" className="dashboard-card">📦 Manage Orders</Link>
        <Link to="/admin/products" className="dashboard-card">🛒 Manage Products</Link>
      </div>
      <button onClick={handleLogout} className="logout-btn" disabled={loggingOut}>
        {loggingOut ? 'Logging out…' : 'Logout'}
      </button>
    </div>
  );
};

export default AdminDashboard;
