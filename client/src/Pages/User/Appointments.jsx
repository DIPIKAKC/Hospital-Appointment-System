
import React, { useEffect, useState } from "react";
import './Appointments.css';
import NavBar from "../../Components/Navbar";
import Resources from "../../Components/Resources";
import Footer from "../../Components/Footer";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
  const fetchAppointments = async () => {
    const token= localStorage.getItem("token")
    try{
        const response = await fetch('http://localhost:5000/auth/appointments',
            {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization : `Bearer ${token}`
                }
            }
        )

        if (!response.ok) {
            throw new Error("Failed to fetch available slots");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
            setAppointments(data);
        }

    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };
  fetchAppointments();
}, []);


const cancelAppointment = async (id) => {

    // Find the appointment in the current state
    const appointmentToCancel = appointments.find(app => app._id === id);
  
    // Don't proceed if the appointment is already canceled
    if (appointmentToCancel.status === 'canceled') {
      alert("This appointment is already canceled");
      return;
    }

  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:5000/auth/${id}/cancel`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();  
    alert("Appointment canceled successfully");

    if (!response.ok) {
      throw new Error("Failed to cancel appointment");
    }

    // Update the local state to reflect the canceled appointment
    setTimeout(() => {
    setAppointments(prevAppointments => 
      prevAppointments.map(appointment => 
        appointment._id === id 
          ? { ...appointment, status: 'canceled' } 
          : appointment
      )
    );
  },2500);

  } catch (error) {
    console.error("Error canceling appointment", error);
    alert("Failed to cancel appointment. Please try again.");
  }
  };

      // Filter appointments based on active tab
    const filteredAppointments = appointments.filter(appointment => {
    const today = new Date();
    const appointmentDate = new Date(appointment.date);
    
    switch(activeTab) {
      case 'upcoming':
        return appointmentDate >= today;
      case 'past':
        return appointmentDate < today && appointment.status !== 'cancelled';
      case 'cancelled':
        return appointment.status === 'canceled';
      default:
        return true; // 'all' tab shows everything
    }
  });

  return (

    <>
    <NavBar />

    <div className="appointments-container">
      <aside className="appointments-sidebar">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Appointments
        </button>
        <button 
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Appointments
        </button>
        <button 
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Appointments
        </button>
        <button 
          className={`tab-button ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled Appointments
        </button>
      </aside>

      <div className="appointments-content">
      {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment, index) => (
            <div className="appointment-card" key={appointment._id || index}>
              <div className="appointment-header">
                <div className="appointment-date">
                  <p className="label">Date</p>
                  <p className="value">{appointment.date || '--/--/----'}</p>
                </div>
                <div className="appointment-time">
                  <p className="label">Time</p>
                  <p className="value">{appointment.time || '--'}</p>
                </div>
                <div className="appointment-status">
                  <p className="label">Status</p>
                  <p className="value">{appointment.status || '--'}</p>
                </div>
              </div>
              <div className="appointment-details">
                <div className="appointment-doctor">
                  <p className="label">Doctor</p>
                  <p className="value">
                  {appointment.doctor ? appointment.doctor.fullName || 'Dr. Not Assigned' : 'Dr. Not Assigned'}
                  </p>
                </div>
                <div className="appointment-department">
                  <p className="label">Department</p>
                  <p className="value">
                  {appointment.doctor ? appointment.doctor.department || 'Not Specified' : 'Not Specified'}
                  </p>
                </div>
                <div className="appointment-button">
                  {/* <p className="value">
                    {appointment.status !== 'canceled' ? (
                    <button 
                      className="cancel-button"
                      onClick={() => cancelAppointment(appointment._id)}>
                      Cancel
                    </button>
                    ) : (
                      <span className="status-text">Already Canceled</span>
                    )}
                      </p> */}
                    <p className="value">
                    <button 
                      className="cancel-button"
                      onClick={() => cancelAppointment(appointment._id)}>
                      Cancel
                    </button>
                      </p>
                    
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-appointments">
            <p>No appointments found</p>
          </div>

        )}
      </div>
    </div>

    <Resources />
    <Footer />
    
    </>
  );
}

export default AppointmentList;