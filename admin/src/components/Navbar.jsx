// src/components/Navbar.jsx

import React from "react";
import "./Navbar.css";
// useNavigate is no longer needed with this method
import { NavLink } from "react-router-dom"; 
import LokSamadhanLogo2 from '../assets/LokSamadhanLogo2.png';

const Navbar = ({ setIsSignedIn }) => {
  const handleLogout = () => {
    // 1. Clear the token from browser storage
    localStorage.removeItem('jwt');
    
    // 2. Update the app's state
    setIsSignedIn(false);
    
    // 3. Force the browser to navigate to the sign-in page and reload
    window.location.href = '/signin';
  };

  return (
    <nav className="navbar">
      <div className='navbar-content'>
        <div className="navbar-logo">
          <img id='logo' src={LokSamadhanLogo2} alt="Logo" />
        </div>
        
        <ul className="navbar-links">
          <li><NavLink to='/' className='active'>Homepage</NavLink></li>
          <li><NavLink to='/dashboard'>Dashboard</NavLink></li>
          <li>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;