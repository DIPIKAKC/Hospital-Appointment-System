import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


//system imports
import FindDoctors from "./Pages/User/FindDoctors";
import DoctorPage from "./Pages/User/DoctorPage"
import LoginForm from "./Pages/User/Login";
import AppointmentList from "./Pages/User/Appointments";
import ManageSchedule from "./Pages/Doctor/ManageSchedule";
// import LoginDoctor from "./Pages/Doctor/login";
import ContactUs from "./Pages/User/ContactUs";
import Home from "./Pages/User/UserDashboard";
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
import AdminUserManagement from "./Pages/Admin/AdminUserManagement";
import SignupForm from "./Pages/User/Signup";
import DocContact from "./Pages/Doctor/DoctorContactus";
import SignupAdmin from "./Pages/Admin/AdminSignup";
import PatientProfile from "./Pages/User/UserProfile";
import ChangePasswordPage from "./Pages/User/ChangePassword";
import PaymentStatus from "./Pages/User/VerifyKhaltiPayment";
import { VerifyUserEmail } from "./Pages/User/VerifyUserEmail";
import { ForgotPassword } from "./Pages/User/ForgotPassword";
import { ResetPassword } from "./Pages/User/ResetPassword";
import AdminBar from "./Components/Admin/SideBar";
import DoctorDashboard from "./Pages/Doctor/DocDashboard";
import DoctorProfile from "./Pages/Doctor/DocProfile";
import ChangePasswordDoc from "./Pages/Doctor/ChangeDocPw";
// import PaymentPage from "./Pages/User/KhaltiPaymentPage";
// import PaymentStatus from "./Pages/User/KhaltiStatusPayment";



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
          <Route path = "/signup" element={<SignupForm />} />
          <Route path="/find-doctors" element={<FindDoctors />} />
          <Route path= "/doctor/:doctorId" element={<DoctorPage />} />
          <Route path= "/appointments" element= {<AppointmentList />} />
          <Route path= "/contact-us" element= {<ContactUs />} />
          <Route path="/my-profile" element={<PatientProfile />} />
          <Route path="/notification" element={<Notification/>} />
          <Route path="/change-password" element={<ChangePasswordPage/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />
          <Route path="/verify-email" element={<VerifyUserEmail/>} />



{/* payment */}
          <Route path="/khalti/payment/verify" element={<PaymentStatus />} /> */



          {/* Doctor */}
          {/* <Route path = "/login-doc" element={<LoginDoctor />} /> */}
          <Route path= "/doc-dashboard" element= {<DoctorDashboard />} />
          <Route path= "/schedules" element= {<ManageSchedule />} />
          <Route path= "/my-assigned-appointments" element= {<AppointmentsList />} />
          <Route path="/my-notifications" element={<MyNotifications/>} />
          <Route path= "/contact" element= {<DocContact />} />
          <Route path= "/profile-doc" element= {<DoctorProfile />} />
          <Route path= "/change-pw-doc" element= {<ChangePasswordDoc />} />


          {/* Admin */}

          <Route path="/login/admin" element={<LoginAdmin/>} />
          <Route path="/register/admin" element={<SignupAdmin/>} />
          <Route path= "/admin/dashboard" element= {<AdminDashboard />} />

          <Route path= "/admin/add-doctor" element= {<AdminAddDoctor />} />
          <Route path= "/admin/doctors/edit/:doctorId" element= {<AdminUpdateDoctor />} />
          <Route path= "/admin/doctors" element= {<AdminDoctorManagement/>} />

          <Route path= "/admin/add-department" element= {<AdminAddDepartment/>} />
          <Route path= "/admin/departments" element= {<AdminDepartmentManagement/>} />

          <Route path= "/admin/users" element= {<AdminUserManagement/>} />

          <Route path= "/admin/appointments" element= {<AdminAppointmentManagement/>} />


          
      </Routes>

    </Router>

    
  );

}

export default App;
