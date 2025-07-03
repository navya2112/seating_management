import React, { useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const initialBuildings = [
  {
    name: 'SRI-SDB1',
    totalSeats: 500,
    occupied: 330,
    vacant: 170,
    occupancy: 66,
    floors: 7,
    rooms: 20,
  },
  {
    name: 'SRI-SDB2',
    totalSeats: 480,
    occupied: 350,
    vacant: 130,
    occupancy: 72,
    floors: 6,
    rooms: 18,
  },
  {
    name: 'SRI-SDB3',
    totalSeats: 470,
    occupied: 395,
    vacant: 75,
    occupancy: 84,
    floors: 7,
    rooms: 17,
  },
];

const DeleteBuilding = () => {
  const [buildings, setBuildings] = useState(initialBuildings);
  const [searchTerm, setSearchTerm] = useState('');
  const [buildingToDelete, setBuildingToDelete] = useState(null);
  const navigate = useNavigate();
  const { locationName } = useParams();

  const filteredBuildings = buildings.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = (name) => {
    setBuildingToDelete(name);
  };

  const handleDelete = () => {
    setBuildings(buildings.filter((b) => b.name !== buildingToDelete));
    setBuildingToDelete(null);
  };

  return (
    
    <div className="container mt-4">
        <div className="d-flex align-items-center mb-3">
            <span style={{ cursor: 'pointer', fontSize: '1.5rem' }} onClick={() => navigate(-1)} >
            ←
            </span>
            <h6 className="ms-3 mb-0">Back to buildings</h6>
        </div>
      <h4 className="mb-4 text-capitalize">{locationName}</h4>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search with Building name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Building Cards */}
      <div className="row">
        {filteredBuildings.map((b) => (
          <div className="col-md-4 mb-4" key={b.name}>
            <div className="card shadow-sm h-100">
              <img
                src="https://media.glassdoor.com/l/57/2c/e6/54/cognizant-mepz-campus.jpg"
                className="card-img-top"
                alt={b.name}
                style={{ height: '120px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h6 className="card-title text-center fw-bold">{b.name}</h6>
                <p className="card-text" style={{ fontSize: '0.9rem' }}>
                  Total Seats: {b.totalSeats}<br />
                  Seats occupied: {b.occupied}<br />
                  Seats vacant: {b.vacant}<br />
                  Occupancy: {b.occupancy}%<br />
                  Floors: {b.floors}<br />
                  Rooms: {b.rooms}
                </p>
                <div className="text-end">
                <button className="btn btn-sm btn-outline-danger" onClick={() => confirmDelete(b.name)}>
  🗑️
</button>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {buildingToDelete && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{buildingToDelete}</strong>?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setBuildingToDelete(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteBuilding;
