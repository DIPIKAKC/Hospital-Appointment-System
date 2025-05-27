import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast, Toaster } from "sonner";
import { CheckCircle } from 'lucide-react';
import { MdArrowBackIosNew } from "react-icons/md";

import './DoctorPage.css';
import DoctorProfileCard from "../../Components/User/DoctorProfile";
import { useParams } from "react-router-dom";
import NavBar from "../../Components/User/Navbar";
import Resources from "../../Components/User/Resources";
import Footer from "../../Components/User/Footer";


const DoctorPage = () => {

    const {doctorId} = useParams();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [doctors, setDoctors] = useState(null);
    const [reason, setReason] = useState("");
    const navigate= useNavigate()
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Modal state

    // Function to format dates consistently
    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };


    //time-slots doctor
    useEffect(() => {
        const fetchAppointmentTime = async() =>{

            const token= localStorage.getItem("token")
            try{
                const response = await fetch(`http://localhost:5000/auth/${doctorId}/available-slots`,
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
                setDoctors(data);

                const formattedSelectedDate = formatDate(selectedDate);
                const currentDoctor = data.find(d => d._id === doctorId);
                if (!currentDoctor || !currentDoctor.availableSlots) {
                    setAvailableTimes([]);
                    return;
                }

                const slotsForDate = currentDoctor.availableSlots.find(slot => formatDate(new Date(slot.date)) === formattedSelectedDate);
                if (!slotsForDate || !slotsForDate.times) {
                    setAvailableTimes([]);
                    return;
                }

                let times = slotsForDate.times;

                // Filter past times if selectedDate is today
                const today = new Date();
                if (
                    today.toDateString() === selectedDate.toDateString()
                ) {
                    const now = today.getHours() * 60 + today.getMinutes(); // current time in minutes

                    // Helper: convert "10:30 AM" -> total minutes from midnight
                    const timeToMinutes = (timeStr) => {
                    let [time, meridian] = timeStr.split(' ');
                    let [hours, minutes] = time.split(':').map(Number);
                    if (meridian === 'PM' && hours !== 12) hours += 12;
                    if (meridian === 'AM' && hours === 12) hours = 0;
                    return hours * 60 + minutes;
                    };

                    times = times.filter(time => timeToMinutes(time) > now);
                }

                setAvailableTimes(times);
            } catch (error) {
            console.error("Error fetching available slots:", error);
            setAvailableTimes([]);
        }}
        
        fetchAppointmentTime();
    },[doctorId, selectedDate]); // Re-fetch when date changes


    // Handle date change
    const handleDateChange = (date) => {
        console.log("Date changed to:", date, "Formatted:", formatDate(date));
        setSelectedDate(date);
        setSelectedTime(null); // Reset selected time when date changes
    };




    // book-appointment
        const handleBookAppointment = async () => {

            if (!selectedTime) {
                toast.info("Please select a time slot");
                return;
            }

            const token = localStorage.getItem("token");
            if (!token) {
                toast.info("You must be logged in to book an appointment");
                return;
            }
            
            try {

                // Log the data being sent
                const appointmentData = {
                    doctorId,
                    date: formatDate(selectedDate),
                    time: selectedTime,
                    reason: reason
                };
                console.log("Booking appointment with data:", appointmentData);

                const response = await fetch(`http://localhost:5000/auth/book-appointment`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(appointmentData)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    toast.error(`Failed to book appointment: ${errorData.message}`)
                    return;
                }
                
                const data = await response.json();
                toast.success("Your appointment request has been successfully submitted. We'll contact you shortly to confirm the details.") // Open success modal
                setTimeout(() => {navigate("/appointments")}, 1000);
                // Reset selected time or redirect to confirmation page
            } catch (error) {
                console.error("Error booking appointment:", error);
                toast.error("Failed to book appointment. Please try again.");
            }
        };




// Success Modal Component
  const SuccessMessageModal = ({ isOpen}) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Appointment Request Sent</h3>
          </div>
          
          <div className="modal-body">
            <div className="success-icon">
              <CheckCircle size={64} />
            </div>
            <p className="success-title">Success!</p>
            <p className="success-message">
              Your appointment request has been successfully submitted. 
              We'll contact you shortly to confirm the details.
            </p>
          </div>
          </div>
          </div>
          </div>
    );
  };

    return(

        <>
        <NavBar />
        <div className="doctor-personal-container">
        <MdArrowBackIosNew className="back-arrow" size={35} onClick={()=> navigate('/find-doctors')}/>
            <div className="doctor-personal">
                <aside className="doctor-personal-info-card">
                    <DoctorProfileCard />
                </aside>
            </div>

            <div className="doctor-personal-booking-section">

                <div className="doctor-personal-calendar">
                    <h3>Select Appointment Date</h3>
                    <Calendar 
                        className="doctor-personal-appointment-calendar"
                        onChange={handleDateChange}
                        value={selectedDate}
                        minDate={new Date()}
                    />           

                </div>
                <div className="doctor-personal-timeslot-section">
                    <h3> Available Hours</h3>

                    {availableTimes.length > 0 ? (
                        <div className="doctor-personal-time-grid">
                            {availableTimes.map((time, index) => (
                                <button
                                    key={index}
                                    className={`doctor-personal-time-slot ${selectedTime === time ? 'selected' : ''}`}
                                    onClick={() => setSelectedTime(time)}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p>No available slots for this date.</p>
                    )}

                </div>
                
                <div className="doctor-input-reasons">
                    <h3>Appointment Reason</h3>
                    <input 
                        type="text"
                        placeholder="Reason for appointment"
                        className="appointment-reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>

                <button className="doctor-personal-continue-button"
                    onClick={handleBookAppointment}
                    disabled={!selectedTime}
                >
                    
                    Book Appointment
                </button>
            </div>

        </div>
        <Resources />
        <Footer />

              {/* Success Modal */}
      <SuccessMessageModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </>
    )
};

export default DoctorPage;