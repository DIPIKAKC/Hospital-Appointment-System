import React from "react";
import './ContactUs.css';
import NavBar from "../../Components/User/Navbar";
import Resources from "../../Components/User/Resources";
import Footer from "../../Components/User/Footer";

const ContactUs = () => {
    return(
        <>
        <NavBar />
        <div className="contact-dashboard">
            <div className="contact-info">
                <h2>Contact Details</h2>
                <h3>Tel: 01-424224 <br/> Phone: 977-9876456389 <br /> Hotline: 2335</h3>
                <h3 className="contact-email" target="_blank" rel="noopener noreferrer">
                    <img src="https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_48dp.png" alt="Gmail Logo" className="email-icon" />
                    Email: MedEase122@gmail.com
                </h3>
                <br />
                <h2>Our Location</h2>
                <h3>Samakhusi, Kathmandu</h3>
            </div>
        </div>
    
    <Resources />
    <Footer />
    </>
    )
}

export default ContactUs;