import React, { useState, useEffect } from 'react';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/product/all');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const productData = await response.json();
        setProducts(productData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="products-container">
      <h1>Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.productId} className="product-card"> {/* Use a unique key */}
            <img src={product.imagePath} alt={product.productName} className="product-image" /> {/* Display image */}
            <h3>{product.productName}</h3>
            <p className="product-description">{product.description}</p>
            <p className="product-price">Price: ₹{product.basePrice}</p>
            <p className="product-farmer">Farmer Phone: {product.phoneNumber}</p> {/* Display farmer's phone number */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;