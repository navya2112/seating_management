import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const initialLocations = [
  {
    name: 'Chennai',
    totalSeats: 2398,
    occupied: 1800,
    vacant: 598,
    occupancy: 75,
    image: 'https://media.glassdoor.com/l/57/2c/e6/54/cognizant-mepz-campus.jpg',
  },
  {
    name: 'Coimbatore',
    totalSeats: 1896,
    occupied: 1575,
    vacant: 321,
    occupancy: 83,
    image: 'https://media.glassdoor.com/l/57/2c/e6/54/cognizant-mepz-campus.jpg',
  },
  {
    name: 'Bangalore',
    totalSeats: 1589,
    occupied: 1300,
    vacant: 289,
    occupancy: 86,
    image: 'https://media.glassdoor.com/l/57/2c/e6/54/cognizant-mepz-campus.jpg',
  }, {
    name: 'Hyderabad',
    totalSeats: 2100,
    occupied: 1600,
    vacant: 500,
    occupancy: 76,
    image: 'https://media.glassdoor.com/l/57/2c/e6/54/cognizant-mepz-campus.jpg',
  },  
];

const DeleteLocationPage = () => {
  const [locations, setLocations] = useState(initialLocations);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleCardClick = (locationName) => {
    navigate(`/location/${locationName.toLowerCase()}`);
  };

  const confirmDelete = (locationName) => {
    setLocationToDelete(locationName);
  };

  const handleDelete = () => {
    setLocations(locations.filter(loc => loc.name !== locationToDelete));
    setLocationToDelete(null);
  };

  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Search by location name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Location Cards */}
      <div className="row">
        {filteredLocations.map((loc) => (
          <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={loc.name}>
            <div className="card h-100 shadow-sm">
              <img src={loc.image} className="card-img-top" alt={loc.name} style={{ height: '120px', objectFit: 'cover' }} />
              <div className="card-body p-2">
                <h6 className="card-title text-center">{loc.name}</h6>
                <p className="card-text small">
                  <strong>Total:</strong> {loc.totalSeats}<br />
                  <strong>Occupied:</strong> {loc.occupied}<br />
                  <strong>Vacant:</strong> {loc.vacant}<br />
                  <strong>Occupancy:</strong> {loc.occupancy}%
                </p>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleCardClick(loc.name)}>
                    View
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => confirmDelete(loc.name)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {locationToDelete && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{locationToDelete}</strong>?</p>
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-secondary me-2" onClick={() => setLocationToDelete(null)}>Cancel</button>
                        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                    </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteLocationPage;
