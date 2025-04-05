import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


//system imports
 import NavBar from "./Components/Navbar";
import Resources from "./Components/Resources";
import Footer from "./Components/Footer";
import FindDoctors from "./Pages/User/FindDoctors";
import DoctorPage from "./Pages/User/DoctorPage"
import LoginForm from "./Pages/User/Login";
import AppointmentList from "./Pages/User/Appointments";
import Home from "./Pages/User/Dashboard";

const App = () => {

  return (
    <Router>

      <NavBar/> 
      {/* NavBar should be outside Routes to show on all pages */}

      <Routes>
          <Route path = "/" element={<Home />} />
          <Route path = "/login" element={<LoginForm />} />
          <Route path="/getAllDoctors" element={<FindDoctors />} />
          <Route path= "/doctor/:doctorId" element={<DoctorPage />} />
          <Route path= "appointments" element= {<AppointmentList />} />

          
      </Routes>

      <Resources / >
      <Footer />
    </Router>
  );

}

export default App;
