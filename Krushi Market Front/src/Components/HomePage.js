import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; 
import KrushiMarket from "../Images/KrushiMarket.png"

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-image">
          <img src={KrushiMarket} alt="Krushi Market Hero" />
        </div>
        <div className="hero-content">
          <h1>Welcome to Krushi Market</h1>
          <p>Your one-stop shop for fresh, locally sourced agricultural products. Contact directly to farmers for best prices and quality.</p>
          <Link to="/products" className="browse-products-link">Browse Products</Link>
        </div>
      </section>
      <section className="about-us">
        <div className="section-content">
          <h2>About Us</h2>
          <p>
          We're passionate about creating a sustainable food system that benefits both farmers and consumers.  Our platform connects you directly with local farms, ensuring fair prices for their hard work and access to the freshest, seasonal produce for you. Explore our mission to support local agriculture and promote sustainable practices.
        </p>
          <Link to="/about" className="learn-more-link">Learn More</Link>
        </div>
      </section>

      <section className="featured-categories">
        <div className="section-content">
          <h2>Featured Categories</h2>
          <div className="category-grid">
            <div className="category">
              <img src="https://krushimarket.s3.eu-north-1.amazonaws.com/1433943442.jpg" alt="Fruits" />
              <h3>Fruits</h3>
              <Link to="/products" className="view-category-link">View All</Link>
            </div>
            <div className="category">
              <img src="https://krushimarket.s3.eu-north-1.amazonaws.com/askwell-wholegrains-videoSixteenByNineJumbo1600.jpg" alt="Vegetables" />
              <h3>Vegetables</h3>
              <Link to="/products" className="view-category-link">View All</Link>
            </div>
            <div className="category">
              <img src="https://krushimarket.s3.eu-north-1.amazonaws.com/wp3104916.webp" alt="Grains" /> {/* Replace with your image path */}
              <h3>Grains</h3>
              <Link to="/products" className="view-category-link">View All</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;