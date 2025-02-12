// AddProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';

const AddProduct = ({ }) => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:8080/user/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const userData = await response.json();
            setUser(userData);
            console.log(userData);
            

        } catch (err) {
            setError(err.message);
        }
      }
        fetchUserProfile();
      const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/category/all');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const categoriesData = await response.json();
            setCategories(categoriesData);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    },[navigate]);
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name || !description || !price || !category || !image) {
            setError('All fields are required.');
            return;
        }

        const formData = new FormData();
        console.log(category);
        
        formData.append('userID', user.userID);
        formData.append('productName', name);
        formData.append('description', description);
        formData.append('basePrice', price);
        formData.append('quantity', quantity);
        formData.append('categoryID', category);
        formData.append('image', image);
        console.log(formData);
        

        try {
            const token = localStorage.getItem('jwt');
            const response = await fetch('http://localhost:8080/product/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const productData = await response.json();
            onProductAdded(productData); // Call the callback function to update the product list in Profile
            setSuccess('Product added successfully!');

            setTimeout(() => {
                // navigate('/profile');  No need to navigate here. Profile will re-render because of onProductAdded
            }, 1000);

            setName('');
            setDescription('');
            setPrice('');
            setCategory('');
            setImage(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const onProductAdded = () => {
      navigate('/profile')
    };

    return (
        <div className="add-product-container">
            <div className="add-product-box">
                <h2>Add Product</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="description">Description:</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="price">Base Price:</label>
                        <input type="text" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="quantity">Product quantity:</label>
                        <input type="text" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="category">Category:</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.categoryID} value={cat.categoryID}>
                                    {cat.categoryName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="image">Image:</label>
                        <input type="file" id="image" onChange={handleImageChange} required />
                        {image && <p className="image-name">Selected Image: {image.name}</p>}
                    </div>
                    <button type="submit" onSubmit={onProductAdded}>Add Product</button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;