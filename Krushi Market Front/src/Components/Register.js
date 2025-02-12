import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [farmName, setFarmName] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        if (!name || !email || !phone || !password || !confirmPassword || !farmName || !location || !image) {
            setError('All fields are required.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            setError('');
        } else {
            setError('Please enter a valid email address.');
        }

        const phonePattern = /^[6-9]\d{9}$/;
        if (phonePattern.test(phone)) { 
            setError('');
        }else{
            setError('Phone number must be 10 digits.');
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('password', password);
            formData.append('farmName', farmName);
            formData.append('location', location);
            formData.append('image', image);

            console.log(formData);
            

            const response = await fetch('http://localhost:8080/user/register', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Registration successful! Please login.');
                setName('');
                setEmail('');
                setPhone('');
                setPassword('');
                setConfirmPassword('');
                setFarmName('');
                setLocation('');
                setImage(null);
            } else {
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.log(error);
            setError('An error occurred during registration. Please try again later.');
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Register</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="phone">Phone:</label>
                        <input type="text" id="phone" maxLength={10}  pattern="[6-9]{1}[0-9]{9}" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="farmName">Farm Name:</label>
                        <input type="text" id="farmName" value={farmName} onChange={(e) => setFarmName(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="location">Location:</label>
                        <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="image">Image:</label>
                        <input type="file" id="image" onChange={handleImageChange} required />
                        {image && ( 
                            <div>
                                <img src={URL.createObjectURL(image)} alt={image.name} style={{ maxWidth: '200px' }} />
                            </div>
                        )}
                    </div>
                    <button type="submit">Register</button>
                    <p className="login-link">
                        Already registered? <Link to="/login">Login now</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;