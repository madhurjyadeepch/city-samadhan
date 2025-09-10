import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className='navbar-content'>
        <div className="navbar-logo">CitySamadhan</div>
        
        <ul className="navbar-links">
          <li><a href="/">Homepage</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
