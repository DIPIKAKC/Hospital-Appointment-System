import React from 'react';
import { useNavigate } from 'react-router-dom';
import doctorImg from '../../assets/docfemale.jpg';
import "./DoctorCard.css";
import { Phone, Mail} from 'lucide-react';
import { PiMoneyWavy } from "react-icons/pi";


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
    navigate(`/doctor/${doctor._id}`);
  }

  const isAvailable = doctor.availableSlots && doctor.availableSlots.length > 0;

  // return (
  //   <div className="doctor-personal-card-container">
  //     <div className="doctor-personal-card" onClick={handleCardClick}>
  //       <div className="doctor-personal-card-details">
  //         <div className="experience-personal-card-label">Experience</div>
  //         <div className="experience-personal-card-value">{doctor.experience}</div>
  //         <div className="doctor-personal-card-name">
  //           {doctor.fullName}
  //           <span
  //             className={`availability-personal-card-indicator ${isAvailable ? 'available' : 'unavailable'}`}
  //             title={isAvailable ? 'Available' : 'Not Available'}
  //           />
  //         </div>
  //         <div className="doctor-personal-card-specialty">{doctor.department?.name}</div>
  //         <button className="book-personal-card-appointment-btn" onClick={handleBookAppointment}>Book Appointment</button>
  //       </div>
  //       <div className="doctor-personal-card-photo">
  //         <img src={doctorImg} alt="Doctor" />
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
      <div className="doc-card-container" onClick={handleCardClick}>
        <div className="doc-card-content">
          <div className="doc-card-image">
            <img 
              src={doctor.profile || doctorImg} 
              alt="Doctor profile"
            />
          </div>
          <div className="doc-card-info">
            <div className="doc-card-header">
              <div>
                <div className="doc-card-department">{doctor.department.name}</div>
                <h2 className="doc-card-name">Dr. {doctor.fullName}</h2>
              </div>
              <div 
                className={`doc-card-availability`}
              >
                Verified
              </div>
            </div>
            
            <div className="doc-card-experience">
              <div className="doc-card-stars">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <span className="doc-card-years">{doctor.experience} years</span>
            </div>
            
            <div className="doc-card-contact">
            <div className="doc-card-contact-item">
              <span className="doc-card-contact-icon"><PiMoneyWavy size={20} color='green'/></span>
              <span>{doctor.doctorfee}</span>
            </div>
              <div className="doc-card-contact-item">
                <span className="doc-card-contact-icon"><Mail size={18}/></span>
                <span>{doctor.email}</span>
              </div>
            </div>
            
            <button 
              className='doc-card-book-button'
                onClick={handleBookAppointment}
            >
              <span className="doc-card-button-content">
                Book Appointment
              </span>
            </button>
          </div>
        </div>
  
      </div>
    );
};

export default DoctorCard;