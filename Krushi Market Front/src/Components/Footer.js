import React from 'react';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-social"> {/* Social media at the top */}
            <h3>Follow Us</h3>
            <a href="#" className="social-icon">
              <FaFacebookF />
            </a>
            <a href="#" className="social-icon">
              <FaTwitter />
            </a>
            <a href="#" className="social-icon">
              <FaInstagram />
            </a>
          </div>
          <div></div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} Krushi Market. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;