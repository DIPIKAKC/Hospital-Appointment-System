import React from "react";
import '../User/ContactUs.css';
import DocBar from "../../Components/Doctor/DoctorNavbar";
import Footer from "../../Components/User/Footer";
import FooterDoc from "../../Components/Doctor/FooterDoctor";

const DocContact = () => {
    return(
        <>
        <DocBar />
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
    
    <FooterDoc />
    </>
    )
}

export default DocContact;