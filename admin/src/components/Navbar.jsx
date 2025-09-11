import React from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import LokSamadhanLogo from '../assets/LokSamadhanLogo.png'
import LokSamadhanLogo2 from '../assets/LokSamadhanLogo2.png'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className='navbar-content'>
        <div className="navbar-logo">
          <img id='logo' src={LokSamadhanLogo2}/>
        </div>
        
        <ul className="navbar-links">
          <li><NavLink to='/' className='active'>Homepage</NavLink></li>
          <li><NavLink to='/dashboard'>Dashboard</NavLink></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
