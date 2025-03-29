import React from 'react';
import doctorImg from '../Images/docfemale.jpg';
import "./DoctorCard.css";

const DoctorCard = ({ doctors }) => {
  return (
    <div className="doctor-card-container">
      <div className="doctor-card">
        <div className="doctor-details">
          <div className="experience-label">Experience</div>
          <div className="experience-value">2 years</div>
          <div className="doctor-name">{doctors.fullName}</div>
          <div className="doctor-specialty">{doctors.department}</div>
          <button className="book-appointment-btn">Book Appointment</button>
        </div>
        <div className="doctor-photo">
          <img src={doctorImg} alt="Doctor" />
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;