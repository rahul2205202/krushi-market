import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // Import your CSS file
import AddProduct from './AddProduct'; // Import if you use it
import Subscribe from './Subscribe'; // Import if you use it

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({});
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);
    const [products, setProducts] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [updatedProduct, setUpdatedProduct] = useState({});
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

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('jwt');
                        navigate('/login');
                        return;
                    }
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const userData = await response.json();
                setUser(userData);
                setUpdatedUser(userData);
                console.log(userData);
                setProfileImage(userData.imagePath);

                const subscriptionResponse = await fetch('http://localhost:8080/subscription/find?userId=' + userData.userID, { 
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (subscriptionResponse.ok) {
                    const subscriptionData = await subscriptionResponse.json();
                    console.log(subscriptionData);
                    
                    setIsSubscribed(subscriptionData);
                    console.log("Subscription Data:", subscriptionData);
                } else if (subscriptionResponse.status === 404) {
                  setIsSubscribed(false);
                  console.log("No subscription found.");
                } else {
                    console.error("Failed to fetch subscription status:", subscriptionResponse.status);
                    setIsSubscribed(false);
                }

                const productsResponse = await fetch(`http://localhost:8080/product/user/${userData.userID}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (productsResponse.ok) {
                    const productsData = await productsResponse.json();
                    setProducts(productsData);
                } else {
                    console.error("Failed to fetch products");
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
        
    }, [navigate]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await fetch(`http://localhost:8080/user/update/${user.userID}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const userData = await response.json();
            setUser(userData);
            setUpdatedUser(userData);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleImageChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

   
    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setUpdatedProduct({ ...product });
    };

    const handleUpdateProduct = async () => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await fetch(`http://localhost:8080/product/update/${editingProduct.productID}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const updatedProductData = await response.json();
            setProducts(products.map(p => (p.productID === updatedProductData.productID ? updatedProductData : p)));
            setEditingProduct(null);
            alert("Product updated successfully!");

        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateProductInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct(prevState => ({ ...prevState, [name]: value })); 
    };

    const handleDeleteProduct = async (productID) => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await fetch(`http://localhost:8080/product/delete/${productID}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            setProducts(products.filter(product => product.productID !== productID));
            alert("Product deleted successfully!");

        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleSubscribeClick = () => {
        if (isSubscribed) {
        } else {
            navigate('/subscribe'); 
        }
    };
    const handleAddProductClick = () => {
        if (isSubscribed) {
            navigate('/addproduct');
        } else {
            alert("Please subscribe to post a product.");
        }
    };


    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-image">
                    <img src={profileImage} alt="Profile" />
                    <input type="file" onChange={handleImageChange} id="imageUpload" className="image-upload" accept="image/*" />
                    <label htmlFor="imageUpload" className="image-upload-label">Change Profile Image</label>
                </div>
                <div className="profile-info">
                    <div className="user-details">
                        <p><strong>Your Name:</strong> {user.name || "-"}</p>
                        <p><strong>Phone:</strong> {user.phone || "-"}</p>
                        <p><strong>Farm Name:</strong> {user.farmName}</p>
                        <p><strong>Address:</strong> {user.location || "-"}</p>
                    </div>

                    {!isEditing && <button onClick={handleEdit} className="edit-button">Edit Profile</button>}
                </div>
            {!isSubscribed && (
                <div className="add-product-button-container">
                    <button onClick={handleSubscribeClick} className="add-product-button">
                        Subscribe to Post Products
                    </button>
                </div>
            )}
            {isSubscribed && (
                <div className="add-product-button-container">
                    <button onClick={handleAddProductClick} className="add-product-button">
                        Post Your Product
                    </button>
                </div>
            )}

            </div>

            

            {isEditing && (
                <div className="edit-profile-form">
                    <form>
                        <label htmlFor="name">Your Name:</label>
                        <input type="text" id="name" name="name" placeholder="name" value={updatedUser.name || ""} onChange={handleInputChange} />
                        <label htmlFor="farmName">Farm Name:</label>
                        <input type="text" id="farmName" name="farmName" placeholder="Farm Name" value={updatedUser.farmName || ""} onChange={handleInputChange} />
                        <label htmlFor="phone">Phone:</label>
                        <input type="text" id="phone" name="phone" placeholder="Phone" value={updatedUser.phone || ""} onChange={handleInputChange} />
                        
                        <label htmlFor="location">Address:</label>
                        <input type="text" id="location" name="location" placeholder="Address" value={updatedUser.location || ""} onChange={handleInputChange} />

                        <button type="button" onClick={handleSave} className="save-button">Save</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
                    </form>
                </div>
            )}
            

            <div className="products-section">
                <h2>Your Products</h2>
                {products.length > 0 ? (
                    <ul className="product-list">
                        {products.map((product) => (
                            <li key={product.productID} className="product-item">
                                <p><strong>Name:</strong> {product.productName}</p>
                                <p><strong>Price:</strong> {product.basePrice} Rs</p>
                                <p><strong>Quantity:</strong> {product.quantity}</p>
                                <div className="product-actions">
                                    <button onClick={() => handleEditProduct(product)} className="edit-product-button">Edit</button>
                                    <button onClick={() => handleDeleteProduct(product.productID)} className="delete-product-button">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No products added yet.</p>
                )}
            </div>

            {editingProduct && (
        <div className="edit-product-form">
            <h3>Edit Product</h3>
            <form>
                <label htmlFor="productName">Product Name:</label>
                <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={updatedProduct.productName || ""}
                    onChange={handleUpdateProductInputChange}
                />

                <label htmlFor="productPrice">Price:</label>
                <input
                    type="text"
                    id="productPrice"
                    name="basePrice"
                    value={updatedProduct.basePrice || ""}
                    onChange={handleUpdateProductInputChange}
                />

                <label htmlFor="productQuantity">Quantity:</label>
                <input
                    type="text"
                    id="productQuantity"
                    name="quantity"
                    value={updatedProduct.quantity || ""}
                    onChange={handleUpdateProductInputChange}
                />

                <button type="button" onClick={handleUpdateProduct} className="save-button">
                    Update Product
                </button>
                <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="cancel-button"
                >
                    Cancel
                </button>
            </form>
        </div>
    )}
        </div>
    );
};

export default Profile;
