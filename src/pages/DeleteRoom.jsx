
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import roomImage from '../assets/room.jpg'; // Ensure this path is correct

const DeleteRoom = () => {
  const navigate = useNavigate();
  // These come from the URL params. We'll assume 'facility' and 'wing'
  // might not be present in the URL for this specific page, but we need
  // them for the RoomId object that the backend expects.
  // We'll use placeholder values if they're not available from params.
  const { locationName, buildingName, roomType } = useParams();

  // State to store rooms with full details (combining RoomWrapper and Room info)
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch rooms from the backend, then get full details for each
  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const encodedLocation = encodeURIComponent(locationName);
      const encodedBuilding = encodeURIComponent(buildingName);
      const encodedRoomType = encodeURIComponent(roomType);
      
      const arr={
        'trainingroom': 'Training Room',
        'modifiedodc': 'Modified ODC',
        'odc(openodc)': 'ODC (open ODC)',
        'conferenceroom':'Conference Room',
        'seminarhall':'Seminar Hall',
        'meetingroom':'Meeting Room'
      }
      // Step 1: Fetch initial RoomWrappers by location, building, and roomType
      const initialRoomsUrl = `http://localhost:8084/api/rooms/by-room-type?location=${encodedLocation}&building=${encodedBuilding}&roomType=${arr[encodedRoomType]}`;
      console.log("Fetching initial rooms from:", initialRoomsUrl);

      const initialResponse = await fetch(initialRoomsUrl);

      if (!initialResponse.ok) {
        if (initialResponse.status === 204) { // No Content
          setRooms([]);
          console.warn("No rooms found for this criteria.");
          setLoading(false);
          return;
        }
        const errorText = await initialResponse.text();
        throw new Error(errorText || `Failed to fetch initial rooms: ${initialResponse.status}`);
      }

      const roomWrappers = await initialResponse.json();
      console.log("Fetched RoomWrappers:", roomWrappers);

      if (!Array.isArray(roomWrappers) || roomWrappers.length === 0) {
        setRooms([]);
        setLoading(false);
        return;
      }

      // Step 2: For each RoomWrapper, fetch its full Room details (to get status and detailed roomType)
      // We'll use a POST request for the /find endpoint if GET with body is problematic.
      // If your backend *actually* supports GET with @RequestBody, then your original fetch method for /find might work.
      // However, it's safer to assume it might behave unexpectedly or that a POST is intended if a body is needed for "find".
      // Let's stick to the current GET with body for now as you requested no backend changes,
      // but be aware this is the most likely point of failure or inconsistent behavior.
      const detailedRoomsPromises = roomWrappers.map(async (rw) => {
        if (!rw.roomId) {
          console.warn("RoomWrapper missing roomId:", rw);
          return null; // Skip if roomId is missing
        }

        // Construct the RoomId object exactly as the backend expects,
        // providing default empty strings for 'facility' and 'wing' if they are not in rw.roomId
        // This is crucial because your RoomId requires all these fields.
        const roomIdForFind = {
          location: rw.roomId.location || locationName, // Use from rw or from URL params
          facility: rw.roomId.facility || '', // Assuming 'facility' might not be in RoomWrapper, provide default
          building: rw.roomId.building || buildingName, // Use from rw or from URL params
          floorNumber: rw.roomId.floorNumber,
          wing: rw.roomId.wing || '', // Assuming 'wing' might not be in RoomWrapper, provide default
          roomNumber: rw.roomId.roomNumber,
        };
        console.log(roomIdForFind)
        const findRoomUrl = 'http://localhost:8084/api/rooms/find';
        try {
          // Keep GET with body as per your original backend definition, but be cautious.
          const detailResponse = await fetch(findRoomUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // This is the part that is unconventional for GET, but is what your backend expects.
            body: JSON.stringify(roomIdForFind),
          });

          if (!detailResponse.ok) {
            const errorDetailText = await detailResponse.text();
            console.error(`Failed to fetch details for room ${roomIdForFind.roomNumber}:`, errorDetailText);
            // Mark this room with an error status
            return { ...rw, roomType: 'N/A', status: 'ERROR', fetchError: true };
          }

          const fullRoom = await detailResponse.json(); // This will be the 'Room' object
          // Combine info: RoomWrapper's seat counts + Room's type and status
          return {
            ...rw, // Keep RoomWrapper data (roomId, totalSeats, occupiedSeats)
            roomType: fullRoom.roomType, // Get roomType from full Room object
            status: fullRoom.status,     // Get status from full Room object
            fullRoomDetails: fullRoom    // Optionally store full details if needed later
          };
        } catch (detailErr) {
          console.error(`Error fetching details for room ${roomIdForFind.roomNumber}:`, detailErr);
          return { ...rw, roomType: 'N/A', status: 'ERROR', fetchError: true };
        }
      });

      // Wait for all detailed room fetches to complete
      const detailedRooms = (await Promise.all(detailedRoomsPromises)).filter(room => room !== null);
      console.log("Fetched Detailed Rooms:", detailedRooms);
      setRooms(detailedRooms);

    } catch (err) {
      console.error("Overall error fetching rooms:", err);
      setError(`Failed to load rooms: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch rooms when the component mounts or URL parameters change
  useEffect(() => {
    if (locationName && buildingName && roomType) {
      fetchRooms();
    } else {
      setError("Missing location, building, or room type in URL.");
      setLoading(false);
    }
  }, [locationName, buildingName, roomType]); // Dependency array

  // Filter rooms based on search term (roomNumber part of roomId)
  const filteredRooms = rooms.filter((room) =>
    room.roomId && room.roomId.roomNumber && // Ensure roomId and roomNumber exist
    room.roomId.roomNumber.toString().includes(searchTerm)
  );

  // Handle deactivating a room
  const handleDeactivate = async () => {
    if (!confirmDelete || !confirmDelete.roomId) {
      alert("No room selected for deactivation or invalid room data.");
      setConfirmDelete(null);
      return;
    }

    console.log("Attempting to deactivate with RoomId:", confirmDelete.roomId);
    try {
      const response = await fetch('http://localhost:8084/api/rooms/deactivate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(confirmDelete.roomId), // Send the RoomId object
      });

      if (response.ok) {
        alert(`Room ${confirmDelete.roomId.roomNumber} deactivated successfully!`);
        // Re-fetch the rooms list to reflect the change
        fetchRooms(); // This will re-fetch all data including updated statuses
      } else {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to deactivate room: ${response.status}`);
      }
    } catch (err) {
      console.error("Error deactivating room:", err);
      alert(`Error deactivating room: ${err.message}`);
    } finally {
      setConfirmDelete(null); // Close the confirmation modal
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading rooms...</span>
        </div>
        <p className="mt-2">Loading rooms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4 alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Back Navigation */}
      <div className="mb-3">
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>
          &larr; Back
        </span>
      </div>

      <h4 className="mb-4">
        {buildingName} - {roomType || 'Rooms'} | Deactivate Room
      </h4>

      {/* Search Bar */}
      <div className="input-group mb-4" style={{ maxWidth: '400px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search with room number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="input-group-text">
          <i className="bi bi-search" />
        </span>
      </div>

      {/* Room Cards */}
      {filteredRooms.length > 0 ? (
        <div className="row">
          {filteredRooms.map((room) => {
            // Ensure roomData is safely accessed
            const roomData = room.roomId || {};
            const totalSeats = room.totalSeats;
            const occupiedSeats = room.occupiedSeats;
            const vacant = totalSeats - occupiedSeats;
            const occupancy = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;
            const currentStatus = room.status || 'UNKNOWN'; // Now 'status' comes from the second fetch
            const currentRoomType = room.roomType || 'N/A'; // Now 'roomType' comes from the second fetch

            return (
              <div key={`${roomData.roomNumber}-${roomData.floorNumber}`} className="col-md-4 mb-4">
                <div className="card shadow-sm h-100">
                  <img
                    src={roomImage}
                    className="card-img-top"
                    alt={`Room ${roomData.roomNumber}`}
                    style={{ height: '120px', objectFit: 'cover' }}
                  />
                  <div className="card-body" style={{ fontSize: '0.9rem' }}>
                    <h6>
                      Floor {roomData.floorNumber} - Room {roomData.roomNumber}
                    </h6>
                    <p className="mb-1">Type: {currentRoomType}</p> {/* Display fetched roomType */}
                    <p className="mb-1">Total Seats: {totalSeats}</p>
                    <p className="mb-1">Seats Occupied: {occupiedSeats}</p>
                    <p className="mb-1">Seats Vacant: {vacant}</p>
                    <p className="mb-1">Occupancy: {occupancy}%</p>
                    <p className="mb-2">Status: <span className={`badge ${currentStatus === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>{currentStatus}</span></p>

                    <button
                      className="btn btn-sm btn-outline-danger mt-2"
                      onClick={() => setConfirmDelete(room)} // Pass the whole room object for confirmation
                      disabled={currentStatus !== 'ACTIVE' || room.fetchError} // Disable if inactive or fetch failed
                    >
                      <i className="bi bi-trash" /> {currentStatus === 'ACTIVE' ? 'Deactivate' : room.fetchError ? 'Error Fetching Details' : 'Already Inactive'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted">No rooms found for this criteria.</p>
      )}

      {/* Bootstrap Modal for Confirmation */}
      {confirmDelete && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deactivation</h5>
                <button type="button" className="btn-close" onClick={() => setConfirmDelete(null)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to deactivate Room {confirmDelete.roomId?.roomNumber} on Floor {confirmDelete.roomId?.floorNumber} in {confirmDelete.roomId?.building}?</p>
                <p className="text-muted small">This action will change the room's status to INACTIVE.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDeactivate}>Deactivate</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteRoom;