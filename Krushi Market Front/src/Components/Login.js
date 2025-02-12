import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadCaptchaEnginge, validateCaptcha, LoadCanvasTemplate } from "react-simple-captcha";
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadCaptchaEnginge(6, 'orange', 'black', 'upper');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            setError('');
        } else {
            setError('Please enter a valid email address.');
        }

        let user_captcha = document.getElementById('user_captcha_input').value;

        if (validateCaptcha(user_captcha)) {
            try {
                const response = await fetch('http://localhost:8080/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Invalid email or password.');
                }

                const data = await response.json();
                const jwt = data.accessToken;

                localStorage.setItem('jwt', jwt);
                navigate('/profile');

            } catch (err) {
                setError(err.message);
            }
        } else {
            setError("Captcha Does Not Match!");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>} {/* Display error message */}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="captcha-container">
                        <LoadCanvasTemplate />
                        <div className="captcha-input-group">
                            <label htmlFor="user_captcha_input">Enter Captcha:</label>
                            <input type="text" id="user_captcha_input" name="user_captcha_input" required />
                        </div>
                    </div>

                    <button type="submit">Login</button>
                </form>
                <p className="forgot-link">
                        Click here to reset password ! <Link to="/forgotpassword">Forgot Password</Link>
                    </p>
            </div>
        </div>
    );
};

export default Login;