import React from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import './DoctorPage.css';
import DoctorProfileCard from "../../Components/DoctorProfile";


const DoctorPage = () => {

    // const [selectedDate, setSelectedDate] = useState(new Date());
    // const [availableTimes, setAvailableTimes] = useState([]);
    // const [selectedTime, setSelectedTime] = useState(null);
    // const [loading, setLoading] = useState(false);
    // const [doctorId, setDoctorId] = useState(null);

    // useEffect(() => {
    //     const fetchAppointmentTime = async() =>{
    //         try{
    //             const response = await fetch("http://localhost:5000/auth/get")
    //         }
    //     }
    // })
    return(
        <div className="main-container">

            <div className="doctor">
                <aside className="info-card">
                    <DoctorProfileCard />
                </aside>
            </div>

            <div className="booking-section">

                <div className="calendar">
                    <h3>Select Appointment Date</h3>
                    <Calendar className="appointment-calendar"/>           
                </div>
                <div className="timeslot-section>">
                    <h3> Available Hours</h3>
                </div>

                <button className="continue-button">
                    Continue
                </button>
            </div>

        </div>

    )
};

export default DoctorPage;