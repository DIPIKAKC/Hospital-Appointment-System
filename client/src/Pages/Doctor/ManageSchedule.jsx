import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DocBar from "../../Components/Doctor/DoctorNavbar";
import FooterDoc from "../../Components/Doctor/FooterDoctor";
import "./ManageSchedule.css";
import { RiEditLine } from "react-icons/ri";


const ManageSchedule = () => {
  const [date, setDate] = useState("");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("upcoming"); // "upcoming", "past", or "all"
  const [editingSlot, setEditingSlot] = useState(null);

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
        const response = await fetch("http://localhost:5000/auth/me", {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        // if (data.userRole !== "doctor") {
        //   setError("Only doctors can access this page");
        // }
        navigate("/schedules");
        
        setDoctorSlots(data.availableSlots || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch schedule. " + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchDoctorSlots();
  }, [navigate]);

  // Update selected time slots when date changes or when editing a slot
  useEffect(() => {
    if (editingSlot) {
      setDate(editingSlot.date);
      setSelectedTimeSlots(editingSlot.times);
    } else if (date) {
      const existingSlot = doctorSlots.find(slot => slot.date === date);
      if (existingSlot) {
        setSelectedTimeSlots(existingSlot.times);
      } else {
        setSelectedTimeSlots([]);
      }
    } else {
      setSelectedTimeSlots([]);
    }
  }, [date, doctorSlots, editingSlot]);

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
      // Display success in a toast-like popup
      showToast("Schedule updated successfully", "success");
      
      // Refresh local slots
      setDoctorSlots(data.availableSlots || []);
      
      // Reset form state
      setSelectedTimeSlots([]);
      setDate("");
      setEditingSlot(null);
      
    } catch (err) {
      setError(err.response?.data?.message || "Error updating schedule");
      showToast("Error updating schedule", "error");
    }
  };

  const handleEditSlot = (slot) => {
    setEditingSlot(slot);
    window.scrollTo({ top: document.querySelector('.schedule-form').offsetTop - 100, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingSlot(null);
    setDate("");
    setSelectedTimeSlots([]);
  };

  // Calculate minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  // Calculate maximum date (3 months from now)
  const maxDate = new Date(today);
  maxDate.setMonth(today.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];

  // Filter slots based on view mode
  const filteredSlots = doctorSlots.filter(slot => {
    const slotDate = new Date(slot.date);
    slotDate.setHours(0, 0, 0, 0);
    
    const currentTime = new Date();
    
    // Create a date for today with time set to 00:00
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (viewMode === "upcoming") {
      // For upcoming view, check if the date is today or future
      if (slotDate.getTime() > todayDate.getTime()) {
        return true;
      } else if (slotDate.getTime() === todayDate.getTime()) {
        // For today, filter based on time
        // Check if any time slot is in the future
        return slot.times.some(timeStr => {
          const [time, meridian] = timeStr.split(' ');
          const [hour, minute] = time.split(':').map(Number);
          
          let slotHour = hour;
          if (meridian === "PM" && hour !== 12) slotHour += 12;
          if (meridian === "AM" && hour === 12) slotHour = 0;
          
          const slotTime = new Date();
          slotTime.setHours(slotHour, minute, 0, 0);
          
          return slotTime > currentTime;
        });
      }
      return false;
    } else if (viewMode === "past") {
      // For past view, check if the date is in the past or if it's today with past time slots
      if (slotDate.getTime() < todayDate.getTime()) {
        return true;
      } else if (slotDate.getTime() === todayDate.getTime()) {
        // For today, check if all time slots are in the past
        return slot.times.some(timeStr => {
          const [time, meridian] = timeStr.split(' ');
          const [hour, minute] = time.split(':').map(Number);
          
          let slotHour = hour;
          if (meridian === "PM" && hour !== 12) slotHour += 12;
          if (meridian === "AM" && hour === 12) slotHour = 0;
          
          const slotTime = new Date();
          slotTime.setHours(slotHour, minute, 0, 0);
          
          return slotTime < currentTime;
        });
      }
      return false;
    }
    
    // For "all" view, show everything
    return true;
  });

  // Sort slots by date (nearest first for upcoming, most recent first for past)
  filteredSlots.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return viewMode === "past" ? dateB - dateA : dateA - dateB;
  });

  // Toast notification function
  const showToast = (message, type) => {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Add visible class to trigger animation
    setTimeout(() => {
      toast.classList.add("visible");
    }, 10);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  

  return (
    <>
      <DocBar />

      <div className="main-container">
      {/* <h2 className="schedule-title">Manage Your Schedule</h2> */}
        
        {/* {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>} */}
        <div className="schedule-content">
        <div className="current-schedule">
          <h3 className="section-heading">Your Schedule</h3>
          
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === "upcoming" ? "active" : ""}`}
              onClick={() => setViewMode("upcoming")}
            >
              Upcoming
            </button>
            <button 
              className={`toggle-btn ${viewMode === "past" ? "active" : ""}`}
              onClick={() => setViewMode("past")}
            >
              Past
            </button>
            <button 
              className={`toggle-btn ${viewMode === "all" ? "active" : ""}`}
              onClick={() => setViewMode("all")}
            >
              All
            </button>
          </div>
          
          {loading ? (
            <div className="empty-schedule">Loading your schedule...</div>
          ) : filteredSlots.length === 0 ? (
            <p className="empty-schedule">
              {viewMode === "upcoming" && "You don't have any upcoming time slots scheduled."}
              {viewMode === "past" && "You don't have any past time slots to display."}
              {viewMode === "all" && "You haven't set any available time slots yet."}
            </p>
          ) : (
            <div className="slot-grid">
              {filteredSlots.map((slot, index) => {
                const slotDate = new Date(slot.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                // Determine if the slot is for today
                const isToday = slotDate.getTime() === today.getTime();
                
                // Determine if the slot is in the past
                const isPast = slotDate.getTime() < today.getTime() || 
                  (isToday && slot.times.every(timeStr => {
                    const [time, meridian] = timeStr.split(' ');
                    const [hour, minute] = time.split(':').map(Number);
                    
                    let slotHour = hour;
                    if (meridian === "PM" && hour !== 12) slotHour += 12;
                    if (meridian === "AM" && hour === 12) slotHour = 0;
                    
                    const slotTime = new Date();
                    slotTime.setHours(slotHour, minute, 0, 0);
                    
                    const currentTime = new Date();
                    return slotTime < currentTime;
                  }));
                
                return (
                  <div 
                    key={`${slot.date}-${index}`} 
                    className={`slot-card ${editingSlot?.date === slot.date ? 'editing-highlight' : ''}`}
                  >
                    <p className="slot-date">{formatDate(slot.date)}</p>
                    
                    <div className="time-tags">
                      {slot.times.map((time) => (
                        <span key={`${slot.date}-${time}`} className="time-tag">
                          {time}
                        </span>
                      ))}
                    </div>
                    
                    <div className="slot-actions">
                      <button 
                        className="slot-action-btn edit-btn"
                        onClick={() => handleEditSlot(slot)}
                        disabled={isPast}
                      >
                      <RiEditLine size={20}/>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="schedule-form">
          <h3 className="form-heading">
            {editingSlot ? 'Edit Schedule' : 'Add New Schedule'}
          </h3>
          
          <div className="form-group">
            <label htmlFor="date" className="form-label">Select Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={editingSlot ? editingSlot.date : minDate}
              max={maxDateString}
              className="date-input"
              required
              disabled={!!editingSlot}
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
          
          <div className="form-actions">
            <button 
              type="submit"
              className="update-sc-button"
              disabled={!date || selectedTimeSlots.length === 0}
            >
              {editingSlot ? 'Update Schedule' : 'Save Schedule'}
            </button>
            
            {editingSlot && (
              <button 
                type="button"
                className="c-edit-btn"
                onClick={cancelEdit}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
        </div>

        
        {/* No schedules found helper text */}
        {doctorSlots.length === 0 && !loading && (
          <div className="helper-section">
            <h3>Getting Started</h3>
            <p>You haven't created any schedules yet. To get started:</p>
            <ol>
              <li>Select a date using the date picker above</li>
              <li>Choose available time slots by clicking on them</li>
              <li>Click "Save Schedule" to publish your availability</li>
            </ol>
            <p>Your patients will be able to book appointments during these time slots.</p>
          </div>
        )}
      </div>

      <FooterDoc />
    </>
  );
};

export default ManageSchedule;