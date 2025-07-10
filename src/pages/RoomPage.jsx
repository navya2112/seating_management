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










// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import roomImage from '../assets/room.jpg';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const API_BASE_URL = 'http://localhost:8084';

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

//         const url = `${API_BASE_URL}/api/rooms/category-summary?location=${encodeURIComponent(locationName)}&building=${encodeURIComponent(buildingName)}`;
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
//         setRoomCategories([]); // Clear categories on error
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
//         <h6 className="ms-3 mb-0">Back to Buildings</h6>
//       </div>

//       <h4 className="mb-4 text-capitalize">{locationName} – {buildingName}</h4>

//       {/* Error State */}
//       {error && (
//         <div className="alert alert-danger" role="alert">
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center">
//           <div className="spinner-border text-primary me-2" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           Loading room categories...
//         </div>
//       )}

//       {/* Room Type Cards */}
//       {!loading && !error && roomCategories.length === 0 && (
//         <p className="text-muted">No room data found for this building.</p>
//       )}

//       <div className="row">
//         {!loading && !error && roomCategories.map((category, idx) => (
//           <div key={`${category.roomType}-${idx}`} className="col-md-4 col-lg-3 mb-4">
//             <Link
//               // Constructing URL for SpecificRoom
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



import React, { useEffect, useState } from 'react'; // Removed useCallback
import { Link, useParams } from 'react-router-dom'; // Added Link, Removed useNavigate
import roomImage from '../assets/room.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'http://localhost:8084';

const RoomPage = () => {
    const { locationName, buildingName } = useParams();
    // const navigate = useNavigate(); // Removed as it's no longer used

    const [roomCategories, setRoomCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Removed useCallback wrapper as it was not necessary for this usage
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
            {/* Inline Style Block for lift-on-hover */}
            <style jsx>{`
                .lift-on-hover {
                    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                }

                .lift-on-hover:hover {
                    transform: translateY(-5px); /* Lifts the card slightly */
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important; /* Larger shadow */
                }
            `}</style>

            {/* Header with Title (similar to LocationPage and BuildingPage) */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h3 className="text-dark fw-bold mb-0 text-capitalize">
                    <i className="bi bi-door-open me-2"></i>{buildingName} Rooms
                </h3>
                {/* Removed "Back to Buildings" button as requested */}
            </div>

            {/* Error State */}
            {error && (
                <div className="alert alert-danger mt-3" role="alert">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading room categories for {buildingName}...</p>
                </div>
            )}

            {/* Room Type Cards */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {!loading && !error && roomCategories.length === 0 && (
                    <div className="col-12">
                        <div className="alert alert-info text-center" role="alert">
                            No room data found for this building.
                        </div>
                    </div>
                )}

                {!loading && !error && roomCategories.map((category, idx) => (
                    <div key={`${category.roomType}-${idx}`} className="col">
                        <Link
                            // Constructing URL for SpecificRoom
                            to={`/location/${encodeURIComponent(locationName)}/${encodeURIComponent(buildingName)}/${category.roomType.toLowerCase().replace(/\s/g, '')}`}
                            className="card h-100 text-dark text-decoration-none shadow lift-on-hover bg-white" // Added shadow, lift-on-hover, bg-white
                            style={{ cursor: 'pointer', borderRadius: '10px', overflow: 'hidden' }}
                        >
                            <img
                                src={roomImage}
                                alt={category.roomType}
                                className="card-img-top"
                                style={{ height: '180px', objectFit: 'cover' }} // Increased height for consistency
                            />
                            <div className="card-body d-flex flex-column justify-content-between">
                                <h5 className="card-title text-center fw-bold text-dark mb-3">
                                    {category.roomType}
                                </h5>
                                <ul className="list-group list-group-flush border-top border-bottom mb-3">
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Total Rooms
                                        <span className="badge bg-info rounded-pill">{category.totalRoomsCount}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Capacity
                                        <span className="badge bg-secondary rounded-pill">{category.totalCapacitySeats}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Occupied
                                        <span className="badge bg-warning rounded-pill">{category.totalOccupiedSeats}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Vacant
                                        <span className="badge bg-success rounded-pill">{category.totalVacantSeats}</span>
                                    </li>
                                </ul>
                                <div className="text-center">
                                    <p className="mb-0 fw-bold text-secondary">
                                        Occupancy: <span className="text-dark">
                                            {category.occupancyPercentage.toFixed(0)}%
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomPage;
