import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // Redirect if already logged in
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error logging in");
      }

      const { token, user } = data;

      // Store user data and token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        {message && <p className="error-message">{message}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label htmlFor="email" className="label">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="remember-forgot">
            <div className="remember-me">
              <input id="remember-me" name="remember-me" type="checkbox" />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
            </div>

          <button type="submit" className="submit-btn">Sign in</button>
        </form>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <div className="social-login">
          <button className="social-btn google">Google</button>
          <button className="social-btn github">GitHub</button>
        </div>

        <p className="register-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

































// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import "./Login.css"; 

// const LoginForm = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//        email: "",
//        password: "" 
//     });
//     const [message, setMessage]=useState("")
  
//     const handleChange = (e) => {
//       const { name, value } = e.target;
//       setFormData({ ...formData, [name]: value });
//     };
  
//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       console.log("Form Data:", formData); // Debugging
//       setMessage()
    
//       try {
//         const response = await fetch("http://localhost:4000/auth/login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//         });
    
//         const data = await response.json();
//         console.log("Response Data:", data); // Debugging
    
//         if (response.ok) {
//           localStorage.setItem("token", data.token);
//           localStorage.setItem("user", JSON.stringify(data.user));
//           alert("Login successful!");
//           navigate(data.user.role === "doctor" ? "/doctor-dashboard" : "/dashboard");
//         } else {
//           alert(data.message || "Invalid credentials");
//         }
//       } catch (error) {
//         console.error("Error logging in:", error);
//       }
//     };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h2 className="login-title">Welcome Back</h2>
//         {message && <p className="error-message">{message}</p>}

//         <form onSubmit={handleSubmit} className="login-form">
//           <div>
//             <label htmlFor="email" className="label">Email Address</label>
//             <input
//               id="email"
//               type="email"
//               placeholder="your@email.com"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="input-field"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="label">Password</label>
//             <input
//               id="password"
//               type="password"
//               placeholder=" your password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="input-field"
//             />
//           </div>

//           <div className="remember-forgot">
//             <div className="remember-me">
//               <input id="remember-me" name="remember-me" type="checkbox" />
//               <label htmlFor="remember-me">Remember me</label>
//             </div>
//             <a href="#" className="forgot-password">Forgot password?</a>
//           </div>

//           <button type="submit" className="submit-btn">Sign in</button>
//         </form>

//         <div className="divider">
//           <span>Or continue with</span>
//         </div>

//         <div className="social-login">
//           <button className="social-btn google">Google</button>
//           <button className="social-btn github">GitHub</button>
//         </div>

//         <p className="register-link">
//           Don't have an account? <Link to="/register">Sign up</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;
