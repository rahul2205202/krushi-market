import React from 'react';
import './Contact.css';
import  KrushiMarket from "../Images/KrushiMarket.png"

export default function Contact() {
    return (
        <div className="contact-container">
            <div className="contact-content">
                <div className="krushi-market-logo"> {/* Add logo container */}
                    <img src={KrushiMarket} alt="KrushiMarket Logo" /> {/* Replace with your logo path */}
                </div>
                <h1>Contact Us</h1>

                <div className="contact-info">
                    <div className="contact-details">
                        <h2>Get in Touch</h2>
                        <p>
                            Have questions, feedback, or want to partner with us? We'd love to hear from you!
                        </p>
                        <ul>
                            <li><strong>Email:</strong> <a href="mailto:info@krushimarket.com">info@krushimarket.com</a></li>
                            <li><strong>Phone:</strong> +91-8308259733</li> {/* Replace with your phone number */}
                            <li><strong>Address:</strong>IACSD</li> {/* Replace with your address */}
                        </ul>
                    </div>
                </div>

                {/* Optional: Add a map here  */}
                {/* <div className="map-container">
                    <iframe src="YOUR_MAP_EMBED_URL" width="600" height="450" frameborder="0" style="border:0"></iframe>
                </div> */}

            </div>
        </div>
    );
}