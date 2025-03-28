import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


//system imports
 import NavBar from "./Components/Navbar";
 import DoctorCard from "./Components/DoctorCard";
 import DoctorProfileCard from "./Components/DoctorProfile";
import Resources from "./Components/Resources";
import Footer from "./Components/Footer";

const App = () => {

  return (
    <Router>

      <NavBar/> 
      {/* NavBar should be outside Routes to show on all pages */}

      <Routes>
          <Route path = "/" element={<DoctorCard />} />
          <Route path = "/a" element={<Resources />} />
          <Route path = "/b" element={<DoctorProfileCard />} />
          <Route path = "/c" element={<Footer />} />

          
      </Routes>
    </Router>
  );

}

export default App;
