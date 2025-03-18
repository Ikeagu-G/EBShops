import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Import components and pages
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './components/CartComponent';
import Checkout from './pages/Checkout';
import CustomerProducts from './pages/CustomerProducts';

// Admin pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import AdminAddProduct from './pages/AdminAddProduct';

import './styles/App.css';

const API_BASE_URL= process.env.REACT_APP_API_BASE_URL;

const App = () => {
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);
  const [products, setProducts] = useState([]);

  // Fetch products from backend /products endpoint
  useEffect(() => {
    axios.get(`${API_BASE_URL}/products`)
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  return (
    <Router>
      <Header cart={cart} />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} />} />
          <Route path="/products" element={<CustomerProducts products={products} addToCart={addToCart} />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={isAdmin ? <AdminOrders /> : <AdminLogin setIsAdmin={setIsAdmin} />} />
          <Route path="/admin/products/add" element={isAdmin ? <AdminAddProduct /> : <AdminLogin setIsAdmin={setIsAdmin} />} />
          <Route path="/admin/products" element={isAdmin ? <AdminProducts /> : <AdminLogin setIsAdmin={setIsAdmin} />} />
          
        </Routes>
      </main>
    </Router>
  );
};

export default App;
