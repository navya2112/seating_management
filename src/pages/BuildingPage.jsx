import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import building from '../assets/building.jpg';
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

const BuildingPage = () => {
  const { locationName } = useParams();
  const navigate = useNavigate();
  const [buildings] = useState(initialBuildings);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [occupancyThreshold, setOccupancyThreshold] = useState(0);

  const handleFilterClick = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilters = () => {
    setShowFilterModal(false);
  };

  const handleCloseModal = () => {
    setShowFilterModal(false);
  };

  const handleCardClick = (buildingName) => {
    navigate(`/location/${locationName}/${buildingName}`);
  };
  
  let filteredBuildings = buildings.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (occupancyThreshold > 0) {
    filteredBuildings = filteredBuildings.filter((b) => b.occupancy >= occupancyThreshold);
  }

  switch (sortOption) {
    case 'alpha-asc':
      filteredBuildings.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'alpha-desc':
      filteredBuildings.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'occupancy-low':
      filteredBuildings.sort((a, b) => a.occupancy - b.occupancy);
      break;
    case 'occupancy-high':
      filteredBuildings.sort((a, b) => b.occupancy - a.occupancy);
      break;
    default:
      break;
  }

  return (
    <div className="container mt-4">
      {/* Top Controls */}
      <div className="row mb-3">
        <div className="col-md-7">
          <input
            type="text"
            className="form-control"
            placeholder="Search with Building name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-md-1 text-center">
          <button
            className="btn btn-outline-secondary"
            title="Filter"
            onClick={handleFilterClick}
          >
            <i className="bi bi-funnel-fill"></i>
          </button>
        </div>

        <div className="col-md-4 text-end">
          <button className="btn btn-success me-2" onClick={() => navigate('/add-building')}>
            Add Building
          </button>
          <button className="btn btn-danger" onClick={() => navigate(`/location/${locationName}/delete-building`)}>
            Remove Building
          </button>
        </div>
      </div>

      {/* Location Title */}
      <h5 className="mb-3 text-capitalize">{locationName}</h5>

      {/* Building Cards */}
      <div className="row">
        {filteredBuildings.map((b) => (
          <div className="col-md-4 mb-4" key={b.name}>
            <div className="card shadow-sm h-100" style={{ cursor: 'pointer' }} onClick={() => handleCardClick(b.name)}>
              <div className="card-body">
                <img src={building} className="card-img-top" alt={b.name} />
                <h6 className="card-title text-center fw-bold">{b.name}</h6>
                <p className="card-text" style={{ fontSize: '0.9rem' }}>
                  Total Seats: {b.totalSeats}<br />
                  Seats occupied: {b.occupied}<br />
                  Seats vacant: {b.vacant}<br />
                  Occupancy: {b.occupancy}%<br />
                  Floors: {b.floors}<br />
                  Rooms: {b.rooms}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Modal */}
      {/* Filter Panel Positioned Below Filter Icon */}
{showFilterModal && (
  <div
    className="position-absolute bg-white border rounded shadow-sm p-3"
    style={{
      top: '100px', // Adjust based on your layout
      right: '160px', // Adjust to align under filter icon
      zIndex: 1050,
      width: '250px'
    }}
  >
    <h6 className="mb-3">Filter & Sort</h6>
    <div className="mb-3">
      <label className="form-label">Sort By:</label>
      <select className="form-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
        <option value="">None</option>
        <option value="alpha-asc">Alphabetic order (A–Z)</option>
        <option value="alpha-desc">Alphabetic order (Z–A)</option>
        <option value="occupancy-low">Occupancy % (Low to High)</option>
        <option value="occupancy-high">Occupancy % (High to Low)</option>
      </select>
    </div>
    <div className="mb-3">
      <label className="form-label">Minimum Occupancy %:</label>
      <input
        type="range"
        className="form-range"
        min="0"
        max="100"
        value={occupancyThreshold}
        onChange={(e) => setOccupancyThreshold(Number(e.target.value))}
      />
      <div>{occupancyThreshold}%</div>
    </div>
    <div className="text-end">
      <button className="btn btn-sm btn-secondary me-2" onClick={handleCloseModal}>Cancel</button>
      <button className="btn btn-sm btn-primary" onClick={handleApplyFilters}>Apply</button>
    </div>
  </div>
)}

    </div>
  );
};

export default BuildingPage;
