import React from 'react';
import './About.css';
import KrushiMarket from "../Images/KrushiMarket.png"

export default function About() {
    return (
        <div className="about-container">
            <div className="about-content">
                <div className="krushi-market-logo"> {/* Add logo container */}
                    <img src={KrushiMarket} alt="KrushiMarket Logo" /> {/* Replace with your logo path */}
                </div>
                <h1>About KrushiMarket</h1>
                <p>
                    KrushiMarket is an online platform dedicated to connecting farmers directly with consumers. Our mission is to empower farmers by providing them with a direct channel to sell their produce, while also offering consumers access to fresh, high-quality, and locally sourced food.
                </p>
                <p>
                    We believe in transparency and sustainability. We strive to create a marketplace where farmers receive fair prices for their hard work, and consumers can make informed choices about the food they buy. We are committed to supporting local agriculture and building a stronger, more connected community.
                </p>

                <h2>Our Values</h2>
                <ul>
                    <li><strong>Supporting Local Farmers:</strong> We prioritize connecting consumers with local farmers to foster community growth and sustainability.</li>
                    <li><strong>Fresh and Healthy Produce:</strong> We are committed to providing access to the freshest, highest-quality produce directly from the source.</li>
                    <li><strong>Transparency and Trust:</strong> We believe in open communication and building trust between farmers and consumers.</li>
                    <li><strong>Fair Pricing:</strong> We ensure that farmers receive fair compensation for their products.</li>
                    <li><strong>Sustainability:</strong> We promote sustainable farming practices and reduce the environmental impact of food distribution.</li>
                </ul>

                <h2>Our Team</h2>
                <p>
                    We are a passionate team of individuals dedicated to making a positive impact on the agricultural community. Our team includes experienced professionals in technology, agriculture, and business.  We are united by our belief in the importance of connecting farmers and consumers.
                </p>
                <div className="team-members">
                    <div className="team-member">
                        <h3>Rahul Bodkhe</h3>
                    </div>
                    <div className="team-member">
                        <h3>Shubham Bangar</h3>
                    </div>
                </div>

                <h2>Contact Us</h2>
                <p>
                    Have questions or feedback? We'd love to hear from you!
                    <br />
                    Email: <a href="mailto:ihelp.krushimarket@gmail.com">info@krushimarket.com</a>
                    <br />
                    Phone: +91-8308259733
                </p>
            </div>
        </div>
    );
}