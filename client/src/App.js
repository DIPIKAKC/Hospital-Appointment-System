import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


//system imports
  import FindDoctors from "./Pages/User/FindDoctors";
import DoctorPage from "./Pages/User/DoctorPage"
import LoginForm from "./Pages/User/Login";
import AppointmentList from "./Pages/User/Appointments";
import DoctorDashboard from "./Pages/Doctor/Dashboard";
import LoginDoctor from "./Pages/Doctor/login";
import ContactUs from "./Pages/User/ContactUs";
import Home from "./Pages/User/DashBoard";

const App = () => {

  return (
    <Router>

      {/* NavBar should be outside Routes to show on all pages */}

      <Routes>
        <Route path = "/" element={<Home />} />
          <Route path = "/login" element={<LoginForm />} />
          <Route path="/getAllDoctors" element={<FindDoctors />} />
          <Route path= "/doctor/:doctorId" element={<DoctorPage />} />
          <Route path= "/appointments" element= {<AppointmentList />} />
          <Route path= "/contact-us" element= {<ContactUs />} />


          <Route path = "/login-doc" element={<LoginDoctor />} />
          <Route path= "/dashboard" element= {<DoctorDashboard />} />


          
      </Routes>

    </Router>

    
  );

}

export default App;
