import React from 'react';

import doctorImg from '../../assets/docfemale.jpg';
import './DoctorProfile.css';

const DoctorHomeCard = ({doctor}) => {
    
   

    return (
    <div className="profile-card">
        <div className="profile-header">
            <div className="doctor-details">
            <div className="experience">Experience</div>
            <div className="experience-value">{doctor.experience}</div><br/>
            <div className="name">{doctor.fullName}</div>
            <div className="specialty">{doctor.department.name}</div>
            </div>
            <div className="doctor-image">
                <img src={doctorImg} alt="Doctor"></img>
            </div>
        </div>
        <div className="about-section">
            <div className="about-title">About the doctor</div>
            <div className="about-description">
            {/* Dr. Rive roe, specializes in diagnosing and treating digestive disorders, 
            offering comprehensive care to improve patients' gastrointestinal 
            health and quality of life. */}
                {doctor.description}
            </div>
        </div>
    </div>
  );
};

export default DoctorHomeCard;