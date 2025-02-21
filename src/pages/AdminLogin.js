import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';

const AdminLogin = ({ setIsAdmin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    axios.post('http://127.0.0.1:5000/admin/login', credentials)
      .then(response => {
        // If login is successful, update the admin state in your app.
        setIsAdmin(true);
        navigate('/admin/orders');
      })
      .catch(err => {
        setError('Invalid username or password');
      });
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      {error && <p className="error">{error}</p>}
      <input 
        type="text" 
        name="username" 
        placeholder="Username" 
        value={credentials.username} 
        onChange={handleChange} 
      />
      <input 
        type="password" 
        name="password" 
        placeholder="Password" 
        value={credentials.password} 
        onChange={handleChange} 
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default AdminLogin;