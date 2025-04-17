import React, { useEffect, useState } from "react";
import { MdAccessAlarms } from "react-icons/md";

import './Appointments.css';
import NavBar from "../../Components/User/Navbar";
import Resources from "../../Components/User/Resources";
import Footer from "../../Components/User/Footer";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await fetch('http://localhost:5000/auth/appointments',
          {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
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
      }, 2500);

    } catch (error) {
      console.error("Error canceling appointment", error);
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(appointment => {
    const today = new Date();
    const appointmentDate = new Date(appointment.date);

    switch (activeTab) {
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

      <div className="appt-dashboard">
        <aside className="appt-sidebar">
          <button
            className={`sidebar-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Appointments
          </button>
          <button
            className={`sidebar-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Appointments
          </button>
          <button
            className={`sidebar-tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past Appointments
          </button>
          <button
            className={`sidebar-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled Appointments
          </button>
        </aside>

        <div className="appt-list">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment, index) => (
              <div className="appt-item" key={appointment._id || index}>
                <div className="appt-item-header">
                  <div className="appt-date">
                    <p className="appt-label">Date</p>
                    <p className="appt-value">{appointment.date || '--/--/----'}</p>
                  </div>
                  <div className="appt-time">
                    <p className="appt-label">Time</p>
                    <p className="appt-value">{appointment.time || '--'}</p>
                  </div>
                  <div className="appt-status">
                    <p className="appt-label">Status</p>
                    <p className="appt-value">{appointment.status || '--'}</p>
                  </div>
                </div>
                <div className="appt-item-body">
                  <div className="appt-doctor">
                    <p className="appt-label">Doctor</p>
                    <p className="appt-value">
                      {appointment.doctor ? appointment.doctor.fullName || 'Dr. Not Assigned' : 'Dr. Not Assigned'}
                    </p>
                  </div>
                  <div className="appt-department">
                    <p className="appt-label">Department</p>
                    <p className="appt-value">
                      {appointment.doctor ? appointment.doctor.department?.name || 'Not Specified' : 'Not Specified'}
                    </p>
                  </div>
                  <div className="appt-actions">
                    <p className="appt-value">
                      <button
                        className="btn-cancel"
                        onClick={() => cancelAppointment(appointment._id)}>
                        Cancel
                      </button>
                    </p>
                    <p className="appt-value">
                      <button
                        className="btn-appt">
                        {/* // onClick={() => cancelAppointment(appointment._id)}> */}
                        <MdAccessAlarms size={15} /> set reminder
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="appt-empty">
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