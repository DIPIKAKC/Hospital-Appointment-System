import React from "react";
import './Dashboard.css';
// import userImg from '../../Images/user.jpg';
import aboutImg from '../../Images/about2.jfif';

import DoctorProfileCard from "../../Components/DoctorProfile";

const Home= () => {

    return(
        <div className="main">

            <div className="cover">
                <h1>Book Appointments With<br />
                    Your Trusted Doctors</h1>
                <p className="p1">MedEase to your care.</p>
                <button className="book-appointment">
                    Book Appointment
                </button>
            </div>

            <div className="doctors-section">
                <h1>Our Members</h1> 
                <div className="doctor-cards">
                    <DoctorProfileCard /> <DoctorProfileCard /> <DoctorProfileCard />
                </div>
                
            </div>

            <div className="about-us">
                <div className="left-side">
                    <img className='about-img' src={aboutImg} alt="about-us"></img>                
                </div>
                <div className="right-side">
                    <h1> About Us</h1>
                    <p className="p2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                        printer took a galley of type and scrambled it to make a type specimen book. It has survived
                        not only five centuries, but also the leap into electronic typesetting, remaining essentially
                        unchanged. It was popularised in the 1960s with the release of Letraset sheets containing 
                        Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
                        including versions of Lorem Ipsum.not only five centuries, but also the leap into electronic typesetting, remaining essentially
                        unchanged. It was popularised in the 1960s with the release of Letraset sheets containing 
                        Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
                        including versions of Lorem Ipsum.
                    </p>
                </div>

            </div>

            <div className="why-us">
                <div className="left">
                    <h1> Why Choose us?</h1>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                        printer took a galley of type and scrambled it to make a type specimen book. It has survived
                        not only five centuries</p>
                </div>
                <div className="right">
                        <div className="why-box">
                            <h3>Easy to use</h3>
                            <p>Lorem Ipsum is simply dummy text of the.</p>
                        </div>
                        <div className="why-box">
                            <h3>Trusted Doctors</h3>
                            <p>Lorem Ipsum has been the industry's standard</p>
                        </div>
                        <div className="why-box">
                            <h3>24/7 available</h3>
                            <p>Lorem Ipsum is simply dummy text of the printing</p>    
                        </div>
                        <div className="why-box">
                            <h3>Quality Service</h3>
                            <p>Lorem Ipsum has been the industry's standards</p>
                        </div>
                </div>
            </div>

            <div className="create-account-section">
                <div className="r-side">
                    <h1> Are you ready to dive into easy healthcare services?</h1>
                    <button className="create-account">Create Account</button>
                </div>
            </div>

        </div>
    )
}

export default Home;