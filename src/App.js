// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import 'bootstrap-icons/font/bootstrap-icons.css';

// import Navbar from './components/common/Navbar';
// import LoginPage from './pages/LoginPage';
// import LocationPage from './pages/LocationPage';
// import AddLocationPage from './pages/AddLocationPage';
// import DeleteLocationPage from './pages/DeleteLocationPage';
// import BuildingPage from './pages/BuildingPage';
// import AddBuildingPage from './pages/AddBuildingPage';
// import DeleteBuilding from './pages/DeleteBuilding';
// import SpecificRoom from './pages/SpecificRoom';
// import RoomPage from './pages/RoomPage';
// import RoomViewPage from './pages/RoomViewPage';
// import AddRoom from './pages/AddRoom';
// import AllocateRoomPage from './pages/AllocateRoomPage';
// import DeleteRoom from './pages/DeleteRoom';
// import AllocateStrategyPage from './pages/AllocateStrategyPage';
// import ExcelUploadPage from './pages/ExcelUploadPage';


// function App() {
//   return (
//     <Router>
//       <Navbar /> {/* This should be outside Routes */}
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/location" element={<LocationPage />} />
//         <Route path="/add-location" element={<AddLocationPage />} />
//         <Route path="/delete-location" element={<DeleteLocationPage />} />
//         {/* <Route path="/location/:locationName" element={<BuildingPage />} /> */}
//         <Route path="/add-building" element={<AddBuildingPage />} />
//         <Route path="/upload-excel" element={<ExcelUploadPage />} /> {/* New route for Excel upload */}
//         <Route path="/location/:locationName" element={<BuildingPage />} />


//         {/* SpecificRoom now only takes location and building name */}
//         <Route path="/location/:locationName/:buildingName" element={<SpecificRoom />} />
        
//         {/* Route for RoomViewPage (specific room detail) */}
//         {/* This path must match what SpecificRoom.jsx navigates to */}
//         <Route 
//           path="/location/:locationName/:buildingName/:roomType/:roomNumber/view" 
//           element={<RoomViewPage />} 
//         />

//         <Route path="/location/:locationName/:buildingName/:roomType?" element={<SpecificRoom />} />

//         <Route path="/location/:locationName/delete-building" element={<DeleteBuilding />} />
//         <Route path="/location/:locationName/:buildingName" element={<RoomPage/>} />
//         {/* <Route path="/location/:locationName/:buildingName/:roomType" element={<SpecificRoom />} /> */}
//         <Route path="/allocate-strategy" element={<AllocateStrategyPage />} />

//         <Route path="/location/:locationName/:buildingName/:roomType/:roomNumber/view" element={<RoomViewPage/>} />
//         <Route path="/location/:locationName/:buildingName/add-room" element={<AddRoom />} />
//         <Route path="/location/:locationName/:buildingName/allocate" element={<AllocateRoomPage/>}/>
//         <Route path="/location/:locationName/:buildingName/:roomType/delete-room" element={<DeleteRoom />}/>




//       </Routes>
//     </Router>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Navbar from './components/common/Navbar';
import LoginPage from './pages/LoginPage';
import LocationPage from './pages/LocationPage';
import AddLocationPage from './pages/AddLocationPage';
import DeleteLocationPage from './pages/DeleteLocationPage';
import BuildingPage from './pages/BuildingPage'; // This now shows UNIQUE BUILDINGS
import AddBuildingPage from './pages/AddBuildingPage';
import DeleteBuilding from './pages/DeleteBuilding';
import RoomPage from './pages/RoomPage'; // This shows ROOM CATEGORIES (e.g., Training Room, ODC)
import SpecificRoom from './pages/SpecificRoom'; // This shows individual ROOMS of a specific category
import RoomViewPage from './pages/RoomViewPage'; // This shows details of a SINGLE ROOM
import AddRoom from './pages/AddRoom';
import AllocateRoomPage from './pages/AllocateRoomPage';
import DeleteRoom from './pages/DeleteRoom';
import AllocateStrategyPage from './pages/AllocateStrategyPage';
import ExcelUploadPage from './pages/ExcelUploadPage';


function App() {
  return (
    <Router>
      <Navbar /> {/* This renders on all pages */}
      <Routes>
        {/* Authentication/Landing */}
        <Route path="/" element={<LoginPage />} />

        {/* Location Management */}
        <Route path="/location" element={<LocationPage />} />
        <Route path="/add-location" element={<AddLocationPage />} />
        <Route path="/delete-location" element={<DeleteLocationPage />} />

        {/* Building Management within a Location */}
        {/* Displays a list of buildings for a specific location */}
        <Route path="/location/:locationName" element={<BuildingPage />} />
        <Route path="/location/:locationName/add-building" element={<AddBuildingPage />} /> {/* Assuming add building for a specific location */}
        <Route path="/location/:locationName/delete-building" element={<DeleteBuilding />} />

        {/* Room Category Overview within a Building */}
        {/* Displays categories of rooms (e.g., Training Room, Conference Room) for a specific building */}
        <Route path="/location/:locationName/:buildingName" element={<RoomPage />} />

        {/* Specific Room Type List within a Building */}
        {/* Displays individual rooms of a selected type (e.g., all Training Rooms) */}
        {/* This path segment is for roomType, e.g., /location/Chennai/SDB1/trainingroom */}
        <Route path="/location/:locationName/:buildingName/:roomType" element={<SpecificRoom />} />

        {/* Individual Room Detail View */}
        {/* Displays detailed information for a single, specific room */}
        {/* This path is highly specific: /location/Chennai/SDB1/trainingroom/T001/view */}
        <Route
          path="/location/:locationName/:buildingName/:roomType/:roomNumber/view"
          element={<RoomViewPage />}
        />

        {/* Room Management Actions */}
        <Route path="/location/:locationName/:buildingName/add-room" element={<AddRoom />} />
        {/* Delete room is usually for specific types, so it should follow roomType path */}
        <Route path="/location/:locationName/:buildingName/:roomType/delete-room" element={<DeleteRoom />} />
        <Route path="/location/:locationName/:buildingName/allocate" element={<AllocateRoomPage/>}/>


        {/* Global/Other Functionality */}
        <Route path="/allocate-strategy" element={<AllocateStrategyPage />} />
        <Route path="/upload-excel" element={<ExcelUploadPage />} />
        <Route 
  path="/location/:locationName/:buildingName/:roomType/:roomNumber/view" 
  element={<RoomViewPage />} 
/>
      </Routes>
    </Router>
  );
}

export default App;