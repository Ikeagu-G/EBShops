import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHome, FiInfo, FiPhoneCall } from 'react-icons/fi';
import '../styles/Header.css'; // Create a corresponding CSS file

const Header = ({ cart, isAdmin, setIsAdmin }) => {
  return (
    <header className="header">
      <div className="overlay">
        {/*<img src="/logo.png" alt="Ebshops Logo" className="logo-image" />*/}
        <h1 className="logo">Ebshops</h1>
        <nav className="nav">
          <Link to="/" className="nav-link"><FiHome /> Home</Link>
          <Link to="/about" className="nav-link"><FiInfo /> About</Link>
          <Link to="/contact" className="nav-link"><FiPhoneCall /> Contact</Link>
          <Link to="/cart" className="nav-link cart-link">
            <FiShoppingCart /> Cart <span className="cart-count">{cart.length}</span>
          </Link>
          
        </nav>
        
      </div>
    </header>
  );
};

export default Header;
