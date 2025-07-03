// import React from 'react';
// import { NavLink } from 'react-router-dom';

// const Navbar = () => {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//       <div className="container-fluid">
//         <span className="navbar-brand">Seating Arrangement</span>
//       </div>
      
//       <div className="navbar-nav">
//         <NavLink to="/location" className={({ isActive }) => isActive ? 'nav-link text-warning' : 'nav-link'}>
//           Search
//         </NavLink>
//         <NavLink to="/add-location" className={({ isActive }) => isActive ? 'nav-link text-warning' : 'nav-link'}>
//           Add_Location
//         </NavLink>
//         <NavLink to="/delete-location" className={({ isActive }) => isActive ? 'nav-link text-warning' : 'nav-link'}>
//           Remove_Location
//         </NavLink>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported if you're using Bootstrap classes

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link to="/location" className='text-decoration-none'>
        <span className="navbar-brand">Seating Arrangement</span>
        </Link>
      </div>
      
      <div className="navbar-nav">
        <NavLink to="/location" className={({ isActive }) => isActive ? 'nav-link text-warning' : 'nav-link'}>
          Search
        </NavLink>
        
        {/* NEW: Excel Upload Link */}
        <NavLink to="/upload-excel" className={({ isActive }) => isActive ? 'nav-link text-warning' : 'nav-link'}>
          Upload_Excel
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;