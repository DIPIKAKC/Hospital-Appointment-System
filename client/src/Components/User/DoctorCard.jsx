import React from 'react';
import { useNavigate } from 'react-router-dom';
import doctorImg from '../../assets/docfemale.jpg';
import "./DoctorCard.css";


const DoctorCard = ({ doctor }) => {

  const navigate = useNavigate();

    // Ensure the doctor prop exists and contains the required properties
    if (!doctor || !doctor.fullName) {
      return <div>No doctor data available</div>;
    }

  const handleCardClick = () =>{
    navigate(`/doctor/${doctor._id}`);
  }

  const handleBookAppointment = () =>{
    navigate(`doctor/${doctor._id}`);
  }

  return (
    <div className="doctor-card-container">
      <div className="doctor-card" onClick={handleCardClick}>
        <div className="doctor-details">
          <div className="experience-label">Experience</div>
          <div className="experience-value">{doctor.experience}</div>
          <div className="doctor-name">{doctor.fullName}</div>
          <div className="doctor-specialty">{doctor.department?.name}</div>
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