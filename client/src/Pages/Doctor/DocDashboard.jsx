import React, { useEffect, useState } from 'react';
import './DocDashboard.css';
import { FaCalendarAlt, FaUserMd, FaClipboardList, FaClock, FaUser } from 'react-icons/fa';
import FooterDoc from '../../Components/Doctor/FooterDoctor';
import DocBar from '../../Components/Doctor/DoctorNavbar';
import { Link, useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {

  const [stats, setStats] = useState({
    today: 0,
    upcoming: 0,
    patients: 0,
    pendingreq:0
  });
  const[patient, setPatient] = useState([])

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const doctor = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchStats();
    fetchPatients();
  }, [token]);


  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/auth/stats-appointments', {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setStats({
        today: data?.todayAppointments || 0,
        upcoming: data?.upcomingAppointments || 0,
        patients: data?.totalPatientsWithAppointments || 0,
        pendingreq: data?.pendingReqFromNow || 0,
      });
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await fetch('http://localhost:5000/auth/my-patients', {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        setPatient(data.patients || []);  
      } else {
        console.error("Error fetching patients data");
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  return (

    <>
    <DocBar />
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <p>Welcome back, Dr. {doctor}! Here's your schedule for today.</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaCalendarAlt />
          </div>
          <div className="stat-details">
            <h3>Today's Appointments</h3>
            <p className="stat-number">{stats.today}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaCalendarAlt />
          </div>
          <div className="stat-details">
            <h3>Upcoming Appointments</h3>
            <p className="stat-number">{stats.upcoming}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-details">
            <h3>Pending Requests</h3>
            <p className="stat-number">{stats.pendingreq}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaUser />
          </div>
          <div className="stat-details">
            <h3>Total Patients</h3>
            <p className="stat-number">{stats.patients}</p>
          </div>
        </div>
    
      </div>

      <div className="dashboard-content">
        {/* <div className="appointments-section">
          <div className="section-header">
            <h2>Upcoming Appointments</h2>
            <button className="view-all-btn">View All</button>
          </div>
          
          <div className="appointments-list">
            {upcomingAppointments.map(appointment => (
              <div className="appointment-card" key={appointment.id}>
                <div className="appointment-time">
                  <FaClock className="time-icon" />
                  <span>{appointment.time}</span>
                </div>
                
                <div className="appointment-details">
                  <h3>{appointment.patientName}</h3>
                  <p className="appointment-reason">{appointment.reason}</p>
                  <p className="appointment-date">{appointment.date}</p>
                </div>
                
                <div className="appointment-status">
                  <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </span>
                </div>
                
                <div className="appointment-actions">
                  {appointment.status === "Pending" && (
                    <button 
                      className="approve-btn"
                      onClick={() => handleApproveAppointment(appointment.id)}
                    >
                      Approve
                    </button>
                  )}
                  <button 
                    className="reschedule-btn"
                    onClick={() => handleRescheduleAppointment(appointment.id)}
                  >
                    Reschedule
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={() => handleCancelAppointment(appointment.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        <div className="doctor-dashboard-sidebar">
          <div className="recent-patients-doc">
            <h2>Recent Patients</h2>
            <div className="patients-list">
              {patient.map((patient, index) => (
                <div className="patient-item" key={index}>
                  <div className="patient-avatar">
                    {patient.name.charAt(0)}
                  </div>
                  <div className="patient-info">
                    <h4>{patient.name}</h4>
                    <p>{patient.condition}</p>
                    <p className="last-visit">Last appointment: {new Date(patient.lastVisit).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-btn">
                <FaCalendarAlt className="action-icon" />
                  <Link to ='/schedules' className='link-schedule'>
                    <span >Add Availability</span>
                  </Link>
              </button>
              <button className="action-btn">
                <FaUserMd className="action-icon" />
                <Link to ='/profile-doc' className='link-schedule'>
                  <span>Update Profile</span>
                </Link>
              </button>
              <button className="action-btn">
                <FaClipboardList className="action-icon" />
                <Link to ='/my-assigned-appointments' className='link-schedule'>
                  <span>View Appointments</span>
                </Link>
              </button>
            </div>
          </div>

        </div>
      </div>

    <FooterDoc />
    </>
  );
};

export default DoctorDashboard;