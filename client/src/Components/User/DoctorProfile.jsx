import React from 'react';
import { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import doctorImg from '../../assets/docfemale.jpg';
import './DoctorProfile.css';
import {  Mail, Clock} from 'lucide-react';
import { PiMoneyWavy } from "react-icons/pi";


const DoctorProfileCard = () => {
    const {doctorId} = useParams();
    const [doctor, setDoctor] = useState({
        fullName: "",
        department: "",
        experience: "",
        description: "",
        contact:"",
        email:"" 
    });

    useEffect(() => {        
        const fetchDoctor = async () => {
            try {
                if (doctorId) {
                    const response = await fetch(`http://localhost:5000/auth/doctor/${doctorId}`);
                    const data = await response.json();
                    console.log("Fetched single doctor:", data); // Debugging
                    
                    if (data) {
                        setDoctor(data);
                    }
                }else {
                    const response = await fetch("http://localhost:5000/auth/all-doctors");
                    const data = await response.json();
                    console.log("Fetched doctor list:", data); // Debugging

                    if (Array.isArray(data) && data.length > 0) {
                        setDoctor(data[0]); // to display the first doctor
                    }else if (data.fullName) {
                        setDoctor(data); // If the API returns a single doctor object
                    }
                    
                }   
            } catch (error) {
                console.error("Error fetching doctor data:", error);
            }
        };

        fetchDoctor();
    }, [doctorId]); // doctorId as dependency to re-fetch if it changes
    

return (
    <>
    <div className="doctor-card-ok">
      {/* Doctor Info Section */}
      <div className="doctor-info">
        <div className="doctor-header">
          <div className="doctor-image-circle">
            <img 
              src={doctor.profile || doctorImg} 
              alt="Doctor" 
            />
          </div>
          
          <div className="doctor-header-content">
            <div className="doctor-name-section">
              <h2 className="doctor-name">Dr. {doctor.fullName}</h2>
              <p className="doctor-experience">{doctor.experience} experience</p>
            </div>
            <div className="department-badge">
              {doctor.department.name}
            </div>
          </div>
          
        </div>

        <div className="about-section">
          <h3 className="section-title">About</h3>
          <p className="about-text">
            {doctor.description} </p>
        </div>

        <div className="contact-section">
          <h3 className="section-title">Additional Information</h3>
          <div className="contact-item">
            <PiMoneyWavy size={19} className="contact-icon" />
            <span>{doctor.doctorfee}</span>
          </div>
          <div className="contact-item">
            <Mail size={16} className="contact-icon" />
            <span>{doctor.email}</span>
          </div>
          <div className="contact-item">
            <Clock size={16} className="contact-icon" />
            <span>Appointment duration: 30 minutes</span>
          </div>
        </div>
          
      </div>
    </div>
    </>
  );
};

export default DoctorProfileCard;