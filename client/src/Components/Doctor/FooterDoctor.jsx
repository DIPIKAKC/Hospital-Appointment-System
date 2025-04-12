import React from 'react';
import { Link } from 'react-router-dom';

import '../User/Footer.css';

const FooterDoc = () => {
    
    return (
        <div className="footer-container">
            <div className='footer-info'>
                <div className='about'>
                    <button className="logo">
                        <Link to= "/dashboard" /> MedEase
                    </button>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
                </div>
                <div className='footer'>
                    <Link to="/dashboard" className="footer-link">Manage Schedule</Link>
                    <Link to="/my-assigned-appointments" className="footer-link">My Assigned Appointments</Link>
                    <Link to="/contact" className="footer-link">Contact Us</Link>
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

export default FooterDoc;