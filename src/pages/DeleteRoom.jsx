import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import roomImage from '../assets/room.jpg'; // Replace with your actual image path

const initialRooms = [
  { floor: 4, roomNumber: 6, totalSeats: 50, occupied: 30 },
  { floor: 3, roomNumber: 7, totalSeats: 48, occupied: 35 },
  { floor: 5, roomNumber: 2, totalSeats: 40, occupied: 39 },
];

const DeleteRoom = () => {
  const navigate = useNavigate();
  const { locationName, buildingName, roomType } = useParams();
  const [rooms, setRooms] = useState(initialRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filteredRooms = rooms.filter((room) =>
    room.roomNumber.toString().includes(searchTerm)
  );

  const handleDelete = (roomNumber) => {
    setRooms((prev) => prev.filter((r) => r.roomNumber !== roomNumber));
    setConfirmDelete(null);
  };

  return (
    <div className="container mt-4">
      {/* Back Navigation */}
      <div className="mb-3">
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>
          &larr; Back
        </span>
      </div>

      <h4 className="mb-4">{buildingName} - {roomType} | Delete Room</h4>

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
      <div className="row">
        {filteredRooms.map((room) => {
          const vacant = room.totalSeats - room.occupied;
          const occupancy = Math.round((room.occupied / room.totalSeats) * 100);

          return (
            <div key={room.roomNumber} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <img
                  src={roomImage}
                  className="card-img-top"
                  alt={`Room ${room.roomNumber}`}
                  style={{ height: '120px', objectFit: 'cover' }}
                />
                <div className="card-body" style={{ fontSize: '0.9rem' }}>
                  <h6>Floor {room.floor} - Room {room.roomNumber}</h6>
                  <p>Total Seats: {room.totalSeats}</p>
                  <p>Seats Occupied: {room.occupied}</p>
                  <p>Seats Vacant: {vacant}</p>
                  <p>Occupancy: {occupancy}%</p>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => setConfirmDelete(room.roomNumber)}
                  >
                    <i className="bi bi-trash" /> Delete
                  </button>
                </div>
              </div>

              {/* Confirmation Dialog */}
              {confirmDelete === room.roomNumber && (
  <div
    className="position-fixed top-50 start-50 translate-middle bg-warning p-4 rounded shadow"
    style={{ zIndex: 1050, minWidth: '300px' }}
  >
    <h6 className="mb-3 text-center">Confirm delete Room {room.roomNumber}?</h6>
    <div className="d-flex justify-content-center">
      <button
        className="btn btn-sm btn-secondary me-2"
        onClick={() => setConfirmDelete(null)}
      >
        Cancel
      </button>
      <button
        className="btn btn-sm btn-danger"
        onClick={() => handleDelete(room.roomNumber)}
      >
        Delete
      </button>
    </div>
  </div>
)}

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeleteRoom;
