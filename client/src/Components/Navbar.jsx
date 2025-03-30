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
                    {/* <button className="logo">
                        <Link to= "/" > MedEase</Link>
                    </button> */}

                    <Link to="/Home">
                        <button className="logo">MedEase</button>
                    </Link>

                    <div className="navbar-menu">
                        {/* <button className="nav-item">
                            <Link to="/Home">Home</Link>
                        </button>
                        <button className="nav-item">
                            <Link to="/appointments" >Appointments</Link>
                        </button>
                        <button className="nav-item">
                            <Link to="/getAllDoctors" > Find Doctors</Link>
                        </button>
                        <button className="nav-item">
                            <Link to="/contact-us" >Contact Us</Link>
                        </button> */}

                        <Link to="/Home">
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
