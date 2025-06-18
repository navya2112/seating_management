import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <span className="navbar-brand">Seating Arrangement</span>
      </div>
      
      <div className="navbar-nav">
        <NavLink to="/location" className={({ isActive }) => isActive ? 'nav-link text-warning' : 'nav-link'}>
          Search
        </NavLink>
        <NavLink to="/add-location" className={({ isActive }) => isActive ? 'nav-link text-warning' : 'nav-link'}>
          Add_Location
        </NavLink>
        <NavLink to="/delete-location" className={({ isActive }) => isActive ? 'nav-link text-warning' : 'nav-link'}>
          Remove_Location
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
