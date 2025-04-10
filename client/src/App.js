import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


//system imports
import FindDoctors from "./Pages/User/FindDoctors";
import DoctorPage from "./Pages/User/DoctorPage"
import LoginForm from "./Pages/User/Login";
import AppointmentList from "./Pages/User/Appointments";
import ManageSchedule from "./Pages/Doctor/ManageSchedule";
import LoginDoctor from "./Pages/Doctor/login";
import ContactUs from "./Pages/User/ContactUs";
import Home from "./Pages/User/UserDashboard";
import UserProfile from "./Pages/User/UserProfile";
import Notification from "./Pages/User/Notification";
import AppointmentsList from "./Pages/Doctor/MyAssignedAppointments";

import { Toaster } from 'sonner';
import MyNotifications from "./Pages/Doctor/MyNotifications";
import LoginAdmin from "./Pages/Admin/AdminLogin";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminAddDoctor from "./Pages/Admin/AdminAddDoctor";
import AdminAddDepartment from "./Pages/Admin/AdminAddDepartment";
import AdminAppointmentManagement from "./Pages/Admin/AdminAppointmentManagement";
import AdminDoctorManagement from "./Pages/Admin/AdminDoctorManagement";
import AdminUpdateDoctor from "./Pages/Admin/AdminEditDoctor";
import AdminDepartmentManagement from "./Pages/Admin/AdminDepartmentManagement";
const App = () => {

  return (
    <Router>
     <Toaster 
      position="top-right" 
      richColors 
      closeButton 
      duration={5000}
      expand={false}
      offset="16px"
    />

      {/* NavBar should be outside Routes to show on all pages */}

      <Routes>

          <Route path = "/" element={<Home />} />
          <Route path = "/login" element={<LoginForm />} />
          <Route path="/getAllDoctors" element={<FindDoctors />} />
          <Route path= "/doctor/:doctorId" element={<DoctorPage />} />
          <Route path= "/appointments" element= {<AppointmentList />} />
          <Route path= "/contact-us" element= {<ContactUs />} />
          <Route path="/my-profile" element={<UserProfile />} />
          <Route path="/notification" element={<Notification/>} />

          {/* Doctor */}
          <Route path = "/login-doc" element={<LoginDoctor />} />
          <Route path= "/dashboard" element= {<ManageSchedule />} />
          <Route path= "/my-assigned-appointments" element= {<AppointmentsList />} />
          <Route path="/my-notifications" element={<MyNotifications/>} />

          {/* Admin */}
          <Route path="/login/admin" element={<LoginAdmin/>} />
          <Route path= "/admin/dashboard" element= {<AdminDashboard />} />
          <Route path= "/admin/add-doctor" element= {<AdminAddDoctor />} />
          <Route path= "/admin/doctors/edit/:doctorId" element= {<AdminUpdateDoctor />} />
          <Route path= "/admin/add-department" element= {<AdminAddDepartment/>} />
          <Route path= "/admin/appointments" element= {<AdminAppointmentManagement/>} />
          <Route path= "/admin/doctors" element= {<AdminDoctorManagement/>} />
          <Route path= "/admin/departments" element= {<AdminDepartmentManagement/>} />


          
      </Routes>

    </Router>

    
  );

}

export default App;
