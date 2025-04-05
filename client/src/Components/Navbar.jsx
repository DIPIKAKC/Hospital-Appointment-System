import React, { useEffect, useState } from "react";
import { Link} from "react-router-dom";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { HiOutlineBell } from "react-icons/hi2";

import './Navbar.css';
import userImg from '../Images/user.jpg'

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
                        <Link to="/">
                            <button className="nav-item" activeClassName="active">Home</button>
                        </Link>
                        <Link to="/appointments">
                            <button className="nav-item" activeClassName="active">Appointments</button>
                        </Link>
                        <Link to="/getAllDoctors">
                            <button className="nav-item" activeClassName="active">Find Doctors</button>
                        </Link>
                        <Link to="/contact-us">
                            <button className="nav-item" activeClassName="active">Contact Us</button>
                        </Link>
                    </div>

                    <div className="divider"></div>


                    <div className="nav-actions">
                        <div className="notification-icon"><HiOutlineBell size={22}/></div>

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
