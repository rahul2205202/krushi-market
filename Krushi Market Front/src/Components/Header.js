import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import your CSS file

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div>
          <p className='header-text'>Krushi Market</p>
        </div>

        <button className="hamburger-menu" onClick={toggleMobileMenu}>
          <div className="hamburger-bar"></div>
          <div className="hamburger-bar"></div>
          <div className="hamburger-bar"></div>
        </button>

        <nav className={`nav ${isMobileMenuOpen ? 'mobile-nav-open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="nav-link">Products</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">About Us</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>
            <li className="nav-item">
              <Link to="/ai-suggest" className="nav-link">AI Suggest</Link>
            </li>
             {localStorage.getItem('jwt') ? (
                <li className="nav-item">
                  <Link to="/profile" className="nav-link">Profile</Link>
                </li>
              ) : null}
            <li className="nav-item">
              {localStorage.getItem('jwt') ? (
                <button onClick={() => {localStorage.removeItem('jwt'); window.location.href = '/';}} className="nav-link logout-button">Logout</button>
              ) : (
                <Link to="/login" className="nav-link">Login</Link>
              )}
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link">Register</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;