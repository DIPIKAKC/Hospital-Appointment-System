import React, { useEffect, useState } from "react";
import "../../Pages/User/UserDashboard.css"
import aboutImg from "../../assets/about3.jpg"

import { useParams, useNavigate } from "react-router-dom";
import DoctorHomeCard from "./DoctorProfileCard";
import { toast } from "sonner";




const DashboardComponent = () => {
    const navigate = useNavigate();
    const {doctorId} = useParams();
    const [doctor, setDoctor] = useState([])

        const fetchDoctor = async () => {
            
                   try {
                     const response = await fetch("http://localhost:5000/auth/all-doctors");
                     const data = await response.json();
                   console.log("first" ,data)
                   console.log("second", data.data)
                     if(data.success){
                         setDoctor(data.data.slice(0,3))
                         
                     }else{

                         console.log("Errro on fetching doctor"); 
                     }
                     
 
                   } catch (error) {
                    console.log("Error while getting doctors : ", error)
                    
                   }     
        };

    


    useEffect(()=>{
        fetchDoctor()
    },[doctorId])

    
    console.log("doc ", doctor)
    
    const handleBookAppointment = () => {
        // Check if user is logged in by looking for a token or user data in localStorage
        const token = localStorage.getItem('token'); // Assuming you store auth token in localStorage
        
        if (token) {
            // User is logged in, redirect to find-doctors page
            navigate('/find-doctors');
        } else {
            // User is not logged in, show alert
            alert('Please create an account to book an appointment');
        }
    }
   
    return (
     <div>
            <div className="main">
                <div className="cover">
                    <h1>Book Appointments With<br />
                        Your Trusted Doctors</h1>
                    <p className="p1">MedEase to your care.</p>
                    <button className="book-appointment" onClick={handleBookAppointment}>
                        Book Appointment
                    </button>
                    <div className="cover-img"></div>
                </div>

                <div className="doctors-section">
                    <h1>Our Members</h1> 
                    <div className="doctor-cards">
                        {
                            doctor.map((doc, index)=>(
                                <DoctorHomeCard key={index} doctor={doc} />
                            )
                            )
                        }
                        
                      
                    </div>
                </div>

                <div className="about-us">
                    <div className="left-side">
                        <img className='about-img' src={aboutImg} alt="about-us"></img>                
                    </div>
                    <div className="right-side">
                        <h1>About Us</h1>
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
                    <div className="left-pane">
                        <h1>Why choose Us?</h1>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting <br />industry. 
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                            printer took a galley of type<br/> and scrambled it to make a type specimen book. It has survived
                            not only five centuries not<br /> only five centuries</p>
                    </div>
                    <div className="right-pane">
                        <div className="box">
                            <h3>Easy to use</h3>
                            <p>Lorem Ipsum is simply dummy text of the.</p>
                        </div>
                        <div className="box">
                            <h3>Easy to use</h3>
                            <p>Lorem Ipsum is simply dummy text of the.</p>
                        </div>
                        <div className="box">
                            <h3>Easy to use</h3>
                            <p>Lorem Ipsum is simply dummy text of the.</p>
                        </div>
                        <div className="box">
                            <h3>Easy to use</h3>
                            <p>Lorem Ipsum is simply dummy text of the.</p>
                        </div>
                    </div>
                </div>

                <div className="create-account-section">
                    <div className="r-side">
                        <h1>Are you ready to dive into easy healthcare journey?</h1>
                        <button className="create-account">Create Account</button>
                    </div>
                </div>
            </div>
        
           
            </div>
    )
}

export default DashboardComponent;