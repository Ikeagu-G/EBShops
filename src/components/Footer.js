import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* About Section */}
        <div className="footer-section">
          <h4>About Ebshops</h4>
          <p>Your one-stop shop for insecticides, perfumes, and general merchandise.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul>
            <li>
              <a 
                href="https://web.facebook.com/profile.php?id=61571918573862" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </li>
            <li>
              <a 
                href="https://api.whatsapp.com/send?phone=08032913274" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="copyright">
        <p>&copy; {new Date().getFullYear()} Ebshops. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;