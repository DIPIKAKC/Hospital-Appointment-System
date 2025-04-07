
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const [date, setDate] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", 
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", 
    "05:00 PM", "05:30 PM"
  ];

  // Load doctor's existing schedule
  useEffect(() => {
    const fetchDoctorSlots = async () => {
        const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:5000/auth/me",  {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        // if (data.userRole !== "doctor") {
        // setError("Only doctors can access this page");
        // }
        navigate("/dashboard");
        
        setDoctorSlots(data.availableSlots || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch schedule. " + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchDoctorSlots();
  }, [navigate]);

  // Update selected time slots when date changes
  useEffect(() => {
    if (date) {
      const existingSlot = doctorSlots.find(slot => slot.date === date);
      if (existingSlot) {
        setSelectedTimeSlots(existingSlot.times);
      } else {
        setSelectedTimeSlots([]);
      }
    } else {
      setSelectedTimeSlots([]);
    }
  }, [date, doctorSlots]);

  const handleTimeSlotToggle = (timeSlot) => {
    if (selectedTimeSlots.includes(timeSlot)) {
      setSelectedTimeSlots(selectedTimeSlots.filter(t => t !== timeSlot));
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, timeSlot]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!date) {
      setError("Please select a date");
      return;
    }

    //post app
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:5000/auth/add-time-slot",
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                date,
                times: selectedTimeSlots,
            })
        });
      
      
        const data = await response.json();
      
        if (!response.ok) {
            throw new Error(data.message || "Failed to update schedule");
          }
      
          setMessage(data.message || "Schedule updated successfully");
      
          // Refresh local slots
          setDoctorSlots(data.availableSlots || []);
      
          // Optional: Reset time slot selections
          setSelectedTimeSlots([]);
      
      // Clear form after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating schedule");
    }
  };

  // Calculate minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  // Calculate maximum date (3 months from now)
  const maxDate = new Date(today);
  maxDate.setMonth(today.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];
  
  return (
<>
    <div className="back-link">
    <button 
      onClick={() => navigate("/dashboard")} 
      className="back-button"
    >
      Back to Dashboard
    </button>
  </div>
    <div className="schedule-container">
      <h2 className="schedule-title">Manage Your Schedule</h2>
      
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      
      <div className="current-schedule">
        <h3 className="section-heading">Your Current Schedule</h3>
        
        {doctorSlots.length === 0 ? (
          <p className="empty-schedule">You haven't set any available time slots yet.</p>
        ) : (
          <div className="slot-grid">
            {doctorSlots.map(slot => (
              <div key={slot.date} className="slot-card">
                <p className="slot-date">{new Date(slot.date).toDateString()}</p>
                <div className="time-tags">
                  {slot.times.map(time => (
                    <span key={time} className="time-tag">
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="schedule-form">
        <div className="form-group">
          <label htmlFor="date" className="form-label">Select Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={minDate}
            max={maxDateString}
            className="date-input"
            required
          />
        </div>
        
        {date && (
          <div className="form-group">
            <label className="form-label">Select Available Time Slots:</label>
            <div className="time-slots-grid">
              {timeSlots.map(time => (
                <div 
                  key={time}
                  onClick={() => handleTimeSlotToggle(time)}
                  className={`time-slot ${selectedTimeSlots.includes(time) ? 'selected' : ''}`}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button 
          type="submit"
          className="submit-button"
          disabled={!date}
        >
          Save Schedule
        </button>
      </form>
      
    </div>
    </>
  );
};

export default DoctorDashboard; 