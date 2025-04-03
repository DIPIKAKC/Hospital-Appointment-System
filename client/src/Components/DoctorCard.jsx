import React from 'react';
import { useNavigate } from 'react-router-dom';
import doctorImg from '../Images/docfemale.jpg';
import "./DoctorCard.css";

const DoctorCard = ({ doctors }) => {

  const navigate = useNavigate();

  const handleCardClick = () =>{
    navigate(`/doctor/${doctors._id}`);
  }

  const handleBookAppointment = () =>{
    navigate(`doctor/${doctors._id}`);
  }

  return (
    <div className="doctor-card-container">
      <div className="doctor-card" onClick={handleCardClick}>
        <div className="doctor-details">
          <div className="experience-label">Experience</div>
          <div className="experience-value">2 years</div>
          <div className="doctor-name">{doctors.fullName}</div>
          <div className="doctor-specialty">{doctors.department}</div>
          <button className="book-appointment-btn" onClick={handleBookAppointment}>Book Appointment</button>
        </div>
        <div className="doctor-photo">
          <img src={doctorImg} alt="Doctor" />
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;