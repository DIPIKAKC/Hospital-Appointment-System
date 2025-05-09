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

  const isAvailable = doctor.availableSlots && doctor.availableSlots.length > 0;

  return (
    <div className="doctor-personal-card-container">
      <div className="doctor-personal-card" onClick={handleCardClick}>
        <div className="doctor-personal-card-details">
          <div className="experience-personal-card-label">Experience</div>
          <div className="experience-personal-card-value">{doctor.experience}</div>
          <div className="doctor-personal-card-name">
            {doctor.fullName}
            <span
              className={`availability-personal-card-indicator ${isAvailable ? 'available' : 'unavailable'}`}
              title={isAvailable ? 'Available' : 'Not Available'}
            />
          </div>
          <div className="doctor-personal-card-specialty">{doctor.department?.name}</div>
          <button className="book-personal-card-appointment-btn" onClick={handleBookAppointment}>Book Appointment</button>
        </div>
        <div className="doctor-personal-card-photo">
          <img src={doctorImg} alt="Doctor" />
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;