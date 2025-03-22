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

        const fetchUser = async () => {

            const  id = localStorage.getItem("userId")

            try{
                const response = await fetch (`http://localhost:5000/auth/get-user-by-id/${id}`,{
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
                        <Link to="/doctors" />Doctors
                        </button>
                        <button className="nav-item">
                        <Link to="/contact-us" />Contact Us
                        </button>
                    </div>

                    <div className="divider"></div>


                    <div className="nav-actions">
                        <div className="notification-icon">🔔</div>

                    <div className="user-profile">
                        <div className="username">Welcome, {username || "Guest"}</div>
                        <img className='user-photo' src={userImg} alt="User"></img>

                    </div>                    
                    </div>
            </div>
        </nav>
    );
};

export default NavBar;


