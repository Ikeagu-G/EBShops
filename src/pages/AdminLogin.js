import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/AdminLogin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://127.0.0.1:5000/admin/login", 
        credentials, // Send username & password from state
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Response:", response.data);

      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        navigate("/admin/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Server error. Check backend.");
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          name="username" 
          placeholder="Username" 
          value={credentials.username} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={credentials.password} 
          onChange={handleChange} 
          required 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
