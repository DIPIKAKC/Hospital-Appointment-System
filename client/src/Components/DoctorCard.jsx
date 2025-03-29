// import React, {useState, useEffect} from 'react';
// import doctorImg from '../Images/docfemale.jpg';
// import "./DoctorCard.css";

// const DoctorCard = () => {
//     const [doctor, setDoctor] = useState({
//         fullName: "",
//         department: ""
//     });

//     useEffect(() => {
//         // const id = localStorage.getItem("doctorId");
//         const fetchDoctor = async () => {
//             try {
//                     const response = await fetch("http://localhost:5000/auth/all-doctors");
//                     const data = await response.json();
//                     console.log("Fetched single doctor:", data); // Debugging
                    
//                     if (data) {
//                         setDoctor(data);
//                     }
//                 }  catch (error) {
//                 console.error("Error fetching doctor data:", error);
//             }
//         };

//         fetchDoctor();
//     }, []);


//   return (
//     <div className="doctor-card-container">
//       <div className="doctor-card">

//         <div className="doctor-details">
//           <div className="experience-label">Experience</div>
//           <div className="experience-value">2 years</div>
//           <div className="doctor-name">{doctor.fullName}</div>
//           <div className="doctor-specialty">{doctor.department}</div>
//           <button className="book-appointment-btn">Book Appointment</button>
//         </div>
//         <div className="doctor-photo">
//             <img src={doctorImg} alt="Doctor"></img>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default DoctorCard;




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
    

