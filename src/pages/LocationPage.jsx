import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import location from '../assets/location.jpg';

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
  },
  {
    name: 'Hyderabad',
    totalSeats: 2100,
    occupied: 1600,
    vacant: 500,
    occupancy: 76,
    image: 'https://media.glassdoor.com/l/57/2c/e6/54/cognizant-mepz-campus.jpg',
  },
];

const LocationPage = () => {
  const [sortOption, setSortOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState(initialLocations);
  const navigate = useNavigate();

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    let sorted = [...locations];

    switch (option) {
      case 'alpha-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alpha-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'occupancy-low':
        sorted.sort((a, b) => a.occupancy - b.occupancy);
        break;
      case 'occupancy-high':
        sorted.sort((a, b) => b.occupancy - a.occupancy);
        break;
      default:
        sorted = initialLocations;
    }

    setLocations(sorted);
  };

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (locationName) => {
    navigate(`/location/${locationName.toLowerCase()}`);
  };

  return (
    <div className="container mt-4">
      {/* Search and Filter Section */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search with Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select className="form-select" value={sortOption} onChange={handleSortChange}>
            <option value="">Sort By</option>
            <option value="alpha-asc">Alphabetical (A-Z)</option>
            <option value="alpha-desc">Alphabetical (Z-A)</option>
            <option value="occupancy-low">Occupancy % (Low to High)</option>
            <option value="occupancy-high">Occupancy % (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Location Cards */}
      <div className="row">
        {filteredLocations.map((loc) => (
          <div className="col-lg-3 mb-4" key={loc.name}>
            <div
              className="card h-100 shadow-sm"
              style={{ cursor: 'pointer', fontSize: '0.9rem' }}
              onClick={() => handleCardClick(loc.name)}
            >
              <img src={location} className="card-img-top" alt={loc.name} />
              <div className="card-body">
                {/* ✅ Location Name: More Bold */}
                <h5
                  className="card-title text-center"
                  style={{ color: '#2c3e50', fontWeight: '700', fontSize: '1.1rem' }}
                >
                  {loc.name}
                </h5>

                {/* ✅ Details: Smaller Font, Slight Bold */}
                <p className="card-text" style={{ fontSize: '0.85rem', fontWeight: '500', lineHeight: '1.5' }}>
                  Total Seats: {loc.totalSeats}<br />
                  Occupied: {loc.occupied}<br />
                  Vacant: {loc.vacant}<br />
                  Occupancy: {loc.occupancy}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationPage;
