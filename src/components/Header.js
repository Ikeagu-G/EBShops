import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHome, FiInfo, FiPhoneCall, FiPackage } from 'react-icons/fi';
import '../styles/Header.css';

const Header = ({ cart = [] }) => {
  // Sum quantities rather than counting lines: two of the same item is "2", not
  // "1". The old cart.length was also wrong once quantities could change.
  const itemCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

  return (
    <header className="header">
      <div className="overlay">
        <Link to="/" className="logo-link">
          <h1 className="logo">Ebshops</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link"><FiHome /> Home</Link>
          <Link to="/products" className="nav-link"><FiPackage /> Products</Link>
          <Link to="/about" className="nav-link"><FiInfo /> About</Link>
          <Link to="/contact" className="nav-link"><FiPhoneCall /> Contact</Link>
          <Link to="/cart" className="nav-link cart-link">
            <FiShoppingCart /> Cart <span className="cart-count">{itemCount}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
