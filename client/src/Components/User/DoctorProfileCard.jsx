import React from 'react';

import doctorImg from '../../assets/docfemale.jpg';
import './DoctorProfile.css';
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
              Available
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

      <style jsx>{`
        .doc-card-container {
          max-width: 290px;
          margin: 20px auto;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .doc-card-content {
          display: flex;
          flex-direction:column;
        }

        .doc-card-image {
          width: 300px;
          flex-shrink: 0;
          background-color:black;
        }

        .doc-card-image img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .doc-card-info {
          padding: 20px;
          flex-grow: 1;
        }

        .doc-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .doc-card-department {
          text-transform: uppercase;
          font-size: 14px;
          font-weight: 600;
          color:rgb(125, 129, 129);
          margin-bottom: 4px;
        }

        .doc-card-name {
          font-size: 20px;
          color: #111827;
        }

        .doc-card-availability {
          border-radius: 50px;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          background-color: #d1fae5;
          color: #047857;
        }

        .available {
          background-color: #d1fae5;
          color: #047857;
        }

        .unavailable {
          background-color: #fee2e2;
          color: #b91c1c;
        }

        .doc-card-experience {
          display: flex;
          align-items: center;
          color: #6b7280;
        }

        .doc-card-stars {
          display: flex;
          color: #fbbf24;
          font-size: 17px;
        }

        .doc-card-years {
          font-size: 14px;
          margin-left: 6px;
        }

        .doc-card-contact {
          margin-top: 14px;
        }

        .doc-card-contact-item {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #4b5563;
          margin-bottom: 6px;
        }

        .doc-card-contact-icon {
          margin-right: 8px;
          font-size: 14px;
        }

        .doc-card-book-button {
          margin-top: 16px;
          width: 100%;
          padding: 10px 16px;
          background-color: #10B8B9;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .doc-card-book-button.disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .doc-card-button-content {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-icon {
          margin-right: 10px;
          color: #666;
        }
        @media (max-width: 640px) {
          .doc-card-content {
            flex-direction: column;
          }

          .doc-card-image {
            width: 100%;
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default DoctorHomeCard;



