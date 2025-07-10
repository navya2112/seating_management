
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import roomImage from '../assets/room.jpg';

// const SpecificRoom = () => {
//   const { locationName, buildingName, roomType } = useParams();
//   const navigate = useNavigate();

//   const [roomsOfType, setRoomsOfType] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Map URL room types to formatted display types
//   const roomTypeMap = {
//     'trainingroom': 'Training Room',
//     'modifiedodc': 'Modified ODC',
//     'odc(openodc)': 'ODC (open ODC)',
//     'conferenceroom':'Conference Room',
//     'seminarhall':'Seminar Hall',
//     'meetingroom':'Meeting Room'
//   };

//   const displayRoomTypeTitle = roomTypeMap[roomType.toLowerCase()] || roomType;

//   useEffect(() => {
//     const fetchSpecificRooms = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const queryParams = new URLSearchParams({
//           location: locationName,
//           building: buildingName,
//           roomType: displayRoomTypeTitle
//         });

//         const response = await fetch(`http://localhost:8084/api/rooms/by-room-type?${queryParams}`);
//         if (!response.ok) {
//           const text = await response.text();
//           throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
//         }

//         const data = await response.json();
//         setRoomsOfType(data);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.message || 'Failed to fetch room data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSpecificRooms();
//   }, [locationName, buildingName, roomType]);

//   return (
//     <div className="container mt-4">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <button onClick={() => navigate(-1)} className="btn btn-sm btn-link">&larr; Back</button>
//         <div>
//           <button className="btn btn-outline-primary me-2" onClick={() => navigate(`/location/${locationName}/${buildingName}/add-room`)}>
//             Add Room
//           </button>
//           <button className="btn btn-outline-danger me-2" onClick={() => navigate(`/location/${locationName}/${buildingName}/${roomType}/delete-room`)}>
//             Delete Room
//           </button>

//         </div>
//       </div>

//       <h4 className="mb-4 text-capitalize">{locationName} / {buildingName} – {displayRoomTypeTitle}</h4>

//       {loading && (
//         <div className="text-center">
//           <div className="spinner-border text-primary me-2" />
//           Loading rooms...
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-danger">
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       <div className="row">
//         {!loading && roomsOfType.length === 0 && (
//           <p className="text-muted">No rooms available for this category.</p>
//         )}

//         {roomsOfType.map((room, idx) => {
//           const seatCount = room?.totalSeats || room?.seatCount || 0;
//           // const occupied = Math.max(seatCount - vacant, 0);//0
//           const occupied = room?.occupiedSeats ?? 0;//0
//           const vacant = seatCount-occupied ?? 0;
//           const occupancy = seatCount > 0 ? ((occupied / seatCount) * 100).toFixed(0) : 0;

//           console.log(seatCount)// 25
//           console.log(vacant)//0
//           console.log(occupied)//25
//           console.log(occupancy)//100

//           return (
//             <div key={`${room?.id?.roomNumber}-${idx}`} className="col-sm-6 col-md-4 col-lg-3 mb-4">
//               <Link
//                 to={`/location/${encodeURIComponent(locationName)}/${encodeURIComponent(buildingName)}/${encodeURIComponent(roomTypeMap[roomType])}/${room?.roomId?.roomNumber}/view`}
//                 state={{
//                   facility: room?.roomId?.facility,
//                   floorNumber: room?.roomId?.floorNumber,
//                   wing: room?.roomId?.wing
//                 }}
//                 className="text-decoration-none"
//               >
//                 <div className="card shadow-sm h-100">
//                   <img
//                     src={roomImage}
//                     alt="Room"
//                     className="card-img-top"
//                     style={{ height: 120, objectFit: 'cover' }}
//                   />
//                   <div className="card-body" style={{ fontSize: '0.85rem' }}>
//                     <h6 className="card-title">Room {room?.roomId?.roomNumber}</h6>
//                     <p className="card-text mb-1">Occupied: {occupied}</p>
//                     <p className="card-text mb-1">Vacant: {vacant}</p>
//                     <p className="card-text mb-1">Occupancy: {occupancy}%</p>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default SpecificRoom;
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import roomImage from '../assets/room.jpg';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const API_BASE_URL = 'http://localhost:8084';

// const SpecificRoom = () => {
//   const { locationName, buildingName, roomType } = useParams();
//   const navigate = useNavigate();

//   const [roomsOfType, setRoomsOfType] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Map URL room types to formatted display types for UI and API calls
//   const roomTypeMap = {
//     'trainingroom': 'Training Room',
//     'modifiedodc': 'Modified ODC',
//     'odc(openodc)': 'ODC (open ODC)',
//     'conferenceroom': 'Conference Room',
//     'seminarhall': 'Seminar Hall',
//     'meetingroom': 'Meeting Room',
//     'odc-customtrs':'ODC-Custom TRs',
//     'videoconferenceroom':'Video Conference Room'
//   };

//   // Get the display-friendly room type title
//   const displayRoomTypeTitle = roomTypeMap[roomType.toLowerCase()] || roomType;

//   useEffect(() => {
//     const fetchSpecificRooms = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const queryParams = new URLSearchParams({
//           location: locationName,
//           building: buildingName,
//           roomType: displayRoomTypeTitle // Use the mapped title for the API call
//         });

//         const response = await fetch(`${API_BASE_URL}/api/rooms/by-room-type?${queryParams}`);
//         if (!response.ok) {
//           const text = await response.text();
//           throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
//         }

//         const data = await response.json();
//         setRoomsOfType(data);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.message || 'Failed to fetch room data.');
//         setRoomsOfType([]); // Clear rooms on error
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSpecificRooms();
//   }, [locationName, buildingName, roomType, displayRoomTypeTitle]); // Add displayRoomTypeTitle as a dependency

//   return (
//     <div className="container mt-4">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <button onClick={() => navigate(-1)} className="btn btn-sm btn-link">
//           &larr; Back
//         </button>
//         <div>
//           <button className="btn btn-outline-primary me-2" onClick={() => navigate(`/location/${locationName}/${buildingName}/add-room`)}>
//             Add Room
//           </button>
//           <button className="btn btn-outline-danger me-2" onClick={() => navigate(`/location/${locationName}/${buildingName}/${roomType}/delete-room`)}>
//             Delete Room
//           </button>
//         </div>
//       </div>

//       <h4 className="mb-4 text-capitalize">{locationName} / {buildingName} – {displayRoomTypeTitle}</h4>

//       {loading && (
//         <div className="text-center">
//           <div className="spinner-border text-primary me-2" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           Loading rooms...
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-danger" role="alert">
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       <div className="row">
//         {!loading && !error && roomsOfType.length === 0 && (
//           <p className="text-muted">No rooms available for this category.</p>
//         )}

//         {!loading && !error && roomsOfType.map((room, idx) => {
//           const seatCount = room?.totalSeats || room?.seatCount || 0;
//           const occupied = room?.occupiedSeats ?? 0;
//           const vacant = Math.max(seatCount - occupied, 0); // Ensure vacant is not negative
//           const occupancy = seatCount > 0 ? ((occupied / seatCount) * 100).toFixed(0) : 0;

//           return (
//             <div key={`${room?.roomId?.roomNumber}-${idx}`} className="col-sm-6 col-md-4 col-lg-3 mb-4">
//               <Link
//                 to={`/location/${encodeURIComponent(locationName)}/${encodeURIComponent(buildingName)}/${encodeURIComponent(roomType)}/${room?.roomId?.roomNumber}/view`}
//                 state={{ // Pass additional room details via state
//                   facility: room?.roomId?.facility,
//                   floorNumber: room?.roomId?.floorNumber,
//                   wing: room?.roomId?.wing,
//                   roomType: displayRoomTypeTitle // Pass the correct room type as well
//                 }}
//                 className="text-decoration-none"
//               >
//                 <div className="card shadow-sm h-100">
//                   <img
//                     src={roomImage}
//                     alt="Room"
//                     className="card-img-top"
//                     style={{ height: 120, objectFit: 'cover' }}
//                   />
//                   <div className="card-body" style={{ fontSize: '0.85rem' }}>
//                     <h6 className="card-title">Room {room?.roomId?.roomNumber}</h6>
//                     <p className="card-text mb-1">Occupied: {occupied}</p>
//                     <p className="card-text mb-1">Vacant: {vacant}</p>
//                     <p className="card-text mb-1">Occupancy: {occupancy}%</p>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default SpecificRoom;








// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import roomImage from '../assets/room.jpg'; // Assuming you have a default room image
// import 'bootstrap/dist/css/bootstrap.min.css';

// const API_BASE_URL = 'http://localhost:8084'; // Ensure this matches your backend API URL

// const SpecificRoom = () => {
//     const { locationName, buildingName, roomType } = useParams();
//     const navigate = useNavigate();

//     const [roomsOfType, setRoomsOfType] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Map URL room types (slugified) to backend/display-friendly formatted names.
//     // This map should be consistent across all related components (RoomPage, SpecificRoom, RoomViewPage).
//     const roomTypeMap = {
//         'trainingroom': 'Training Room',
//         'modifiedodc': 'Modified ODC',
//         'odc(openodc)': 'ODC (open ODC)',
//         'conferenceroom': 'Conference Room',
//         'seminarhall': 'Seminar Hall',
//         'meetingroom': 'Meeting Room',
//         'odc-customtrs': 'ODC-Custom TRs',
//         'videoconferenceroom': 'Video Conference Room'
//     };

//     // Get the display-friendly room type title for UI and API calls
//     const displayRoomTypeTitle = roomTypeMap[roomType.toLowerCase()] || roomType;

//     // Helper function to slugify room types for URL paths
//     // It removes spaces and non-alphanumeric characters for clean URLs
//     const slugify = (text) => {
//         return text.toString().toLowerCase()
//             .replace(/\s+/g, '')        // Remove all spaces
//             .replace(/[^\w-]+/g, '')    // Remove all non-word chars except hyphens
//             .replace(/--+/g, '')        // Replace multiple hyphens with single hyphen
//             .replace(/^-+/, '')         // Trim hyphens from start
//             .replace(/-+$/, '');        // Trim hyphens from end
//     };

//     useEffect(() => {
//         const fetchSpecificRooms = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 // Ensure the roomType sent to the backend is the formatted one (e.g., 'Training Room')
//                 const queryParams = new URLSearchParams({
//                     location: locationName,
//                     building: buildingName,
//                     roomType: displayRoomTypeTitle // Use the mapped title for the API call
//                 });

//                 const response = await fetch(`${API_BASE_URL}/api/rooms/by-room-type?${queryParams}`);
//                 if (!response.ok) {
//                     const text = await response.text();
//                     throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
//                 }

//                 const data = await response.json();
//                 setRoomsOfType(data);
//             } catch (err) {
//                 console.error("Fetch error for specific rooms:", err);
//                 setError(err.message || 'Failed to fetch room data.');
//                 setRoomsOfType([]); // Clear rooms on error
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSpecificRooms();
//     }, [locationName, buildingName, roomType, displayRoomTypeTitle]); // Dependencies for useEffect

//     return (
//         <div className="container mt-4">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//                 <button onClick={() => navigate(-1)} className="btn btn-sm btn-link">
//                     &larr; Back
//                 </button>
//                 <div>
//                     {/* Assuming these routes are correctly handled elsewhere */}
//                     <button className="btn btn-outline-primary me-2" onClick={() => navigate(`/location/${locationName}/${buildingName}/add-room`)}>
//                         Add Room
//                     </button>
//                     <button className="btn btn-outline-danger me-2" onClick={() => navigate(`/location/${locationName}/${buildingName}/${roomType}/delete-room`)}>
//                         Delete Room
//                     </button>
//                 </div>
//             </div>

//             <h4 className="mb-4 text-capitalize">
//                 {locationName} / {buildingName} – {displayRoomTypeTitle}
//             </h4>

//             {loading && (
//                 <div className="text-center">
//                     <div className="spinner-border text-primary me-2" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                     Loading rooms...
//                 </div>
//             )}

//             {error && (
//                 <div className="alert alert-danger" role="alert">
//                     <strong>Error:</strong> {error}
//                 </div>
//             )}

//             <div className="row">
//                 {!loading && !error && roomsOfType.length === 0 && (
//                     <p className="text-muted">No rooms available for this category.</p>
//                 )}

//                 {!loading && !error && roomsOfType.map((room) => {
//                     const seatCount = room?.totalSeats || room?.seatCount || 0;
//                     const occupied = room?.occupiedSeats ?? 0;
//                     const vacant = Math.max(seatCount - occupied, 0); // Ensure vacant is not negative
//                     const occupancy = seatCount > 0 ? ((occupied / seatCount) * 100).toFixed(0) : 0;

//                     // Ensure roomId and its properties are available before accessing
//                     if (!room || !room.roomId) {
//                         console.warn("Room data or roomId is missing for a room:", room);
//                         return null; // Skip rendering this card if data is incomplete
//                     }

//                     return (
//                         <div key={`${room.roomId.roomNumber}-${room.roomId.floorNumber}`} className="col-sm-6 col-md-4 col-lg-3 mb-4">
//                             <Link
//                                 // MODIFIED 'to' PROP: Includes floorNumber in the URL path
//                                 to={`/room/view/${encodeURIComponent(locationName)}/${encodeURIComponent(buildingName)}/${slugify(room.roomType || roomType)}/${room.roomId.floorNumber}/${room.roomId.roomNumber}`}
//                                 className="text-decoration-none"
//                             >
//                                 <div className="card shadow-sm h-100">
//                                     <img
//                                         src={roomImage}
//                                         alt={`Room ${room.roomId.roomNumber}`}
//                                         className="card-img-top"
//                                         style={{ height: 120, objectFit: 'cover' }}
//                                     />
//                                     <div className="card-body" style={{ fontSize: '0.85rem' }}>
//                                         <h6 className="card-title">Room {room.roomId.roomNumber}</h6>
//                                         {/* Display floor number directly on the card for clarity */}
//                                         <p className="card-text mb-1">Floor: {room.roomId.floorNumber}</p>
//                                         <p className="card-text mb-1">Occupied: {occupied}</p>
//                                         <p className="card-text mb-1">Vacant: {vacant}</p>
//                                         <p className="card-text mb-1">Occupancy: {occupancy}%</p>
//                                     </div>
//                                 </div>
//                             </Link>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// export default SpecificRoom;






import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// import roomImage from '../assets/room.jpg'; // Removed as images are no longer used in cards
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'http://localhost:8084'; // Ensure this matches your backend API URL

const SpecificRoom = () => {
    const { locationName, buildingName, roomType } = useParams();
    const navigate = useNavigate();

    const [allRoomsOfType, setAllRoomsOfType] = useState([]); // Stores original fetched data
    const [filteredRooms, setFilteredRooms] = useState([]); // Stores filtered data for display
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // New state for search terms
    const [roomNumberSearchTerm, setRoomNumberSearchTerm] = useState('');
    const [floorNumberSearchTerm, setFloorNumberSearchTerm] = useState('');

    // Map URL room types (slugified) to backend/display-friendly formatted names.
    // This map should be consistent across all related components (RoomPage, SpecificRoom, RoomViewPage).
    const roomTypeMap = {
        'trainingroom': 'Training Room',
        'modifiedodc': 'Modified ODC',
        'odc(openodc)': 'ODC (open ODC)',
        'conferenceroom': 'Conference Room',
        'seminarhall': 'Seminar Hall',
        'meetingroom': 'Meeting Room',
        'odc-customtrs': 'ODC-Custom TRs',
        'videoconferenceroom': 'Video Conference Room'
    };

    // Get the display-friendly room type title for UI and API calls
    const displayRoomTypeTitle = roomTypeMap[roomType.toLowerCase()] || roomType;

    // Helper function to slugify room types for URL paths
    // It removes spaces and non-alphanumeric characters for clean URLs
    const slugify = (text) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '')        // Remove all spaces
            .replace(/[^\w-]+/g, '')    // Remove all non-word chars except hyphens
            .replace(/--+/g, '')        // Replace multiple hyphens with single hyphen
            .replace(/^-+/, '')         // Trim hyphens from start
            .replace(/-+$/, '');        // Trim hyphens from end
    };

    // Effect to fetch initial room data
    useEffect(() => {
        const fetchSpecificRooms = async () => {
            setLoading(true);
            setError(null);
            try {
                const queryParams = new URLSearchParams({
                    location: locationName,
                    building: buildingName,
                    roomType: displayRoomTypeTitle
                });

                const response = await fetch(`${API_BASE_URL}/api/rooms/by-room-type?${queryParams}`);
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
                }

                const data = await response.json();
                setAllRoomsOfType(data); // Store original data
                setFilteredRooms(data); // Initialize filtered data with all data
            } catch (err) {
                console.error("Fetch error for specific rooms:", err);
                setError(err.message || 'Failed to fetch room data.');
                setAllRoomsOfType([]);
                setFilteredRooms([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSpecificRooms();
    }, [locationName, buildingName, roomType, displayRoomTypeTitle]);

    // Effect to apply filters whenever search terms or original data changes
    useEffect(() => {
        let currentRooms = [...allRoomsOfType]; // Start with a copy of all rooms

        // Filter by room number
        if (roomNumberSearchTerm) {
            currentRooms = currentRooms.filter(room =>
                room.roomId.roomNumber.toString().includes(roomNumberSearchTerm)
            );
        }

        // Filter by floor number
        if (floorNumberSearchTerm) {
            currentRooms = currentRooms.filter(room =>
                room.roomId.floorNumber.toString().includes(floorNumberSearchTerm)
            );
        }

        setFilteredRooms(currentRooms);
    }, [allRoomsOfType, roomNumberSearchTerm, floorNumberSearchTerm]);


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

            {/* Header with Back button, Search Inputs, and Add/Delete Room buttons */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <button onClick={() => navigate(-1)} className="btn btn-outline-secondary">
                    {/* &larr;  */}
                    Back to type of rooms
                </button>

                <div className="d-flex flex-wrap align-items-center gap-2 flex-grow-1 justify-content-end">
                    <input
                        type="text" // Changed to text for flexible input (e.g., "G1", "101A")
                        className="form-control"
                        style={{ maxWidth: '120px' }}
                        placeholder="Room No."
                        value={roomNumberSearchTerm}
                        onChange={(e) => setRoomNumberSearchTerm(e.target.value)}
                    />
                    <input
                        type="text" // Changed to text for flexible input (e.g., "G", "1A")
                        className="form-control"
                        style={{ maxWidth: '120px' }}
                        placeholder="Floor No."
                        value={floorNumberSearchTerm}
                        onChange={(e) => setFloorNumberSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-outline-primary" onClick={() => navigate(`/location/${locationName}/${buildingName}/add-room`)}>
                        Add Room
                    </button>
                    <button className="btn btn-outline-danger" onClick={() => navigate(`/location/${locationName}/${buildingName}/${roomType}/delete-room`)}>
                        Deactivate Room
                    </button>
                </div>
            </div>

            {/* Main Page Heading */}
            <h4 className="mb-4 text-capitalize">
                {locationName} / {buildingName} – {displayRoomTypeTitle}
            </h4>

            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading rooms for {displayRoomTypeTitle}...</p>
                </div>
            )}

            {error && (
                <div className="alert alert-danger mt-3" role="alert">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Room Cards (consistent layout and styling with previous pages) */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {!loading && !error && filteredRooms.length === 0 && (
                    <div className="col-12">
                        <div className="alert alert-info text-center" role="alert">
                            No rooms available for this category or matching your search criteria.
                        </div>
                    </div>
                )}

                {!loading && !error && filteredRooms.map((room) => {
                    const seatCount = room?.totalSeats || room?.seatCount || 0;
                    const occupied = room?.occupiedSeats ?? 0;
                    const vacant = Math.max(seatCount - occupied, 0); // Ensure vacant is not negative
                    const occupancy = seatCount > 0 ? ((occupied / seatCount) * 100).toFixed(0) : 0;

                    // Ensure roomId and its properties are available before accessing
                    if (!room || !room.roomId) {
                        console.warn("Room data or roomId is missing for a room:", room);
                        return null; // Skip rendering this card if data is incomplete
                    }

                    return (
                        <div key={`${room.roomId.roomNumber}-${room.roomId.floorNumber}`} className="col">
                            <Link
                                // MODIFIED 'to' PROP: Includes floorNumber in the URL path
                                to={`/room/view/${encodeURIComponent(locationName)}/${encodeURIComponent(buildingName)}/${slugify(room.roomType || roomType)}/${room.roomId.floorNumber}/${room.roomId.roomNumber}`}
                                className="card h-100 text-dark text-decoration-none shadow lift-on-hover bg-white"
                                style={{ cursor: 'pointer', borderRadius: '10px', overflow: 'hidden' }}
                            >
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <h5 className="card-title text-center fw-bold text-dark mb-3">
                                        Room {room.roomId.roomNumber}
                                    </h5>
                                    <ul className="list-group list-group-flush border-top border-bottom mb-3">
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Floor
                                            <span className="badge bg-info rounded-pill">{room.roomId.floorNumber}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Total Capacity
                                            <span className="badge bg-secondary rounded-pill">{seatCount}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Occupied
                                            <span className="badge bg-warning rounded-pill">{occupied}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Vacant
                                            <span className="badge bg-success rounded-pill">{vacant}</span>
                                        </li>
                                    </ul>
                                    <div className="text-center">
                                        <p className="mb-0 fw-bold text-secondary">
                                            Occupancy: <span className="text-dark">
                                                {occupancy}%
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SpecificRoom;
