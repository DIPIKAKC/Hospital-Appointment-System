import React from 'react';
import { Link } from 'react-router-dom';

import './Footer.css';

const Footer = () => {
    
    return (
        <div className="footer-container">
            <div className='footer-info'>
                <div className='about'>
                    <button className="foot-logo">
                        <Link to= "/" /> MedEase
                    </button>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
                </div>
                <div className='footer'>
                    <Link to="/" className="footer-link">Home</Link>
                    <Link to="/appointments" className="footer-link">Appointments</Link>
                    <Link to="/find-doctors" className="footer-link">Doctors</Link>
                    <Link to="/contact-us" className="footer-link">Contact Us</Link>
                </div>
                <div className='terms'>
                    <Link to="/our-terms" className="footer-link">Our Terms</Link>
                    <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                </div>
            </div>
            <p className='copyrights'>Copyright 2025 @ MedEase - All Rights Reseved</p>
        </div>
  );

};

export default Footer;