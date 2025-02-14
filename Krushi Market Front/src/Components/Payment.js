import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Payment.css';
import { useNavigate, useParams } from 'react-router-dom';

const Payment = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false); // Track script load

    useEffect(() => {
        // 1. Load Razorpay script (most robust method):
        const loadRazorpayScript = () => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => setRazorpayLoaded(true);
            script.onerror = () => console.error("Razorpay script load failed");
            document.body.appendChild(script);
        };

        if (!window.Razorpay) { // Check if Razorpay is already loaded
            loadRazorpayScript();
        } else {
            setRazorpayLoaded(true);
        }
        return () => {
            const script = document.querySelector('script[src*="razorpay"]');
            if (script) {
                script.remove();
            }
        };
    }, []); // Empty dependency array ensures this runs only once

    useEffect(() => {
        // 2. Fetch user data (independent effect):
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

    const handlePayment = async () => {
        if (!razorpayLoaded) {  // Very important!
            console.error("Razorpay not yet loaded!");
            setError("Razorpay is not loaded. Please try again."); // User-friendly message
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`http://localhost:8080/payment/${userId}/do`, {
                amount: 10,  // Replace with actual amount!
                subscriptionType: "Monthly" // Replace as needed!
            });
            console.log(userId);
            
            console.log("Payment Response from backend:", response.data);

            const options = {
                key: "", // Ensure this env variable is set!
                amount: response.data.amount * 100,
                currency: 'INR',
                name: 'Krushi Market',
                description: 'Subscription Payment',
                order_id: response.data.razorpayOrderId,
                handler: async function (response) {
                    try {
                        const verificationResponse = await axios.post('http://localhost:8080/payment/verify', response);
                        console.log("Payment Verification Successful", verificationResponse.data);
                        navigate('/profile');
                    } catch (error) {
                        console.error("Payment Verification Failed", error.response?.data || error.message);
                        setError("Payment verification failed. Please try again.");
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.phone,
                },
                notes: {
                    address: user?.location,
                },
                theme: {
                    color: '#3399cc'
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

            rzp1.on('payment.failed', function (response) {
                console.error("Razorpay payment failed:", response);
                alert(response.error.description);
                setError(response.error.description);
            });

        } catch (error) {
            console.error("Payment Error:", error.response?.data || error.message);
            setError(error.response?.data?.message || "An error occurred during payment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-container">
            <h2>Payment</h2>
            {error && <div className="error-message">{error}</div>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <button onClick={handlePayment} disabled={!razorpayLoaded}> {/* Disable if not loaded */}
                    {razorpayLoaded ? "Pay Now" : "Loading Razorpay..."} {/* Show loading message */}
                </button>
            )}
        </div>
    );
};

export default Payment;
