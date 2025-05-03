import React, { useEffect, useState } from 'react'
import NavBar from '../../Components/User/Navbar'
import Resources from '../../Components/User/Resources'
import Footer from '../../Components/User/Footer'
import { useNavigate } from 'react-router-dom';

export const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState ('')
    const [success, setSuccess] = useState("")

    const navigate= useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            return setError('Email is required');
        }
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/auth/forgot-password', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                setSuccess(data.message || "Email sent successfully, please check your inbox.")
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (error) {
            console.log('Error in forgot-password:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(()=>{
        if(error || success){
            setTimeout(() => {
                setError("")
                setSuccess("")
            }, 4000);
        }
    },[error, success])
  return (

    <>
    <NavBar />
    <div style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f9fafb",
  padding: "0 1rem",
  minHeight: "100vh"
}}>
  <div style={{
    width: "100%",
    maxWidth: "28rem",
    paddingTop: "5rem",
    paddingBottom: "5rem"
  }}>
    <h1 style={{
      fontSize: "1.5rem",
      fontWeight: "700",
      textAlign: "center",
      color: "#1f2937"
    }}>
      Forgot Password
    </h1>
    <p style={{
      marginTop: "0.5rem",
      textAlign: "center",
      color: "#4b5563",
      fontSize: "0.875rem"
    }}>
      Enter your email address and we'll send you a link to reset your password.
    </p>
    {error && 
    (<p style ={{
        fontSize: '14px',
        color: '#dc2626',          // red-600
        marginTop: '8px',          // mt-2
        backgroundColor: '#fef2f2', // red-50
        padding: '16px',           // p-4
        borderRadius: '4px'        // slight rounding for better loo
    }}>{error}</p>)}
   {success && (
  <p style={{
    fontSize: '14px',
    color: '#16a34a',           // green-600
    marginTop: '8px',           // mt-2
    backgroundColor: '#dcfce7', // green-50
    padding: '16px',            // p-4
    borderRadius: '4px'         // slight rounding
  }}>
    {success}
  </p>
)}

    <form
      style={{
        marginTop: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem"
      }}
      onSubmit={handleSubmit}

    >
      <div>
        <label
          htmlFor="email"
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "#374151"
          }}
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        
          placeholder="you@example.com"
          style={{
            marginTop: "0.25rem",
            width: "100%",
            padding: "0.5rem 1rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.375rem",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            outline: "none",
            fontSize: "1rem"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#3b82f6";
            e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.5)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db";
            e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
          }}
        />
      </div>
      <button
      
        style={{
          width: "100%",
          padding: "0.5rem 1rem",
          backgroundColor: "#2563eb",
          color: "white",
          fontWeight: "600",
          borderRadius: "0.375rem",
          border: "none",
          cursor: "pointer",
          fontSize: "1rem"
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#1d4ed8";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#2563eb";
        }}

        type='submit'
      >
        {loading?(
            <p>Verifying...</p>
        ):(
            <p>Verify Email</p>
        )}
      </button>
    </form>
    <div style={{ marginTop: "1rem", textAlign: "center" }}>
      <a
        href="/login"
        style={{
          fontSize: "0.875rem",
          color: "#3b82f6",
          textDecoration: "none"
        }}
        onMouseOver={(e) => {
          e.target.style.textDecoration = "underline";
        }}
        onMouseOut={(e) => {
          e.target.style.textDecoration = "none";
        }}
      >
        Back to Login
      </a>
    </div>
  </div>
</div>
    <Resources />
    <Footer />
    </>
  )
}
