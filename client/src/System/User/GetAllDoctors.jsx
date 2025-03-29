
import React, { useEffect, useState } from 'react';
import './GetAllDoctor.css';
import DoctorCard from '../../Components/DoctorCard';

const GetAllDoctors = () => {

    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {

            try{
                const response = await fetch("http://localhost:5000/auth/all-doctors");
                const data = await response.json();
                console.log(data);

                if (Array.isArray(data)){
                    // const uniqueDoctors = [...new Set(data.map((doc) => JSON.stringify(doc)))].map(JSON.parse); // Ensuring uniqueness
                    setDoctors(data);
                }
            } catch(error){
                    console.log(error);
            }
        }
        fetchDoctors();
    }, []);

  return (
      <main className="main-content">
        <div className="sidebar">
          <div className="departments-section">
            <h2>Departments</h2>
            <p className="find-text">Find by speciality</p>
            
            <div className="department-list">
              <div className="department-item active">
                Department Name
              </div>
              <div className="department-item">
                Department Name
              </div>
              <div className="department-item">
                Department Name
              </div>
            </div>
          </div>
        </div>

        <div className="content-area">
          <div className="search-bar">
            <i className="search-icon">🔍</i>
            <input type="text" placeholder="Search by name" />
          </div>

        <div className='doctors-card-container'>
            {Array.isArray(doctors) && doctors.length > 0 ? (
                doctors.map((doctor) => (
                    <DoctorCard key = {doctor._id} doctors = {doctor} />
                ))

             ) : (
                    <p> No Doctors Available </p>
                
            )}
        </div>

        </div>
{/* 
        <div className='resource-btn'>
            <Resources / >
        </div> */}

      </main>
  );
};

export default GetAllDoctors;







