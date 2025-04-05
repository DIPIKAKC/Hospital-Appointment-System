// import React, { useEffect, useState } from "react";
// import './Appointments.css';

// const AppointmentList = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//   const fetchAppointments = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/auth/appointments");
//       const data = await response.json();
                
//       if (Array.isArray(data)) {
//           setAppointments(data);
//       }
//     } catch (error) {
//       console.error("Error fetching appointments", error);
//     }
//   };
//   fetchAppointments();
// }, []);


// return (
//     <div className="appointments-container">
//       <h2 className="appointments-title">Booked Appointments</h2>
//       {message && <p className="appointments-message">{message}</p>}
      
//       {appointments.length === 0 ? (
//         <p className="no-appointments">No appointments found</p>
//       ) : (
//         <ul className="appointments-list">
//           {appointments.map((appointment) => (
//             <li key={appointment._id} className="appointment-item">
//               <div className="appointment-details">
//                 <p className="appointment-person">
//                   <span className="name">{appointment.userName}</span> with{" "}
//                   <span className="name">{appointment.doctorName}</span>
//                 </p>
//                 <p className="appointment-time">
//                   {appointment.date} at {appointment.time}
//                 </p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default AppointmentList;



import React, { useEffect, useState } from "react";
import './Appointments.css';

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
  );
}

export default AppointmentList;