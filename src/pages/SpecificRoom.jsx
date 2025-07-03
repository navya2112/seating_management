
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
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import roomImage from '../assets/room.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'http://localhost:8084';

const SpecificRoom = () => {
  const { locationName, buildingName, roomType } = useParams();
  const navigate = useNavigate();

  const [roomsOfType, setRoomsOfType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map URL room types to formatted display types for UI and API calls
  const roomTypeMap = {
    'trainingroom': 'Training Room',
    'modifiedodc': 'Modified ODC',
    'odc(openodc)': 'ODC (open ODC)',
    'conferenceroom': 'Conference Room',
    'seminarhall': 'Seminar Hall',
    'meetingroom': 'Meeting Room'
  };

  // Get the display-friendly room type title
  const displayRoomTypeTitle = roomTypeMap[roomType.toLowerCase()] || roomType;

  useEffect(() => {
    const fetchSpecificRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({
          location: locationName,
          building: buildingName,
          roomType: displayRoomTypeTitle // Use the mapped title for the API call
        });

        const response = await fetch(`${API_BASE_URL}/api/rooms/by-room-type?${queryParams}`);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
        }

        const data = await response.json();
        setRoomsOfType(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || 'Failed to fetch room data.');
        setRoomsOfType([]); // Clear rooms on error
      } finally {
        setLoading(false);
      }
    };

    fetchSpecificRooms();
  }, [locationName, buildingName, roomType, displayRoomTypeTitle]); // Add displayRoomTypeTitle as a dependency

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button onClick={() => navigate(-1)} className="btn btn-sm btn-link">
          &larr; Back
        </button>
        <div>
          <button className="btn btn-outline-primary me-2" onClick={() => navigate(`/location/${locationName}/${buildingName}/add-room`)}>
            Add Room
          </button>
          <button className="btn btn-outline-danger me-2" onClick={() => navigate(`/location/${locationName}/${buildingName}/${roomType}/delete-room`)}>
            Delete Room
          </button>
        </div>
      </div>

      <h4 className="mb-4 text-capitalize">{locationName} / {buildingName} – {displayRoomTypeTitle}</h4>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Loading rooms...
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="row">
        {!loading && !error && roomsOfType.length === 0 && (
          <p className="text-muted">No rooms available for this category.</p>
        )}

        {!loading && !error && roomsOfType.map((room, idx) => {
          const seatCount = room?.totalSeats || room?.seatCount || 0;
          const occupied = room?.occupiedSeats ?? 0;
          const vacant = Math.max(seatCount - occupied, 0); // Ensure vacant is not negative
          const occupancy = seatCount > 0 ? ((occupied / seatCount) * 100).toFixed(0) : 0;

          return (
            <div key={`${room?.roomId?.roomNumber}-${idx}`} className="col-sm-6 col-md-4 col-lg-3 mb-4">
              <Link
                to={`/location/${encodeURIComponent(locationName)}/${encodeURIComponent(buildingName)}/${encodeURIComponent(roomType)}/${room?.roomId?.roomNumber}/view`}
                state={{ // Pass additional room details via state
                  facility: room?.roomId?.facility,
                  floorNumber: room?.roomId?.floorNumber,
                  wing: room?.roomId?.wing,
                  roomType: displayRoomTypeTitle // Pass the correct room type as well
                }}
                className="text-decoration-none"
              >
                <div className="card shadow-sm h-100">
                  <img
                    src={roomImage}
                    alt="Room"
                    className="card-img-top"
                    style={{ height: 120, objectFit: 'cover' }}
                  />
                  <div className="card-body" style={{ fontSize: '0.85rem' }}>
                    <h6 className="card-title">Room {room?.roomId?.roomNumber}</h6>
                    <p className="card-text mb-1">Occupied: {occupied}</p>
                    <p className="card-text mb-1">Vacant: {vacant}</p>
                    <p className="card-text mb-1">Occupancy: {occupancy}%</p>
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