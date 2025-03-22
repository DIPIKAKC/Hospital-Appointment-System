import React, {useState, useEffect} from 'react';
import doctorImg from '../Images/docfemale.jpg';
import "./DoctorCard.css";
import {FaStar} from 'react-icons/fa'

const DoctorCard = () =>{

    const [doctor,setDoctor]=useState({
        fullName:"",
        department:""
    });

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await fetch("http://localhost:4000/auth/doctors");
                const data = await response.json();
                console.log(data);

                if (data.length > 0) {
                    setDoctor(data[0]); // Assuming you want to display the first doctor
                }
            } catch (error) {
                console.error("Error fetching doctor data:", error);
            }
        };

        fetchDoctor();
    }, []);

    return(
        <div className="doctor-card">

            <div className='text-container'>
                <h2 className='experience'>Experience<br /> years</h2><br />
                <h2 className='name'>{doctor.fullName}<br /> {doctor.department}</h2><br />
                {/* <h2 className='department'>{doctor.department}</h2> */}
                <div className='stars'><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></div>
            </div>

            <img className='doctor-photo' src={doctorImg} alt="Doctor"></img>
            
        </div>
    );
};

export default DoctorCard;
