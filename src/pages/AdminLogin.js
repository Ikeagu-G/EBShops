import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, checking, login } = useAuth();

  const redirectTo = location.state?.from || '/admin/dashboard';

  // If an existing cookie session is still valid, skip the form.
  useEffect(() => {
    if (!checking && isAdmin) {
      navigate(redirectTo, { replace: true });
    }
  }, [checking, isAdmin, navigate, redirectTo]);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      // Success is signalled by a 2xx plus httpOnly cookies. The old code looked
      // for response.data.token, which the backend never returns, so a correct
      // password still showed "Login failed: No token received."
      await login(credentials.username, credentials.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError(getErrorMessage(err, 'Login failed. Please try again.'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      {/* The error state was previously set but never rendered, leaving failures
          silent apart from a console log. */}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          autoComplete="username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
