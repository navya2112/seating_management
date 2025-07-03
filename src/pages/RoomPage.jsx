// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import roomImage from '../assets/room.jpg';

// const RoomPage = () => {
//   const { locationName, buildingName } = useParams();
//   const navigate = useNavigate();

//   const [roomCategories, setRoomCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCategorySummary = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const url = `http://localhost:8084/api/rooms/category-summary?location=${encodeURIComponent(locationName)}&building=${encodeURIComponent(buildingName)}`;
//         const res = await fetch(url);

//         if (!res.ok) {
//           const msg = await res.text();
//           throw new Error(`HTTP ${res.status}: ${msg || res.statusText}`);
//         }

//         const rawData = await res.json();
//         const parsed = Object.entries(rawData).map(([type, rooms]) => {
//           const totalRoomsCount = rooms.length;
//           const totalCapacitySeats = rooms.reduce((sum, r) => sum + r.totalSeats, 0);
//           const totalOccupiedSeats = rooms.reduce((sum, r) => sum + r.occupiedSeats, 0);
//           const totalVacantSeats = totalCapacitySeats - totalOccupiedSeats;
//           const occupancyPercentage = totalCapacitySeats > 0
//             ? (totalOccupiedSeats / totalCapacitySeats) * 100
//             : 0;

//           return {
//             roomType: type,
//             totalRoomsCount,
//             totalCapacitySeats,
//             totalOccupiedSeats,
//             totalVacantSeats,
//             occupancyPercentage
//           };
//         });

//         setRoomCategories(parsed);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.message || 'Unable to load room data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategorySummary();
//   }, [locationName, buildingName]);

//   return (
//     <div className="container mt-4">
//       {/* Navigation */}
//       <div className="d-flex align-items-center mb-3">
//         <span style={{ cursor: 'pointer', fontSize: '1.5rem' }} onClick={() => navigate(`/location/${locationName}`)}>
//           ←
//         </span>
//         <h6 className="ms-3 mb-0">Back</h6>
//       </div>

//       <h4 className="mb-4 text-capitalize">{locationName} – {buildingName}</h4>

//       {/* Error State */}
//       {error && (
//         <div className="alert alert-danger">
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center">
//           <div className="spinner-border text-primary me-2" />
//           Loading room categories...
//         </div>
//       )}

//       {/* Room Type Cards */}
//       {!loading && roomCategories.length === 0 && (
//         <p className="text-muted">No room data found for this building.</p>
//       )}

//       <div className="row">
//         {roomCategories.map((category, idx) => (
//           <div key={`${category.roomType}-${idx}`} className="col-md-4 col-lg-3 mb-4">
//             <Link
//               to={`/location/${encodeURIComponent(locationName)}/${encodeURIComponent(buildingName)}/${category.roomType.toLowerCase().replace(/\s/g, '')}`}
//               className="card h-100 text-dark text-decoration-none shadow-sm"
//             >
//               <img
//                 src={roomImage}
//                 alt={category.roomType}
//                 className="card-img-top"
//                 style={{ height: '120px', objectFit: 'cover' }}
//               />
//               <div className="card-body" style={{ fontSize: '0.85rem' }}>
//                 <h6 className="card-title">{category.roomType}</h6>
//                 <p className="mb-1">🛏️ Total rooms: {category.totalRoomsCount}</p>
//                 <p className="mb-1">🎫 Capacity: {category.totalCapacitySeats}</p>
//                 <p className="mb-1">📍 Occupied: {category.totalOccupiedSeats}</p>
//                 <p className="mb-1">🟢 Vacant: {category.totalVacantSeats}</p>
//                 <p className="mb-1">📊 Occupancy: {category.occupancyPercentage.toFixed(0)}%</p>
//               </div>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RoomPage;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import roomImage from '../assets/room.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'http://localhost:8084';

const RoomPage = () => {
  const { locationName, buildingName } = useParams();
  const navigate = useNavigate();

  const [roomCategories, setRoomCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorySummary = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `${API_BASE_URL}/api/rooms/category-summary?location=${encodeURIComponent(locationName)}&building=${encodeURIComponent(buildingName)}`;
        const res = await fetch(url);

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(`HTTP ${res.status}: ${msg || res.statusText}`);
        }

        const rawData = await res.json();
        const parsed = Object.entries(rawData).map(([type, rooms]) => {
          const totalRoomsCount = rooms.length;
          const totalCapacitySeats = rooms.reduce((sum, r) => sum + r.totalSeats, 0);
          const totalOccupiedSeats = rooms.reduce((sum, r) => sum + r.occupiedSeats, 0);
          const totalVacantSeats = totalCapacitySeats - totalOccupiedSeats;
          const occupancyPercentage = totalCapacitySeats > 0
            ? (totalOccupiedSeats / totalCapacitySeats) * 100
            : 0;

          return {
            roomType: type,
            totalRoomsCount,
            totalCapacitySeats,
            totalOccupiedSeats,
            totalVacantSeats,
            occupancyPercentage
          };
        });

        setRoomCategories(parsed);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || 'Unable to load room data.');
        setRoomCategories([]); // Clear categories on error
      } finally {
        setLoading(false);
      }
    };

    fetchCategorySummary();
  }, [locationName, buildingName]);

  return (
    <div className="container mt-4">
      {/* Navigation */}
      <div className="d-flex align-items-center mb-3">
        <span style={{ cursor: 'pointer', fontSize: '1.5rem' }} onClick={() => navigate(`/location/${locationName}`)}>
          ←
        </span>
        <h6 className="ms-3 mb-0">Back to Buildings</h6>
      </div>

      <h4 className="mb-4 text-capitalize">{locationName} – {buildingName}</h4>

      {/* Error State */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Loading room categories...
        </div>
      )}

      {/* Room Type Cards */}
      {!loading && !error && roomCategories.length === 0 && (
        <p className="text-muted">No room data found for this building.</p>
      )}

      <div className="row">
        {!loading && !error && roomCategories.map((category, idx) => (
          <div key={`${category.roomType}-${idx}`} className="col-md-4 col-lg-3 mb-4">
            <Link
              // Constructing URL for SpecificRoom
              to={`/location/${encodeURIComponent(locationName)}/${encodeURIComponent(buildingName)}/${category.roomType.toLowerCase().replace(/\s/g, '')}`}
              className="card h-100 text-dark text-decoration-none shadow-sm"
            >
              <img
                src={roomImage}
                alt={category.roomType}
                className="card-img-top"
                style={{ height: '120px', objectFit: 'cover' }}
              />
              <div className="card-body" style={{ fontSize: '0.85rem' }}>
                <h6 className="card-title">{category.roomType}</h6>
                <p className="mb-1">🛏️ Total rooms: {category.totalRoomsCount}</p>
                <p className="mb-1">🎫 Capacity: {category.totalCapacitySeats}</p>
                <p className="mb-1">📍 Occupied: {category.totalOccupiedSeats}</p>
                <p className="mb-1">🟢 Vacant: {category.totalVacantSeats}</p>
                <p className="mb-1">📊 Occupancy: {category.occupancyPercentage.toFixed(0)}%</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomPage;