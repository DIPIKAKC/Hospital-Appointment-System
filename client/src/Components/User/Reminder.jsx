import { useState } from 'react';
import './Reminder.css';
import { AiOutlineClose } from "react-icons/ai";
import { toast } from 'sonner';
// import { IoCalendarOutline } from "react-icons/io5";
// import { PiClock } from "react-icons/pi";

const ReminderModal = ({ appointment, onClose }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSetReminder = async () => {
    try {
      const sendAt = new Date(`${date}T${time}`);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/auth/reminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userEmail: appointment.user.email,
          patientName: appointment.user.fullName,  
          doctorName: appointment.doctor.fullName,
          department: appointment.doctor.department?.name,
          date,
          time,
          sendAt
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to set reminder");
      }

      toast.success("Reminder set successfully!");
      onClose();

    } catch (err) {
      toast.error("Error setting reminder: " + err.message);
    }
  };

  return (
    <div className="modal-overlay-reminder">
      <div className="modal-reminder">
        <div className="modal-header-reminder">
          <h3 className="modal-title-reminder">Set Reminder for the appointment with Dr. {appointment.doctor.fullName}</h3>
          <button onClick={onClose} className="close-button-reminder"><AiOutlineClose size= {20} /></button>
        </div>
        <div className="modal-body-reminder">
          <div className="input-group-reminder">
            <label>Date</label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]} //today's date
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <div className="input-group-reminder">
            <label>Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>
        </div>
        <div className="modal-footer-reminder">
          <button onClick={onClose} className="later-button-reminder">Maybe Later</button>
          <button onClick={handleSetReminder} className="set-button-reminder" disabled={!date || !time}>
            Set Reminder
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
