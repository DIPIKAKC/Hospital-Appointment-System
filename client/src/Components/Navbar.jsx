import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Navbar.css';
import userImg from '../Images/user.jpg'

const NavBar = () => {

    const [username, setUsername] = useState ("");

    // const handleChange = (e) =>{
    //     const {name, value} =e.target;
    //     setUsername({...username, [name]: value});
    // };

    // const handleSubmit = async (e) =>{
    //     e.preventDefault();
    //     console.log(username);
    // }

    useEffect(() => {
        const  userId = localStorage.getItem("userId")
        console.log(userId)
        
        const fetchUser = async () => {
            try{
                const response = await fetch (`http://localhost:5000/auth/get-user-by-id/${userId}`,{
                    method:  'GET',
                    headers: {
                    'Content-Type' : 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("token")}` // Assuming token is stored in localStorage
                    }, 
                })

            if (!response.ok){
                throw new Error("Failed to fetch user data");
            }

            const data = await response.json();
            setUsername(data.fullName);

            }catch (error) {
                console.error("Error fetching user:", error);
            }

        }

        fetchUser();
    }, []);

    return(

        <nav className="nav-bar">

            <div className="Nav-container">
                    <button className="logo">
                        <Link to= "/" /> MedEase
                    </button>
                    <div className="navbar-menu">
                    <button className="nav-item">
                        <Link to="/Home" />Home
                        </button>
                        <button className="nav-item">
                        <Link to="/appointments" />Appointments
                        </button>
                        <button className="nav-item">
                        <Link to="/doctors" /> Find Doctors
                        </button>
                        <button className="nav-item">
                        <Link to="/contact-us" />Contact Us
                        </button>
                    </div>

                    <div className="divider"></div>


                    <div className="nav-actions">
                        <div className="notification-icon">🔔</div>

                    <div className="user-profile">
                        <img className='user-photo' src={userImg} alt="User"></img>

                        <div className="username">
                            {username ? `Welcome, ${username}` : `Welcome, Guest`}
                        </div>

                    </div>                    
                    </div>
            </div>
        </nav>
    );
};

export default NavBar;





// import React, { useEffect, useState, useCallback, memo } from "react";
// import {NavLink } from "react-router-dom";
// import './Navbar.css';
// import userImg from '../Images/user.jpg';

// const NavBar = memo(() => {
//     const [username, setUsername] = useState("");
//     const [isLoading, setIsLoading] = useState(true);

//     const fetchUser = useCallback(async () => {
//         const userId = localStorage.getItem("userId");
//         if (!userId) {
//             setIsLoading(false);
//             return;
//         }

//         try {
//             const response = await fetch(`http://localhost:5000/auth/get-user-by-id/${userId}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     "Authorization": `Bearer ${localStorage.getItem("token")}`
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to fetch user data");
//             }

//             const data = await response.json();
//             setUsername(data.fullName);
//         } catch (error) {
//             console.error("Error fetching user:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchUser();
//     }, [fetchUser]);

//     const navItems = [
//         { to: "/Home", label: "Home" },
//         { to: "/appointments", label: "Appointments" },
//         { to: "/doctors", label: "Doctors" },
//         { to: "/contact-us", label: "Contact Us" }
//     ];

//     return (
//         <nav className="nav-bar">
//             <div className="nav-container">
//                 <NavLink to="/" className="logo">
//                     MedEase
//                 </NavLink>
                
//                 <div className="navbar-menu">
//                     {navItems.map((item) => (
//                         <NavLink 
//                             key={item.to} 
//                             to={item.to} 
//                             className={({ isActive }) => 
//                                 `nav-item ${isActive ? 'active' : ''}`
//                             }
//                         >
//                             {item.label}
//                         </NavLink>
//                     ))}
//                 </div>

//                 <div className="divider"></div>

//                 <div className="nav-actions">
//                     <div className="notification-icon" role="button" aria-label="Notifications">
//                         🔔
//                     </div>

//                     <div className="user-profile">
//                         <div className="username">
//                             {isLoading 
//                                 ? "Loading..." 
//                                 : (username ? `Welcome, ${username}` : "Welcome, Guest")
//                             }
//                         </div>
//                         <img 
//                             className='user-photo' 
//                             src={userImg} 
//                             alt={username ? `${username}'s profile` : "Guest profile"}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// });

// NavBar.displayName = 'NavBar';
// export default NavBar;