import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const userData = { name, email, password, role };

      // Add department if the role is doctor
      if (role === "doctor") {
        userData.department = department;
      }

      // Perform the registration via an API call using fetch
      const response = await fetch("https://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        mode: "no-cors"  // This disables CORS check, but you won't be able to read the response
      });

      if (!response.ok) {
        throw new Error("Error registering user");
      }

      const data = await response.json();
      console.log(data)
      // After successful registration, redirect to the login page
      navigate("/login");
    } 
    catch (error) {
      setMessage(error.message || "Error registering user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <div>
          <h2 className="register-heading">Create your account</h2>
          <p className="register-subheading">Join our healthcare platform</p>
        </div>

        {message && (
          <div className="error-message">
            <p>{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form-fields">
          <div className="form-group">
            <label htmlFor="name" className="sr-only">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="role-label">I am a:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-input"
            >
              <option value="user">Patient</option>
              <option value="doctor">Doctor</option> {/* Removed the comment on doctor role */}
            </select>
          </div>

          {role === "doctor" && (
            <div className="form-group">
              <label htmlFor="department" className="role-label">Medical Specialization</label>
              <input
                id="department"
                type="text"
                placeholder="e.g. Cardiology, Pediatrics"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="form-input"
              />
            </div>
          )}

          <div className="form-action">
            <button
              type="submit"
              disabled={loading}
              className={`submit-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? "Registering..." : "Sign up"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="account-exists-text">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;











































// // src/pages/Register.js

// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import "./Register.css";

// import { registerUser } from "../api"; // Import the registerUser function

// const Register = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("user");
//   const [department, setDepartment] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     try {
//       const userData = { name, email, password, role };

//       // Add specialization if the role is doctor
//       if (role === "doctor") {
//         userData.department = department;
//       }

//       // Call the API to register the user
//       await registerUser(userData);

//       // After successful registration, redirect to the login page
//       navigate("/login");
//     } catch (error) {
//       setMessage(error.message || "Error registering user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="register-container">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="register-form"
//       >
//         <div>
//           <h2 className="register-heading">Create your account</h2>
//           <p className="register-subheading">Join our healthcare platform</p>
//         </div>

//         {message && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="error-message"
//           >
//             <p>{message}</p>
//           </motion.div>
//         )}

//         <form onSubmit={handleSubmit} className="register-form-fields">
//           <div className="form-group">
//             <label htmlFor="name" className="sr-only">Name</label>
//             <input
//               id="name"
//               type="text"
//               placeholder="Full Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               className="form-input"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="email" className="sr-only">Email</label>
//             <input
//               id="email"
//               type="email"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="form-input"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password" className="sr-only">Password</label>
//             <input
//               id="password"
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="form-input"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="role" className="role-label">I am a:</label>
//             <select
//               id="role"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="form-input"
//             >
//               <option value="user">Patient</option>
//             </select>
//           </div>

//           {role === "doctor" && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//             >
//               <label htmlFor="specialization" className="role-label">Medical Specialization</label>
//               <input
//                 id="department"
//                 type="text"
//                 placeholder="e.g. Cardiology, Pediatrics"
//                 value={department}
//                 onChange={(e) => setDepartment(e.target.value)}
//                 required
//                 className="form-input"
//               />
//             </motion.div>
//           )}

//           <div className="form-action">
//             <button
//               type="submit"
//               disabled={loading}
//               className={`submit-btn ${loading ? 'loading' : ''}`}
//             >
//               {loading ? "Registering..." : "Sign up"}
//             </button>
//           </div>
//         </form>

//         <div className="text-center">
//           <p className="account-exists-text">
//             Already have an account?{" "}
//             <Link to="/login" className="link">
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Register;
