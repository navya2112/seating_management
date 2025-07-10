// import React from 'react';
// import { Link, NavLink } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported if you're using Bootstrap classes

// const Navbar = () => {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//       <div className="container-fluid">
//         <Link to="/location" className='text-decoration-none'>
//         <span className="navbar-brand">Seating Arrangement</span>
//         </Link>
//       </div>
      
//       <div className="navbar-nav">
//         <NavLink to="/location" className={({ isActive }) => isActive ? 'nav-link text-warning' : 'nav-link'}>
//           Search
//         </NavLink>
        
//         {/* NEW: Excel Upload Link */}
//         <NavLink to="/upload-excel" className={({ isActive }) => isActive ? 'nav-link text-warning' : 'nav-link'}>
//           Upload_Excel
//         </NavLink>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Navbar = ({ loggedInUser, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link to="/location" className='text-decoration-none d-flex align-items-center'>
          <span className="navbar-brand mb-0 h1">Seating Arrangement</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <NavLink to="/location" className={({ isActive }) => isActive ? 'nav-link text-warning' : 'nav-link'}>
                Locations
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/upload-excel" className={({ isActive }) => isActive ? 'nav-link text-warning' : 'nav-link'}>
                Upload_Excel
              </NavLink>
            </li>
            <li className="nav-item"> {/* New Download Link */}
              <NavLink to="/download-excel" className={({ isActive }) => isActive ? 'nav-link text-warning' : 'nav-link'}>
                Download_Excel
              </NavLink>
            </li>

            {/* Profile Dropdown */}
            <li className="nav-item dropdown ms-2">
              <a
                className="nav-link d-flex align-items-center"
                //href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle fs-4"></i>
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><span className="dropdown-item-text">{loggedInUser}</span></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={onLogout}>Logout</button></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;