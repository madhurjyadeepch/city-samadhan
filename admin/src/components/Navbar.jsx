import React from "react";
import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import LokSamadhanLogo2 from '../assets/LokSamadhanLogo2.png';

const Navbar = ({ setIsSignedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsSignedIn(false);
    navigate('/signin');
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