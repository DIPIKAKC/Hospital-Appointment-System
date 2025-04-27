import React, { useEffect, useState } from 'react'
import NavBar from '../../Components/User/Navbar'
import Resources from '../../Components/User/Resources'
import Footer from '../../Components/User/Footer'
import { useParams } from 'react-router-dom'

export const ResetPassword = () => {

    const [password, setPassword]= useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState ('')
    const [success, setSuccess] = useState("")
    const [token, setToken] = useState("")
    const [loading, setLoading] = useState(false)
    

    const handleSubmit = async(e) =>{
        e.preventDefault()
        if (!password || !confirmPassword) {
            return setError("Please fill all the fields")
        }
        if (password !== confirmPassword) {
            return setError("Passwords do not match")
        }
        try {
            setLoading(true)
            const response = await fetch(`http://localhost:5000/auth/password-reset/${token}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            })
            const data = await response.json()
            if (data.success) {
                setSuccess(data.message || "Password changed successfully")
                setPassword('')
                setConfirmPassword('')
                
            } else if (data.success === false) {
                setError(data.message || "Something went wrong, Try again !")
            }
        } catch (error) {
            setError(error?.response?.data?.message || "An error occurred. Please try again later.")
        } finally {
            setLoading(false)
        }    }

        const params = new URLSearchParams(window.location.search);
        useEffect(() => {
            const token = params.get('t');
            if(token){
                setToken(token)
            }
        }, [params])

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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    padding: '0 16px'
    }}>
  <div style={{
    width: '100%',
    maxWidth: '28rem',
    paddingTop: '5rem',
    paddingBottom: '5rem'
  }}>
    <h1 style={{
      fontSize: '1.5rem',
      fontWeight: '700',
      textAlign: 'center',
      color: '#1f2937'
    }}>
      Change Password
    </h1>
    <p style={{
      marginTop: '0.5rem',
      textAlign: 'center',
      color: '#4b5563',
      fontSize: '0.875rem'
    }}>
      Enter your new password below to reset your account.
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
        marginTop: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}
      onSubmit={handleSubmit}
    >
      <div>
        <label
          htmlFor="newPassword"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151'
          }}
        >
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          name="newPassword"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          placeholder="Enter new password"
          style={{
            marginTop: '0.25rem',
            width: '100%',
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            outline: 'none',
            fontSize: '1rem'
          }}
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151'
          }}
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e)=> setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          style={{
            marginTop: '0.25rem',
            width: '100%',
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            outline: 'none',
            fontSize: '1rem'
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '0.5rem 1rem',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          fontWeight: '600',
          borderRadius: '0.375rem',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'background-color 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
      >
        {loading?(
            <p>Changing password...</p>
        ):(
            <p>Change Password</p>
        )}      </button>
    </form>
    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
      <a
        href="/login"
        style={{
          fontSize: '0.875rem',
          color: '#2563eb',
          textDecoration: 'none'
        }}
        onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
        onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
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
