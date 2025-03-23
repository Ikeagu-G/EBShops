import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setisAdmin]= useState(false);
  // Protect the admin dashboard and persist session
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
    else {setisAdmin(true)}
  }, [navigate]);

  const handleLogout = () => {
      localStorage.removeItem("adminToken"); // In case it's stored there
    navigate("/admin/login");
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-links">
        <Link to="/admin/orders" className="dashboard-card">📦 Manage Orders</Link>
        <Link to="/admin/products" className="dashboard-card">🛒 Manage Products</Link>
      </div>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
