import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./AppointmentBooking.css"
import './calendar.css'; // Custom styles for the calendar
import { Search, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import DoctorCard from '../../Components/DoctorCard';

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const { doctorId} = useParams(); // Assuming doctor ID is passed in URL
  const [user, setUser] = useState(null);
  const [doctor, setDoctor] = useState(null);

  const morningSlots = ['8:30 AM', '9 AM', '9:30 AM', '10 AM', '10:30 AM'];
  const eveningSlots = ['1 PM', '1:30 PM', '2 PM', '2:30 PM', '3 PM', '3:30 PM'];


  useEffect(() => {
    // Fetch logged-in user details
    const fetchUser = async () => {
      const  id = localStorage.getItem("userId")
      try {
        const response = await fetch(`http://localhost:4000/auth/get-user-data-by-id/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    // Fetch selected doctor details
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`http://localhost:4000/auth/get-doctor-data-by-id/${doctorId}`);
        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        console.error('Error fetching doctor:', error);
      }
    };

    fetchUser();
    if (doctorId) fetchDoctor();
    }, [doctorId]);


  const handleContinue = () => {
    navigate('/FormAppointment');
  };

  return (
    <div className="scheduler-container">
      <nav className="nav-bar">
        <div className="logo">MedEase</div>
        <div className="nav-links">
          <button className="nav-link">Appointments</button>
          <button className="nav-link active">Doctors</button>
          <button className="nav-link">Departments</button>
        </div>
        <div className="nav-right">
          <Bell className="notification-icon" />
          <div className="user-avatar">Username</div>
        </div>
      </nav>

      <div className="search-section">
        <div className="search-bar">
          <Search className="search-icon" />
          <input type="text" placeholder="Search for doctors" />
        </div>
        <select className="filter-dropdown">
          <option>All</option>
        </select>
      </div>



      <div className="main-content">
        <aside className="doctor-card">
          <DoctorCard />
        </aside>



        <main className="appointment-section">
          <div className="date-selection">
            <h3>Select Appointment Date</h3>
            <Calendar 
              onChange={setSelectedDate} 
              value={selectedDate} 
              minDate={new Date()} 
              className="custom-calendar" 
            />
          </div>

          <div className="time-slots-section">
            <h3>Available Hours</h3>
            
            {selectedDate && (
              <>
                <div className="time-period">
                  <h4>Morning</h4>
                  <div className="time-grid">
                    {morningSlots.map((time, index) => (
                      <button
                        key={index}
                        className={`time-slot ${selectedTimeSlot === time ? 'selected' : ''}`}
                        onClick={() => setSelectedTimeSlot(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="time-period">
                  <h4>Evening</h4>
                  <div className="time-grid">
                    {eveningSlots.map((time, index) => (
                      <button
                        key={index}
                        className={`time-slot ${selectedTimeSlot === time ? 'selected' : ''}`}
                        onClick={() => setSelectedTimeSlot(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            <button 
              className="continue-button"
              onClick={handleContinue}
              disabled={!selectedDate || !selectedTimeSlot}
            >
              Continue
            </button>


          </div>
        </main>
      </div>
    </div>
  );
};

export default AppointmentBooking;



// appointmentbooking page:

//     doctorCard
//     Calendar -to select date
//     time slot -to select time of appointment

//     continue button - > appointment information fetching to a form (username, doctor name, speciality, selected time , selected date)

// book appointment