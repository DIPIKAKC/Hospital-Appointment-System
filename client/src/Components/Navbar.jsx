import React, { useEffect, useState } from "react";
import { Link, NavLink} from "react-router-dom";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { HiOutlineBell } from "react-icons/hi2";

import './Navbar.css';
import userImg from '../assets/user.jpg'

const NavBar = () => {

    const [username, setUsername] = useState ("");

    useEffect(() => {
        const  userId = localStorage.getItem("id")
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
            setUsername(data.data.fullName);

            }catch (error) {
                console.error("Error fetching user:", error);
            }

        }

        fetchUser();
    }, []);

    return(

        <nav className="nav-bar">

            <div className="Nav-container">
                    {/* <button className="logo">
                        <Link to= "/" > MedEase</Link>
                    </button> */}

                    <Link to="/">
                        <button className="logo">MedEase</button>
                    </Link>

                    <div className="navbar-menu">
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        Home
                    </NavLink>

                    <NavLink to="/appointments" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        Appointments
                    </NavLink>

                    <NavLink to="/getAllDoctors" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        Find Doctors
                    </NavLink>

                    <NavLink to="/contact-us" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        Contact Us
                    </NavLink>

                    </div>

                    <div className="divider"></div>


                    <div className="nav-actions">
                        <NavLink to="/notification" >
                             <HiOutlineBell size={22}/>
                        </NavLink>

                    <div className="user-profile">
                        <img className='user-photo' src={userImg} alt="User"></img>
                        <div className="username">
                            {username ? `Welcome, ${username}` : `Welcome, Guest`}
                        </div>
                        <MdOutlineArrowDropDown size={22}/>
                    </div>                    
                    </div>
            </div>
        </nav>
    );
}; 

export default NavBar;
