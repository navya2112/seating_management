import React from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import roomImage from '../assets/room.jpg';

const roomDetails = {
  trainingRooms: {
    title: 'Training Rooms',
    rooms: [
      { floor: 4, roomNumber: 6, totalSeats: 50, occupied: 30 },
      { floor: 3, roomNumber: 7, totalSeats: 48, occupied: 35 },
      { floor: 5, roomNumber: 2, totalSeats: 40, occupied: 39 },
    ],
  },
  modifiedODC: {
    title: 'Modified ODC',
    rooms: [
      { floor: 2, roomNumber: 1, totalSeats: 30, occupied: 25 },
      { floor: 1, roomNumber: 3, totalSeats: 20, occupied: 15 },
    ],
  },
  odc: {
    title: 'ODC',
    rooms: [
      { floor: 6, roomNumber: 8, totalSeats: 60, occupied: 45 },
      { floor: 7, roomNumber: 9, totalSeats: 55, occupied: 50 },
    ],
  },
};

const SpecificRoom = () => {
  const { locationName, buildingName, roomType } = useParams();
  const navigate = useNavigate();
  const room = roomDetails[roomType];

  if (!room) {
    return <div className="container mt-4">Room type not found.</div>;
  }

  return (
    <div className="container mt-4">
      {/* Back Navigation */}
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
            <span
            style={{ cursor: 'pointer', fontSize: '1.5rem' }}
            onClick={() => navigate(`/location/${locationName}/${buildingName}`)}
            >
            ←
            </span>
            <h6 className="ms-3 mb-0">Back to type of rooms</h6>
        </div>
        <div>
          <button className="btn btn-outline-info me-2" onClick={() => navigate(`/location/${locationName}/${buildingName}/add-room`)}>
              Add Room
          </button>
          <button className="btn btn-outline-danger me-2" onClick={() => navigate(`/location/${locationName}/${buildingName}/${roomType}/delete-room`)}>
            Delete Room
          </button>
          <button className="btn btn-outline-success" onClick={() => navigate(`/location/${locationName}/${buildingName}/allocate`) } >
              Allocate
          </button>
        </div>
    </div>


      {/* Title */}
      <h4 className="mb-4">{locationName} - {buildingName} : {room.title}</h4>

      {/* Room Cards */}
      <div className="row">
        {room.rooms.map((r, index) => {
          const vacant = r.totalSeats - r.occupied;
          const occupancy = Math.round((r.occupied / r.totalSeats) * 100);

          return (
            <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-3">
              <Link
  to={`/location/${locationName}/${buildingName}/${roomType}/${r.roomNumber}/view`}
  className="text-decoration-none text-dark"
>
  <div className="card shadow-sm text-dark" style={{ minHeight: '200px' }}>
    <img
      src={roomImage}
      className="card-img-top"
      alt={`Room ${r.roomNumber}`}
      style={{ height: '100px', objectFit: 'cover' }}
    />
    <div className="card-body" style={{ fontSize: '0.8rem', padding: '0.75rem' }}>
      <h6>Floor {r.floor} - Room {r.roomNumber}</h6>
      <p>Total Seats: {r.totalSeats}</p>
      <p>Occupied: {r.occupied}</p>
      <p>Vacant: {vacant}</p>
      <p>Occupancy: {occupancy}%</p>
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
