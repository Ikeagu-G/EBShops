import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import api from './api';
import { AuthProvider } from './context/AuthContext';

// Import components and pages
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
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

const CART_STORAGE_KEY = 'ebshops_cart';

const readStoredCart = () => {
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const App = () => {
  // Persist the cart so a refresh or an accidental navigation does not empty it.
  const [cart, setCart] = useState(readStoredCart);
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Storage may be unavailable (private mode, quota); the cart still works
      // in memory for this session.
    }
  }, [cart]);

  useEffect(() => {
    let cancelled = false;

    api
      .get('/products')
      .then((response) => {
        if (cancelled) return;
        // Guard against a non-array payload: products.map would crash the tree.
        setProducts(Array.isArray(response.data) ? response.data : []);
        setProductsError('');
      })
      .catch(() => {
        if (cancelled) return;
        setProductsError('Could not load products. Please refresh to try again.');
      })
      .finally(() => {
        if (!cancelled) setLoadingProducts(false);
      });

    // Avoid a state update after unmount (React 18 StrictMode double-mounts).
    return () => {
      cancelled = true;
    };
  }, []);

  // Adding the same product twice previously created two separate lines, each
  // stuck at quantity 1. Merge by id and bump the quantity instead.
  const addToCart = useCallback((product) => {
    setCart((current) => {
      const existingIndex = current.findIndex((item) => item.id === product.id);
      if (existingIndex !== -1) {
        return current.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, price: Number(product.price) || 0, quantity: 1 }];
    });
  }, []);

  // Keyed by product id rather than array index, so removing an item cannot
  // remove the wrong row after the list has shifted.
  const removeFromCart = useCallback((productId) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    const nextQuantity = Number(quantity);
    setCart((current) => {
      if (!Number.isFinite(nextQuantity) || nextQuantity < 1) {
        return current.filter((item) => item.id !== productId);
      }
      return current.map((item) =>
        item.id === productId ? { ...item, quantity: Math.floor(nextQuantity) } : item
      );
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  return (
    <Router>
      <AuthProvider>
        <Header cart={cart} />
        <main className="main-content">
          {productsError && <p className="error-message">{productsError}</p>}
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <Home products={products} addToCart={addToCart} loading={loadingProducts} />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/cart"
              element={
                <Cart
                  cart={cart}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                  clearCart={clearCart}
                />
              }
            />
            <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
            <Route
              path="/products"
              element={
                <CustomerProducts
                  products={products}
                  addToCart={addToCart}
                  loading={loadingProducts}
                />
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            {/* Every admin route sits behind the guard. Previously isAdmin was
                initialised to `true` and /admin/dashboard had no check at all,
                leaving the whole admin area publicly reachable. */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/add" element={<AdminAddProduct />} />
            </Route>

            <Route
              path="*"
              element={
                <div className="page-container">
                  <h2 className="page-title">Page not found</h2>
                  <p>
                    The page you are looking for does not exist. <Link to="/">Go home</Link>.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;
