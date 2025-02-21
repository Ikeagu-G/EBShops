import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About'; // Create a simple About page as needed
import Contact from './pages/Contact'; // Create a simple Contact page as needed
import CartComponent from './components/CartComponent';
import Checkout from './pages/Checkout';
import AdminOrders from './pages/AdminOrders';
import AdminLogin from './pages/AdminLogin';
import './styles/App.css';
import axios from 'axios';

axios.defaults.withCredentials = true;

const App = () => {
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const products = [
    { id: 1, name: 'Bedbug Spray', price: 10900.00, image: '/images/Insecticides/BedbugSpray.jpg' },
    { id: 2, name: 'CockRoach Killer', price: 15090.00, image: '/images/Insecticides/cockroach-killing-bait-propoxur-powder.jpg' },
    { id: 3, name: 'Rogue', price: 2500.00, image: '/images/Perfumes/pexels-kdjproductions-1557980.jpg' },
    // ... add more products as needed
  ];

  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  return (
    <Router>
      <Header cart={cart} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <main className="main-content">
        {/* Navigation links can also be placed in Header */}
        <Routes>
          <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<CartComponent cart={cart} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
