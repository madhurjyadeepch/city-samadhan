// src/components/SignIn.jsx

import React, { useState } from 'react';
import './SignIn.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // You'll need to install axios: npm install axios

const SignIn = ({ setIsSignedIn }) => { // Re-introducing setIsSignedIn from App.js
    // --- 1. Add state for inputs, loading, and errors ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // List of departments
    const departments = [
        { id: 'mohua', name: 'Ministry of Housing & Urban Affairs (MoHUA)' },
        { id: 'municipal', name: 'Municipal Corporation / Urban Local Bodies' },
        { id: 'pwd', name: 'Public Works Department (State PWD)' },
        // ... add other departments here if needed
    ];

    const navigate = useNavigate();

    // --- 2. Handle form submission and API call ---
    const handleSignIn = async (e) => {
        e.preventDefault(); // Prevent the form from reloading the page
        if (!email || !password || !department) {
            setError('All fields are required.');
            return;
        }
        
        setLoading(true);
        setError('');

        console.log("Submitting with:", { email, password });

        try {
            const response = await axios.post('http://127.0.0.1:3000/api/v1/users/login', {
                email,
                password,
            });
            
            // Save the token to localStorage for future API calls
            localStorage.setItem('jwt', response.data.token);
            
            // Update the app's global state to reflect login
            setIsSignedIn(true);

            // Navigate to the homepage
            navigate('/');

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='signin-container'>
            <h1 id='signin-title'>Sign In</h1>
            <form id='user-signin-form' onSubmit={handleSignIn}>
                <div className='input-container'>
                    {/* --- 3. Connect inputs to state --- */}
                    <input 
                        type='email' 
                        placeholder='Email' 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <input 
                        type='password' 
                        placeholder='Password' 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    <select 
                        id='department-select' 
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                    >
                        <option value='' disabled>Select Department</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.name}>{dept.name}</option>
                        ))}
                    </select>
                    
                    {/* --- 4. Show loading/error messages --- */}
                    {error && <p className="error-message">{error}</p>}
                    
                    <button id='signin-button' type='submit' disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignIn;