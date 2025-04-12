import React, { useState, useEffect } from "react";
import "./MyAssignedAppointments.css";
import DocBar from "../../Components/Doctor/DoctorNavbar";

const DoctorAppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [appointmentToUpdate, setAppointmentToUpdate] = useState(null);
  
  // Retrieve token from local storage
  const token = localStorage.getItem("token");
  useEffect(() => {
      const fetchAppointments = async () => {
        setLoading(true);
        try {
          const response = await fetch("http://localhost:5000/auth/my-assigned-appointments", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const data = await response.json();
          setAppointments(data);
        } catch (err) {
          throw new Error("Failed to fetch appointments. " + err.message);
        } finally {
          setLoading(false);
        }
      };
    fetchAppointments();
  },[token]);


  const updateAppointmentStatus = async (id, status) => {

    try {
      const response = await fetch(
        `http://localhost:5000/auth/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status, notes })
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      alert("Appointment updated successfully");
      console.log(data)
    }catch(error){
        console.log(error)
        alert("unable to update")
    }}

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <>
    <DocBar />
    <div className="doctor-appointments-container">
      <h2 className="page-title">Patient Appointment Requests</h2>
      
      {/* Modal for doctor's notes when updating appointment status */}
      {appointmentToUpdate && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              {appointmentToUpdate.status === 'confirmed' ? 'Accept Appointment' : 'Reject Appointment'}
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about the appointment (optional)"
              className="modal-textarea"
            ></textarea>
            <div className="modal-buttons">
              <button
                onClick={() => setAppointmentToUpdate(null)}
                className="button-cancel"
              >
                Cancel
              </button>
              <button
                onClick={() => updateAppointmentStatus(appointmentToUpdate.id, appointmentToUpdate.status)}
                className={`status-button ${appointmentToUpdate.status === 'confirmed' ? 'accept' : 'reject'}`}
              >
                {appointmentToUpdate.status === 'confirmed' ? 'Accept' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {appointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No appointment requests</h3>
          <p>You don't have any pending appointment requests.</p>
        </div>
      ) : (
        <div className="appointment-cards-grid">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="card-appointment">
              <div className="card-status-banner" data-status={appointment.status}></div>
              <div className="card-content">
                <div className="appointment-header">
                  <span className={`status-badge ${appointment.status}`}>
                    {appointment.status}
                  </span>
                  <span className="appointment-time">
                    {formatDate(appointment.date)} at {appointment.time}
                  </span>
                </div>
                
                <div className="patient-info">
                  <h3>{appointment.user?.fullName || "Unknown Patient"}</h3>
                  <p className="patient-email">{appointment.user?.email || "No email"}</p>
                </div>
                
                <div className="appointment-reason">
                  <label>Reason for visit:</label>
                  <p>{appointment.reason || "No reason provided"}</p>
                </div>
                
                {appointment.status === 'pending' ? (
                  <div className="appointment-actions">
                    <button
                      onClick={() => setAppointmentToUpdate({id: appointment._id, status: 'confirmed'})}
                      className="accept-button"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => setAppointmentToUpdate({id: appointment._id, status: 'rejected'})}
                      className="reject-button"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="appointment-status">
                    <p className={`status-message ${appointment.status}`}>
                      {appointment.status === 'confirmed' ? 'Appointment accepted' : 
                       appointment.status === 'rejected' ? 'Appointment rejected' : 
                       appointment.status === 'canceled' ? 'Appointment canceled by patient' : 
                       'Status: ' + appointment.status}
                    </p>
                    {appointment.notes && (
                      <div className="appointment-notes">
                        <label>Your notes:</label>
                        <p>{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default DoctorAppointmentsList;