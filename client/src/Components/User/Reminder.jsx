// import { useState } from 'react';
// import './Reminder.css';
// // import { CloseIcon, ClockIcon, CalendarIcon } from './Icons';
// import { AiOutlineClose } from "react-icons/ai";
// import { IoCalendarOutline } from "react-icons/io5";
// import { PiClock } from "react-icons/pi";

// const ReminderModal = () => {
//   const [isOpen, setIsOpen] = useState(true);
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');

//   const handleClose = () => {
//     setIsOpen(false);
//   };

//   const handleSetReminder = () => {
//     alert(`Reminder set for ${date} at ${time}`);
//     setIsOpen(false);
//   };

//   const handleMaybeLater = () => {
//     alert('Reminder postponed');
//     setIsOpen(false);
//   };

//   // For demo purposes - toggle modal visibility
//   const toggleModal = () => {
//     setIsOpen(!isOpen);
//   };

//   if (!isOpen) {
//     return (
//       <button 
//         onClick={toggleModal} 
//         className="open-button"
//       >
//         Open Reminder Modal
//       </button>
//     );
//   }

//   return (
//     <div className="modal-container">
//       <button 
//         onClick={toggleModal} 
//         className="open-button"
//       >
//         Open Reminder Modal
//       </button>
      
//       {/* Modal Overlay */}
//       <div className="modal-overlay">
//         {/* Modal Content */}
//         <div className="modal">
//           {/* Header */}
//           <div className="modal-header">
//             <h3 className="modal-title">Set Reminder</h3>
//             <button onClick={handleClose} className="close-button">
//               <AiOutlineClose />
//             </button>
//           </div>
          
//           {/* Body */}
//           <div className="modal-body">
//             {/* Date Picker */}
//             <div className="input-group">
//               <label className="input-label">
//                 <span className="icon-wrapper"><IoCalendarOutline /></span>
//                 Date
//               </label>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="input-field"
//               />
//             </div>
            
//             {/* Time Picker */}
//             <div className="input-group">
//               <label className="input-label">
//                 <span className="icon-wrapper"><PiClock /></span>
//                 Time
//               </label>
//               <input
//                 type="time"
//                 value={time}
//                 onChange={(e) => setTime(e.target.value)}
//                 className="input-field"
//               />
//             </div>
//           </div>
          
//           {/* Footer */}
//           <div className="modal-footer">
//             <button 
//               onClick={handleMaybeLater}
//               className="later-button"
//             >
//               Maybe Later
//             </button>
//             <button 
//               onClick={handleSetReminder}
//               className="set-button"
//               disabled={!date || !time}
//             >
//               Set Reminder
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ReminderModal;





import { useState } from 'react';
import './Reminder.css';
// import { AiOutlineClose } from "react-icons/ai";
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
          userEmail: appointment.user.email, // assuming you fetch email with user
          doctorName: appointment.doctor.fullName,
          date,
          time,
          sendAt
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to set reminder");
      }

      alert("Reminder set successfully!");
      onClose();

    } catch (err) {
      alert("Error setting reminder: " + err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Set Reminder for Dr. {appointment.doctor.fullName}</h3>
          <button onClick={onClose} className="close-button">X</button>
        </div>
        <div className="modal-body">
          <div className="input-group">
            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="later-button">Maybe Later</button>
          <button onClick={handleSetReminder} className="set-button" disabled={!date || !time}>
            Set Reminder
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
