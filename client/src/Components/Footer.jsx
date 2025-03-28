import React from 'react';
import { Link } from 'react-router-dom';

import './Footer.css';

const Footer = () => {
    
    return (
        <div className="footer-container">
            <div className='footer-info'>
                <div className='about'>
                    <button className="logo">
                        <Link to= "/" /> MedEase
                    </button>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
                </div>
                <div className='navigation'>
                    <Link to="/home" className="nav-item">Home</Link>
                    <Link to="/appointments" className="nav-item">Appointments</Link>
                    <Link to="/doctors" className="nav-item">Doctors</Link>
                    <Link to="/contact" className="nav-item">Contact Us</Link>
                </div>
                <div className='terms'>
                    <Link to="/our-terms" className="nav-item">Our Terms</Link>
                    <Link to="/privacy" className="nav-item">Privacy Policy</Link>
                </div>
            </div>
            <p className='copyrights'>Copyright 2025 @ MedEase - All Rights Reseved</p>
        </div>
  );

};

export default Footer;