import React from 'react';
import './App.css';
import Header from './Components/Header';
import HomePage from './Components/HomePage';
import { Routes, Route } from 'react-router-dom';
import Products from './Components/Products';
import About from './Components/About';
import Contact from './Components/Contact';
import Login from './Components/Login';
import Register from './Components/Register';
import Profile from './Components/Profile';
import Footer from './Components/Footer';
import AddProduct from './Components/AddProduct';
import AISuggestions from './Components/AISuggestions';
import Subscribe from './Components/Subscribe';
import Payment from './Components/Payment';
import ForgotPassword from './Components/ForgotPassword';

function App() {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<Products />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgotpassword" element={<ForgotPassword></ForgotPassword>} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/subscribe" element={<Subscribe />} />
                <Route path="/payment/:userId" element={<Payment />}/>
                <Route path="/addproduct" element={<AddProduct />} />
                <Route path="/ai-suggest" element={<AISuggestions />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;