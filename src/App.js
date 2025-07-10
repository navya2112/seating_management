// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import 'bootstrap-icons/font/bootstrap-icons.css';

// import Navbar from './components/common/Navbar';
// import LoginPage from './pages/LoginPage';
// import LocationPage from './pages/LocationPage';
// import AddLocationPage from './pages/AddLocationPage';
// import DeleteLocationPage from './pages/DeleteLocationPage';
// import BuildingPage from './pages/BuildingPage'; // This now shows UNIQUE BUILDINGS
// import AddBuildingPage from './pages/AddBuildingPage';
// import DeleteBuilding from './pages/DeleteBuilding';
// import RoomPage from './pages/RoomPage'; // This shows ROOM CATEGORIES (e.g., Training Room, ODC)
// import SpecificRoom from './pages/SpecificRoom'; // This shows individual ROOMS of a specific category
// import RoomViewPage from './pages/RoomViewPage'; // This shows details of a SINGLE ROOM
// import AddRoom from './pages/AddRoom';
// import AllocateRoomPage from './pages/AllocateRoomPage';
// import DeleteRoom from './pages/DeleteRoom';
// import AllocateStrategyPage from './pages/AllocateStrategyPage';
// import ExcelUploadPage from './pages/ExcelUploadPage';


// function App() {
//   return (
//     <Router>
//        {/* This renders on all pages */}
//       <Routes>
//         {/* Authentication/Landing */}
//         <Route path="/" element={<LoginPage />} />

//         <Route path="/*" element = {
//           <>
//             <Navbar />
//             <Routes>
//               <Route path="/location" element={<LocationPage />} />
//               <Route path="/add-location" element={<AddLocationPage />} />
//               <Route path="/delete-location" element={<DeleteLocationPage />} />

//               {/* Building Management within a Location */}
//               {/* Displays a list of buildings for a specific location */}
//               <Route path="/location/:locationName" element={<BuildingPage />} />
//               <Route path="/location/:locationName/add-building" element={<AddBuildingPage />} /> {/* Assuming add building for a specific location */}
//               <Route path="/location/:locationName/delete-building" element={<DeleteBuilding />} />

//               {/* Room Category Overview within a Building */}
//               {/* Displays categories of rooms (e.g., Training Room, Conference Room) for a specific building */}
//               <Route path="/location/:locationName/:buildingName" element={<RoomPage />} />

//               {/* Specific Room Type List within a Building */}
//               {/* Displays individual rooms of a selected type (e.g., all Training Rooms) */}
//               {/* This path segment is for roomType, e.g., /location/Chennai/SDB1/trainingroom */}
//               <Route path="/location/:locationName/:buildingName/:roomType" element={<SpecificRoom />} />

//               {/* Individual Room Detail View */}
//               {/* Displays detailed information for a single, specific room */}
//               {/* This path is highly specific: /location/Chennai/SDB1/trainingroom/T001/view */}
//               <Route path="/location/:locationName/:buildingName/:roomType/:roomNumber/view" element={<RoomViewPage />}/>

//               {/* Room Management Actions */}
//               <Route path="/location/:locationName/:buildingName/add-room" element={<AddRoom />} />
//               {/* Delete room is usually for specific types, so it should follow roomType path */}
//               <Route path="/location/:locationName/:buildingName/:roomType/delete-room" element={<DeleteRoom />} />
//               <Route path="/location/:locationName/:buildingName/allocate" element={<AllocateRoomPage/>}/>


//               {/* Global/Other Functionality */}
//               <Route path="/allocate-strategy" element={<AllocateStrategyPage />} />
//               <Route path="/upload-excel" element={<ExcelUploadPage />} />
//               <Route path="/room/view/:locationName/:buildingName/:roomType/:floorNumber/:roomNumber" element={<RoomViewPage />} />
//             </Routes>
//           </>
//         }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;







import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Navbar from './components/common/Navbar';
import LoginPage from './pages/LoginPage';
import LocationPage from './pages/LocationPage';
import AddLocationPage from './pages/AddLocationPage';
import DeleteLocationPage from './pages/DeleteLocationPage';
import BuildingPage from './pages/BuildingPage';
import AddBuildingPage from './pages/AddBuildingPage';
import DeleteBuilding from './pages/DeleteBuilding';
import SpecificRoom from './pages/SpecificRoom';
import RoomPage from './pages/RoomPage';
import RoomViewPage from './pages/RoomViewPage';
import AddRoom from './pages/AddRoom';
import AllocateRoomPage from './pages/AllocateRoomPage';
import DeleteRoom from './pages/DeleteRoom';
import AllocateStrategyPage from './pages/AllocateStrategyPage';
import ExcelUploadPage from './pages/ExcelUploadPage';
import DownloadPage from './pages/DownloadPage';


// Create a new component to house the logic that uses hooks
function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate(); // Now useNavigate is called within a component inside <Router>

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setLoggedInUser(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInUser('');
    navigate('/'); // Redirect to login page
  };

  return (
    <Routes>
      {/* The Login page is a standalone route */}
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} /> {/* Pass onLogin prop */}

      {/* All other routes will have the Navbar, conditionally rendered based on isAuthenticated */}
      {isAuthenticated && ( // Conditionally render this entire route branch
        <Route
          path="/*" // This matches any path not explicitly defined above (like "/")
          element={
            <>
              {/* Pass loggedInUser and handleLogout to Navbar */}
              <Navbar loggedInUser={loggedInUser} onLogout={handleLogout} />
              <Routes> {/* Nested Routes for all pages after login */}
                {/* Location Management */}
                <Route path="/location" element={<LocationPage />} />
                <Route path="/add-location" element={<AddLocationPage />} />
                <Route path="/delete-location" element={<DeleteLocationPage />} />

                {/* Building Management within a Location */}
                <Route path="/location/:locationName" element={<BuildingPage />} />
                <Route path="/location/:locationName/add-building" element={<AddBuildingPage />} />
                <Route path="/location/:locationName/delete-building" element={<DeleteBuilding />} />

                {/* Room Category Overview within a Building */}
                <Route path="/location/:locationName/:buildingName" element={<RoomPage />} />

                {/* Specific Room Type List within a Building */}
                <Route path="/location/:locationName/:buildingName/:roomType" element={<SpecificRoom />} />

                {/* Individual Room Detail View */}
                <Route path="/location/:locationName/:buildingName/:roomType/:roomNumber/view" element={<RoomViewPage />} />
                <Route path="/room/view/:locationName/:buildingName/:roomType/:floorNumber/:roomNumber" element={<RoomViewPage />} />


                {/* Room Management Actions */}
                <Route path="/location/:locationName/:buildingName/add-room" element={<AddRoom />} />
                <Route path="/location/:locationName/:buildingName/allocate" element={<AllocateRoomPage />} />
                <Route path="/location/:locationName/:buildingName/:roomType/delete-room" element={<DeleteRoom />} />

                {/* Global/Other Functionality */}
                <Route path="/allocate-strategy" element={<AllocateStrategyPage />} />
                <Route path="/upload-excel" element={<ExcelUploadPage />} />
                <Route path="/download-excel" element={<DownloadPage />} /> {/* New route for download */}

              </Routes>
            </>
          }
        />
      )}
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent /> {/* Render the new AppContent component inside Router */}
    </Router>
  );
}

export default App;