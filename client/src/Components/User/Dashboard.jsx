import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import aboutImg from "../../assets/about3.jpg";
import DoctorHomeCard from "./DoctorProfileCard";

const DashboardComponent = () => {
    const [doctor, setDoctor] = useState([]);

    const fetchDoctor = async () => {
        try {
            const response = await fetch("http://localhost:5000/auth/all-doctors");
            const data = await response.json();
            
            if (data.success) {
                setDoctor(data.data.slice(0, 3));
            } else {
                console.log("Error on fetching doctor");
            }
        } catch (error) {
            console.log("Error while getting doctors : ", error);
        }
    };

    useEffect(() => {
        fetchDoctor();
    }, []);

    const handleBookAppointment = () => {
        // Check if user is logged in by looking for a token or user data in localStorage
        const token = localStorage.getItem('token'); // Assuming you store auth token in localStorage
        
        if (token) {
            // User is logged in, redirect to find-doctors page
            window.location.href = '/find-doctors';
        } else {
            // User is not logged in, show alert
            alert('Please create an account to book an appointment');
        }
    };

    const handleCreateAccount = () => {
        window.location.href = '/signup';
    };

    return (
        <div>
            <div className="main">
                {/* Cover/Hero Section */}
                <div className="cover">
                    <div className="cover-content">
                        <h1>Book Appointments With<br />Your Trusted Doctors</h1>
                        <p className="p1">MedEase to your care.</p>
                        <button className="book-appointment-db" onClick={handleBookAppointment}>
                            Book Appointment
                        </button>
                    </div>
                    <div className="cover-img"></div>
                </div>

                {/* Doctors Section */}
                <div className="doctors-section">
                    <h1>Our Expert Physicians</h1>
                    <div className="doctor-cards">
                    <div className="doctor-cards">
                        {
                            doctor.map((doc, index)=>(
                                <DoctorHomeCard key={index} doctor={doc} />
                            )
                            )
                        }                 
                    </div>
                    </div>
                </div>

                {/* About Us Section */}
                <div className="about-us">
                    <div className="left-side">
                        <img className='about-img' src={aboutImg} alt="about-us" />             
                    </div>
                    <div className="right-side">
                        <h1>About Us</h1>
                        <p className="p2">
                            At MedEase, we're committed to making healthcare accessible and convenient for everyone. Our platform connects patients with qualified healthcare professionals, allowing you to book 
                            appointments, consult with doctors, and manage your healthcare journey with ease.
                            With years of experience in the healthcare industry, we understand the challenges patients face 
                            and have designed our service to eliminate barriers to quality care. Our user-friendly platform 
                            ensures that finding and booking appointments with the right healthcare providers is simple and hassle-free.
                        </p>
                    </div>
                </div>

                {/* Why Us Section */}
                <div className="why-us">
                    <div className="left-pane">
                        <h1>Why choose Us?</h1>
                        <p>
                            MedEase offers a seamless healthcare experience with features designed to simplify your 
                            medical journey. Our platform provides access to verified healthcare professionals, 
                            secure communication, and convenient appointment scheduling all in one place.
                        </p>
                    </div>
                    <div className="right-pane">
                        <div className="box">
                            <h3>Easy Scheduling</h3>
                            <p>Book appointments with just a few clicks, anytime and anywhere.</p>
                        </div>
                        <div className="box">
                            <h3>Verified Doctors</h3>
                            <p>All doctors on our platform are verified and highly qualified.</p>
                        </div>
                        <div className="box">
                            <h3>Appointment Reminders</h3>
                            <p>Never miss an appointment with our reminder system.</p>
                        </div>
                        <div className="box">
                            <h3>Secure & Private</h3>
                            <p>Your health information is protected with top-tier security.</p>
                        </div>
                    </div>
                </div>

                {/* Create Account Section */}
                <div className="create-account-section">
                    <div className="r-side">
                        <h1>Ready to dive into an easy healthcare journey?</h1>
                        <p>Join thousands of patients who have simplified their healthcare journey with MedEase.</p>
                        <button className="create-account" onClick={handleCreateAccount}>Create Account</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardComponent;