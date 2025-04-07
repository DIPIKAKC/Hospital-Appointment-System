import React from "react";
// import contactImg from  '../../assets/contact.png'
import './ContactUs.css';
import NavBar from "../../Components/Navbar";
import Resources from "../../Components/Resources";
import Footer from "../../Components/Footer";



const ContactUs = () => {

    return(
        <>
        <NavBar />
        <div className="contact-container">
            <div className="right">
                <h2>Contact Details</h2>
                <h3>Tel: 01-424224 <br/> Phone: 977-9876456389 <br /> Hotline: 2335</h3>
                <h3 className="mail-link" target="_blank" rel="noopener noreferrer"><img src="https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_48dp.png" alt="Gmail Logo" class="gmail-logo" />Email: MedEase122@gmail.com</h3>
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