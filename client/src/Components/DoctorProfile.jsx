import React from 'react';
import { useState, useEffect } from 'react';
import doctorImg from '../Images/docfemale.jpg';
import './DoctorProfile.css';

const DoctorProfileCard = () => {
    const [doctor, setDoctor] = useState({
        fullName: "",
        department: ""
    });

    useEffect(() => {
        const id = localStorage.getItem("doctorId");
        const fetchDoctor = async () => {
            try {
                if (id) {
                    const response = await fetch(`http://localhost:5000/auth/available-doctors/${id}`);
                    const data = await response.json();
                    console.log("Fetched single doctor:", data); // Debugging
                    
                    if (data) {
                        setDoctor(data);
                    }
                } else {
                    const response = await fetch("http://localhost:5000/auth/available-doctors");
                    const data = await response.json();
                    console.log("Fetched doctor list:", data); // Debugging

                    if (Array.isArray(data) && data.length > 0) {
                        setDoctor(data[0]); // Assuming you want to display the first doctor
                    }else if (data.fullName) {
                        setDoctor(data); // If the API returns a single doctor object
                    }
                    
                }   
            } catch (error) {
                console.error("Error fetching doctor data:", error);
            }
        };

        fetchDoctor();
    }, []);
    
    return (
    <div className="profile-card">
        <div className="profile-header">
            <div className="doctor-details">
            <div className="experience">Experience</div>
            <div className="experience-value">2 years</div><br/>
            <div className="name">{doctor.fullName}</div>
            <div className="specialty">{doctor.department}</div>
            </div>
            <div className="doctor-image">
                <img src={doctorImg} alt="Doctor"></img>
            </div>
        </div>
        <div className="about-section">
            <div className="about-title">About the doctor</div>
            <div className="about-description">
            Dr. Rive roe, specializes in diagnosing and treating digestive disorders, 
            offering comprehensive care to improve patients' gastrointestinal 
            health and quality of life.
            </div>
        </div>
    </div>
  );
};

export default DoctorProfileCard;