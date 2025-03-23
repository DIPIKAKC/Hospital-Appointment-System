import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AppointmentBooking.css";

const AppointmentBooking = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Check if user is a doctor and redirect
  useEffect(() => {
    const userRole = JSON.parse(localStorage.getItem("user"))?.role;
    if (userRole === "doctor") {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Fetch available doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/appointments/available-doctors", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await response.json();
        setDoctors(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch available doctors. " + err.message);
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Update available times when doctor or date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const doctor = doctors.find((doc) => doc._id === selectedDoctor);
      if (doctor) {
        const dateSlot = doctor.availableSlots.find((slot) => slot.date === selectedDate);
        setAvailableTimes(dateSlot ? dateSlot.times : []);
      }
    } else {
      setAvailableTimes([]);
    }
    setSelectedTime("");
  }, [selectedDoctor, selectedDate, doctors]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedDoctor || !selectedDate || !selectedTime || !reason) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/appointments/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          date: selectedDate,
          time: selectedTime,
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error("Error booking appointment");
      }

      const data = await response.json();
      setMessage(data.message);
      setTimeout(() => navigate("/appointments"), 2000);
    } catch (err) {
      setError(err.message || "Error booking appointment");
    }
  };

  const formatDateForDisplay = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading-text">Loading available doctors...</div>;

  return (
    <div className="container">
      <h2 className="heading">Book an Appointment</h2>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Select Doctor:</label>
          <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
            <option value="">Choose a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        {selectedDoctor && (
          <div className="form-group">
            <label>Select Date:</label>
            <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required>
              <option value="">Choose a date</option>
              {doctors
                .find((doc) => doc._id === selectedDoctor)
                ?.availableSlots.map((slot) => (
                  <option key={slot.date} value={slot.date}>
                    {formatDateForDisplay(slot.date)}
                  </option>
                ))}
            </select>
          </div>
        )}

        {selectedDate && (
          <div className="form-group">
            <label>Select Time:</label>
            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} required>
              <option value="">Choose a time</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Reason for Visit:</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Describe your symptoms or reason" required></textarea>
        </div>

        <button type="submit" className="submit-button" disabled={!selectedDoctor || !selectedDate || !selectedTime || !reason}>
          Book Appointment
        </button>
      </form>

      <p className="link-text">
        <a href="/appointments">View My Appointments</a>
      </p>
    </div>
  );
};

export default AppointmentBooking;















































// import React, { useState, useEffect } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import './Booking.css';
// import './calendar.css'; // Custom styles for the calendar
// import { Search, Bell } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
// import DoctorCard from '../components/DoctorCard';

// const AppointmentBooking = () => {
//   const navigate = useNavigate();
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

//   const { doctorId} = useParams(); // Assuming doctor ID is passed in URL
//   const [_user, setUser] = useState(null);
//   const [_doctor, setDoctor] = useState(null);

//   const morningSlots = ['8:30 AM', '9 AM', '9:30 AM', '10 AM', '10:30 AM'];
//   const eveningSlots = ['1 PM', '1:30 PM', '2 PM', '2:30 PM', '3 PM', '3:30 PM'];


//   useEffect(() => {
//     // Fetch logged-in user details
//     const fetchUser = async () => {
//       const  id = localStorage.getItem("userId")
//       try {
//         const response = await fetch(`http://localhost:4000/auth/get-user-data-by-id/${id}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         const data = await response.json();
//         setUser(data);
//       } catch (error) {
//         console.error('Error fetching user:', error);
//       }
//     };

//     // Fetch selected doctor details
//     const fetchDoctor = async () => {
//       try {
//         const response = await fetch(`http://localhost:4000/auth/get-doctor-data-by-id/${doctorId}`);
//         const data = await response.json();
//         setDoctor(data);
//       } catch (error) {
//         console.error('Error fetching doctor:', error);
//       }
//     };

//     fetchUser();
//     if (doctorId) fetchDoctor();
//     }, [doctorId]);


//   const handleContinue = () => {
//     navigate('/FormAppointment');
//   };

//   return (
//     <div className="scheduler-container">
//       <nav className="nav-bar">
//         <div className="logo">MedEase</div>
//         <div className="nav-links">
//           <button className="nav-link">Appointments</button>
//           <button className="nav-link active">Doctors</button>
//           <button className="nav-link">Departments</button>
//         </div>
//         <div className="nav-right">
//           <Bell className="notification-icon" />
//           <div className="user-avatar">Username</div>
//         </div>
//       </nav>

//       <div className="search-section">
//         <div className="search-bar">
//           <Search className="search-icon" />
//           <input type="text" placeholder="Search for doctors" />
//         </div>
//         <select className="filter-dropdown">
//           <option>All</option>
//         </select>
//       </div>

//       <div className="main-content">
//         <aside className="doctor-card">
//           <DoctorCard />
//         </aside>

//         <main className="appointment-section">
//           <div className="date-selection">
//             <h3>Select Appointment Date</h3>
//             <Calendar 
//               onChange={setSelectedDate} 
//               value={selectedDate} 
//               minDate={new Date()} 
//               className="custom-calendar" 
//             />
//           </div>

//           <div className="time-slots-section">
//             <h3>Available Hours</h3>
            
//             {selectedDate && (
//               <>
//                 <div className="time-period">
//                   <h4>Morning</h4>
//                   <div className="time-grid">
//                     {morningSlots.map((time, index) => (
//                       <button
//                         key={index}
//                         className={`time-slot ${selectedTimeSlot === time ? 'selected' : ''}`}
//                         onClick={() => setSelectedTimeSlot(time)}
//                       >
//                         {time}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="time-period">
//                   <h4>Evening</h4>
//                   <div className="time-grid">
//                     {eveningSlots.map((time, index) => (
//                       <button
//                         key={index}
//                         className={`time-slot ${selectedTimeSlot === time ? 'selected' : ''}`}
//                         onClick={() => setSelectedTimeSlot(time)}
//                       >
//                         {time}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </>
//             )}
            
//             <button 
//               className="continue-button"
//               onClick={handleContinue}
//               disabled={!selectedDate || !selectedTimeSlot}
//             >
//               Continue
//             </button>


//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AppointmentBooking;