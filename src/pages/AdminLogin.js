import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/AdminLogin.css';

const API_BASE_URL= process.env.REACT_APP_API_BASE_URL;

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password){
      setError("Please enter both username and password");
      return;
    }
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, 
        
      
        credentials, // Send username & password from state
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Response:", response.data);
      const token = response.data.token || response.data.access_token;

      if (token) {
        localStorage.setItem("adminToken", token);
        navigate("/admin/dashboard");
      } else {
        setError("Login failed: No token received.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      if (err.response){
        const status = err.response.status;
        if (status === 401){
          setError("Invalid username or password.");
        }else if ( status === 500){
          setError("Server error. Please try again later.");
        }else {
          setError(`Error ${status}: ${err.response.data.message || "Unknown error"}`);
        }
      }else if (err.request){
        setError("Network error. Check your connection or backend status.");
      }else{
        setError("An unexpected error occurred.");
      }
      }finally{
        setLoading(false);
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
