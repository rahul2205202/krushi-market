import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Subscribe.css';
import { useNavigate } from 'react-router-dom';

const Subscribe = () => {
    const [user, setUser] = useState(null);
    const [subscriptionType, setSubscriptionType] = useState('Monthly');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const plans = {
        Monthly: { name: "Monthly", price: 10, description: "Access to basic features, limited usage. Perfect for trying out our platform." },
        Yearly: { name: "Yearly", price: 100, description: "All the benefits of the Basic plan, billed annually at a discounted rate. Save 20%!" },
        PREMIUM_MONTHLY: { name: "Premium (Monthly)", price: 20, description: "Unlock premium features, higher usage limits, and priority support." },
        PREMIUM_YEARLY: { name: "Premium (Yearly)", price: 200, description: "All the benefits of the Premium plan, billed annually at a discounted rate. Save 20%!" },
    };

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
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const userData = await response.json();
                setUser(userData);

            } catch (err) {
                setError(err.message);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        const selectedPlan = plans[subscriptionType];

        if (!selectedPlan) {
            setError("Invalid subscription type selected.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/subscription/${user.userID}/subscribe`, {
                subscriptionType: subscriptionType,
                price: selectedPlan.price,
            });

            navigate(`/payment/${user.userID}`, { state: { subscriptionDetails: response.data.subscriptionDetails, selectedPlan: selectedPlan } });

        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred during subscription.');
            console.error("Subscription error:", error);
        } finally {
            setLoading(false);
        }
        navigate(`/payment/${user.userID}`)
    };

    return (
        <div className="subscribe-container">
            <h2>Subscribe</h2>
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubscribe}>
                <div className="form-group">
                    <label htmlFor="subscriptionType">Subscription Type:</label>
                    <select id="subscriptionType" value={subscriptionType} onChange={(e) => setSubscriptionType(e.target.value)} required>
                        {Object.keys(plans).map((planKey) => (
                            <option key={planKey} value={planKey}>
                                {plans[planKey].name} (₹{plans[planKey].price})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="plan-description">
                    {plans[subscriptionType] && (
                        <div>
                            <p>{plans[subscriptionType].description}</p>
                            <p className="plan-price">Price: ₹{plans[subscriptionType].price}</p>
                        </div>
                    )}
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Processing..." : "Pay with Razorpay"}
                </button>
            </form>
        </div>
    );
};

export default Subscribe;