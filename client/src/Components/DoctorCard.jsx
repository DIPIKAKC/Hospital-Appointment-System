import React, {useState, useEffect} from 'react';
import doctorImg from '../Images/docfemale.jpg';
import "./DoctorCard.css";

const DoctorCard = () => {
    const [doctor, setDoctor] = useState({
        fullName: "",
        department: ""
    });

    useEffect(() => {
        const id = localStorage.getItem("doctorId");
        const fetchDoctor = async () => {
            try {
                if (id) {
                    const response = await fetch(`http://localhost:5000/auth/available-doctors/${id}`);
                    const data = await response.json();
                    console.log("Fetched single doctor:", data); // Debugging
                    
                    if (data) {
                        setDoctor(data);
                    }
                } else {
                    const response = await fetch("http://localhost:5000/auth/available-doctors");
                    const data = await response.json();
                    console.log("Fetched doctor list:", data); // Debugging

                    if (Array.isArray(data) && data.length > 0) {
                        setDoctor(data[0]); // Assuming you want to display the first doctor
                    }else if (data.fullName) {
                        setDoctor(data); // If the API returns a single doctor object
                    }
                    
                }   
            } catch (error) {
                console.error("Error fetching doctor data:", error);
            }
        };

        fetchDoctor();
    }, []);


  return (
    <div className="doctor-card-container">
      <div className="doctor-card">
        <div className="doctor-image">
            <img src={doctorImg} alt="Doctor"></img>
        </div>
        <div className="doctor-details">
          <div className="experience-label">Experience</div>
          <div className="experience-value">2 years</div>
          <div className="doctor-name">{doctor.fullName}</div>
          <div className="doctor-specialty">{doctor.department}</div>
          <button className="book-appointment-btn">Book Appointment</button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;

