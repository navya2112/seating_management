import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import room from '../assets/room.jpg';

const RoomPage = () => {
  const { locationName, buildingName } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      {/* Back Navigation */}
      <div className="d-flex align-items-center mb-3">
        <span
          style={{ cursor: 'pointer', fontSize: '1.5rem' }}
          onClick={() => navigate(`/location/${locationName}`)}
        >
          ←
        </span>
        <h6 className="ms-3 mb-0">Back to buildings</h6>
      </div>

      {/* Page Title */}
      <h4 className="mb-4">{locationName}: {buildingName}</h4>

      {/* Room Cards */}
      <div className="row">
        {/* Training Rooms */}
        <div className="col-sm-6 col-md-4 col-lg-3 mb-3">
          <Link
            to={`/location/${locationName}/${buildingName}/trainingRooms`}
            className="card text-decoration-none text-dark shadow-sm"
            style={{ minHeight: '250px' }}
          >
            <img
              src={room}
              className="card-img-top"
              alt="Training Rooms"
              style={{ height: '120px', objectFit: 'cover' }}
            />
            <div className="card-body" style={{ fontSize: '0.8rem', padding: '0.75rem' }}>
              <h6>Training Rooms</h6>
              <p>Total rooms: 5</p>
              <p>Occupied: 3</p>
              <p>Vacant: 2</p>
              <p>Occupancy: 66%</p>
            </div>
          </Link>
        </div>

        {/* Modified ODC */}
        <div className="col-sm-6 col-md-4 col-lg-3 mb-3">
          <Link
            to={`/location/${locationName}/${buildingName}/modifiedODC`}
            className="card text-decoration-none text-dark shadow-sm"
            style={{ minHeight: '250px' }}
          >
            <img
              src={room}
              className="card-img-top"
              alt="Modified ODC"
              style={{ height: '120px', objectFit: 'cover' }}
            />
            <div className="card-body" style={{ fontSize: '0.8rem', padding: '0.75rem' }}>
              <h6>Modified ODC</h6>
              <p>Total rooms: 11</p>
              <p>Occupied: 10</p>
              <p>Vacant: 1</p>
              <p>Occupancy: 87%</p>
            </div>
          </Link>
        </div>

        {/* ODC */}
        <div className="col-sm-6 col-md-4 col-lg-3 mb-3">
          <Link
            to={`/location/${locationName}/${buildingName}/odc`}
            className="card text-decoration-none text-dark shadow-sm"
            style={{ minHeight: '250px' }}
          >
            <img
              src={room}
              className="card-img-top"
              alt="ODC"
              style={{ height: '120px', objectFit: 'cover' }}
            />
            <div className="card-body" style={{ fontSize: '0.8rem', padding: '0.75rem' }}>
              <h6>ODC</h6>
              <p>Total rooms: 4</p>
              <p>Occupied: 3</p>
              <p>Vacant: 1</p>
              <p>Occupancy: 75%</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
