import React from 'react';

import doctorImg from '../../assets/docfemale.jpg';
import './DoctorCard.css';
import { Phone, Mail} from 'lucide-react';
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { PiMoneyWavy } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';

const DoctorHomeCard = ({doctor}) => {
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
//     return (
//     <div className="profile-card">
//         <div className="profile-header">
//             <div className="doctor-details">
//             <div className="experience">Experience</div>
//             <div className="experience-value">{doctor.experience}</div><br/>
//             <div className="name">{doctor.fullName}</div>
//             <div className="doc-specialty">{doctor.department.name}</div>
//             </div>
//             <div className="doctor-image">
//                 <img src={doctorImg} alt="Doctor"></img>
//             </div>
//         </div>
//         <div className="about-section">
//             <div className="about-title">About the doctor</div>
//             <div className="about-description">
//             {/* Dr. Rive roe, specializes in diagnosing and treating digestive disorders, 
//             offering comprehensive care to improve patients' gastrointestinal 
//             health and quality of life. */}
//                 {doctor.description}
//             </div>
//         </div>
//     </div>
//   );

    return (
    <div className="doc-card-container" onClick={handleCardClick}>
      <div className="doc-card-content">
        <div className="doc-card-image">
          <img 
            src={doctor.profile || doctorImg}
            alt="Doctor"
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
            {/* <div className="doc-card-contact-item">
              <span className="doc-card-contact-icon"><Phone size={18}/></span>
              <span>{doctor.contact}</span>
            </div> */}
            <div className="doc-card-contact-item">
              <span className="doc-card-contact-icon"><Mail size={18}/> </span>
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

export default DoctorHomeCard;



