import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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


function App() {
  return (
    <Router>
      <Navbar /> {/* This should be outside Routes */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/location" element={<LocationPage />} />
        <Route path="/add-location" element={<AddLocationPage />} />
        <Route path="/delete-location" element={<DeleteLocationPage />} />
        <Route path="/location/:locationName" element={<BuildingPage />} />
        <Route path="/add-building" element={<AddBuildingPage />} />
        <Route path="/location/:locationName/delete-building" element={<DeleteBuilding />} />
        <Route path="/location/:locationName/:buildingName" element={<RoomPage/>} />
        <Route path="/location/:locationName/:buildingName/:roomType" element={<SpecificRoom />} />
        <Route path="/location/:locationName/:buildingName/:roomType/:roomNumber/view" element={<RoomViewPage/>} />
        <Route path="/location/:locationName/:buildingName/add-room" element={<AddRoom />} />
        <Route path="/location/:locationName/:buildingName/allocate" element={<AllocateRoomPage/>}/>
        <Route path="/location/:locationName/:buildingName/:roomType/delete-room" element={<DeleteRoom />}/>




      </Routes>
    </Router>
  );
}

export default App;
