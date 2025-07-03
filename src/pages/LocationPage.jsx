

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import defaultImage from '../assets/location.jpg';

// const LocationPage = () => {
//   const [locations, setLocations] = useState([]);
//   const [sortOption, setSortOption] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('');
//   const [filterValue, setFilterValue] = useState('');
//   const navigate = useNavigate();

//   const API_BASE_URL = 'http://localhost:8084';

//   const fetchDefaultLocations = () => {
//     fetch(`${API_BASE_URL}/locations`)
//       .then((res) => res.json())
//       .then((data) => setLocations(data))
//       .catch((err) => {
//         console.error("Error fetching locations:", err);
//         alert("Failed to fetch locations.");
//       });
//   };

//   useEffect(() => {
//     fetchDefaultLocations();
//   }, []);

//   const getSortParams = () => {
//     switch (sortOption) {
//       case 'alpha-asc':
//         return { sortBy: 0, order: 1 };
//       case 'alpha-desc':
//         return { sortBy: 0, order: 0 };
//       case 'occupancy-low':
//         return { sortBy: 1, order: 1 };
//       case 'occupancy-high':
//         return { sortBy: 1, order: 0 };
//       default:
//         return { sortBy: 1, order: 1 }; // fallback to occupancy asc
//     }
//   };

//   const handleFilter = () => {
//     const { sortBy, order } = getSortParams();
//     let min = 0;
//     let max = 100;

//     if (filterType === 'greater' && filterValue !== '') {
//       min = parseFloat(filterValue);
//     } else if (filterType === 'less' && filterValue !== '') {
//       max = parseFloat(filterValue);
//     }

//     const minDec = min / 100;
//     const maxDec = max / 100;

//     const url = `${API_BASE_URL}/locations/sort?minOccupancy=${minDec}&maxOccupancy=${maxDec}&sortBy=${sortBy}&order=${order}`;

//     console.log("Fetching from:", url);

//     fetch(url)
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("Filtered response:", data);
//         setLocations(data);
//       })
//       .catch((err) => {
//         console.error("Error applying filter:", err);
//         alert("Failed to apply filter.");
//       });
//   };

//   const handleClearFilter = () => {
//     setFilterType('');
//     setFilterValue('');
//     setSortOption('');
//     fetchDefaultLocations();
//   };

//   const handleSortChange = (e) => {
//     setSortOption(e.target.value);
//   };

//   const filteredLocations = locations.filter((loc) =>
//     loc.location.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleCardClick = (locationName) => {
//     navigate(`/location/${locationName}`);
//   };

//   const handleAllocateClick = () => {
//     navigate('/allocate-strategy', {
//       state: {
//         selectedSeats: [],
//         cohortData: {
//           cohortCode: '',
//           inTrainingCount: 0,
//           graduatedCount: 0,
//           exitCount: 0,
//           trainingStartDate: '',
//           trainingEndDate: '',
//           dateOfJoining: '',
//           batchOwner: '',
//           sl: '',
//           practice: ''
//         }
//       }
//     });
//   };

//   return (
//     <div className="container mt-4">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h4 className="text-primary">📍 Locations</h4>
//         <button className="btn btn-success" onClick={handleAllocateClick}>
//           ➕ Allocate Seats
//         </button>
//       </div>

//       {/* Search and Sort */}
//       <div className="row mb-3">
//         <div className="col-md-6 mb-2">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search with Location..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="col-md-6 mb-2">
//           <select className="form-select" value={sortOption} onChange={handleSortChange}>
//             <option value="">Sort By</option>
//             <option value="alpha-asc">Alphabetical (A–Z)</option>
//             <option value="alpha-desc">Alphabetical (Z–A)</option>
//             <option value="occupancy-low">Occupancy % (High to Low)</option>
//             <option value="occupancy-high">Occupancy % (Low to High)</option>
//           </select>
//         </div>
//       </div>

//       {/* Filter Section */}
//       <div className="row mb-4">
//         <div className="col-md-4 mb-2">
//           <select
//             className="form-select"
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//           >
//             <option value="">Filter by Occupancy</option>
//             <option value="greater">Occupancy &gt; value</option>
//             <option value="less">Occupancy &lt; value</option>
//           </select>
//         </div>
//         <div className="col-md-4 mb-2">
//           <input
//             type="number"
//             className="form-control"
//             placeholder="Enter % value"
//             value={filterValue}
//             onChange={(e) => setFilterValue(e.target.value)}
//             min={0}
//             max={100}
//           />
//         </div>
//         <div className="col-md-4 d-flex gap-2 mb-2">
//           <button className="btn btn-secondary w-100" onClick={handleFilter}>
//             Apply Filter
//           </button>
//           <button className="btn btn-outline-danger" onClick={handleClearFilter}>
//             Clear
//           </button>
//         </div>
//       </div>

//       {/* Location Cards */}
//       <div className="row">
//         {filteredLocations.map((loc) => (
//           <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={loc.location}>
//             <div
//               className="card h-100 shadow-sm"
//               style={{ cursor: 'pointer' }}
//               onClick={() => handleCardClick(loc.location)}
//             >
//               <img
//                 src={loc.imageUrl || defaultImage}
//                 className="card-img-top"
//                 alt={loc.location}
//               />
//               <div className="card-body">
//                 <h5 className="card-title text-center fw-bold">{loc.location}</h5>
//                 <p className="card-text fw-medium">
//                   Total Seats: {loc.totalSeats}
//                   <br />
//                   Occupied: {loc.occupiedSeats}
//                   <br />
//                   Vacant: {loc.totalSeats - loc.occupiedSeats}
//                   <br />
//                   Occupancy:{' '}
//                   {loc.totalSeats > 0
//                     ? ((loc.occupiedSeats / loc.totalSeats) * 100).toFixed(1)
//                     : 0}
//                   %
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LocationPage;
// import React, { useEffect, useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import defaultImage from '../assets/location.jpg';

// const LocationPage = () => {
//   const [locations, setLocations] = useState([]);
//   const [sortOption, setSortOption] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('');
//   const [filterValue, setFilterValue] = useState('');
//   const navigate = useNavigate();

//   const API_BASE_URL = 'http://localhost:8084';

//   // Memoize the fetchLocations function to prevent unnecessary re-renders
//   // and to use it as a dependency in useEffect.
//   const fetchLocations = useCallback(() => {
//     const { sortBy, order } = getSortParams();
//     let minOccupancy = 0;
//     let maxOccupancy = 100;

//     if (filterType === 'greater' && filterValue !== '') {
//       minOccupancy = parseFloat(filterValue);
//     } else if (filterType === 'less' && filterValue !== '') {
//       maxOccupancy = parseFloat(filterValue);
//     }

//     const minDec = minOccupancy / 100;
//     const maxDec = maxOccupancy / 100;

//     // Construct the URL with all relevant parameters for filtering and sorting
//     const url = `${API_BASE_URL}/locations/sort?minOccupancy=${minDec}&maxOccupancy=${maxDec}&sortBy=${sortBy}&order=${order}`;

//     console.log("Fetching from:", url);

//     fetch(url)
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((data) => {
//         console.log("Fetched data:", data);
//         setLocations(data);
//       })
//       .catch((err) => {
//         console.error("Error fetching locations:", err);
//         alert("Failed to fetch locations.");
//       });
//   }, [sortOption, filterType, filterValue]); // Dependencies for useCallback

//   useEffect(() => {
//     fetchLocations();
//   }, [fetchLocations]); // Call fetchLocations whenever its dependencies change

//   const getSortParams = () => {
//     switch (sortOption) {
//       case 'alpha-asc':
//         return { sortBy: 0, order: 1 };
//       case 'alpha-desc':
//         return { sortBy: 0, order: 0 };
//       case 'occupancy-low': // This should typically be low to high for actual "low" occupancy
//         return { sortBy: 1, order: 1 };
//       case 'occupancy-high': // This should typically be high to low for actual "high" occupancy
//         return { sortBy: 1, order: 0 };
//       default:
//         // Default to sorting by occupancy high to low if no sort option is selected
//         // This seems to align with typical default expectations for "most relevant"
//         return { sortBy: 1, order: 0 };
//     }
//   };

//   const handleApplyFilterAndSort = () => {
//     fetchLocations(); // Trigger a refetch with the current sort and filter states
//   };

//   const handleClearFilter = () => {
//     setFilterType('');
//     setFilterValue('');
//     setSortOption('');
//     setSearchTerm(''); // Also clear search term
//     // After clearing, fetch the default set of locations.
//     // The useEffect with fetchLocations dependency array will handle this.
//   };

//   const handleSortChange = (e) => {
//     setSortOption(e.target.value);
//     // No need to call fetchLocations here directly,
//     // as it's a dependency of useEffect, which will trigger.
//   };

//   const handleFilterTypeChange = (e) => {
//     setFilterType(e.target.value);
//   };

//   const handleFilterValueChange = (e) => {
//     setFilterValue(e.target.value);
//   };

//   const filteredLocations = locations.filter((loc) =>
//     loc.location.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleCardClick = (locationName) => {
//     navigate(`/location/${locationName}`);
//   };

//   const handleAllocateClick = () => {
//     navigate('/allocate-strategy', {
//       state: {
//         selectedSeats: [],
//         cohortData: {
//           cohortCode: '',
//           inTrainingCount: 0,
//           graduatedCount: 0,
//           exitCount: 0,
//           trainingStartDate: '',
//           trainingEndDate: '',
//           dateOfJoining: '',
//           batchOwner: '',
//           sl: '',
//           practice: ''
//         }
//       }
//     });
//   };

//   return (
//     <div className="container mt-4">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h4 className="text-primary">📍 Locations</h4>
//         <button className="btn btn-success" onClick={handleAllocateClick}>
//           ➕ Allocate Seats
//         </button>
//       </div>

//       {/* Search and Sort */}
//       <div className="row mb-3">
//         <div className="col-md-6 mb-2">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search with Location..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="col-md-6 mb-2">
//           <select className="form-select" value={sortOption} onChange={handleSortChange}>
//             <option value="">Sort By</option>
//             <option value="alpha-asc">Alphabetical (A–Z)</option>
//             <option value="alpha-desc">Alphabetical (Z–A)</option>
//             <option value="occupancy-low">Occupancy % (High to Low)</option>
//             <option value="occupancy-high">Occupancy % (Low to High)</option>
//           </select>
//         </div>
//       </div>

//       {/* Filter Section */}
//       <div className="row mb-4">
//         <div className="col-md-4 mb-2">
//           <select
//             className="form-select"
//             value={filterType}
//             onChange={handleFilterTypeChange}
//           >
//             <option value="">Filter by Occupancy</option>
//             <option value="greater">Occupancy &gt; value</option>
//             <option value="less">Occupancy &lt; value</option>
//           </select>
//         </div>
//         <div className="col-md-4 mb-2">
//           <input
//             type="number"
//             className="form-control"
//             placeholder="Enter % value"
//             value={filterValue}
//             onChange={handleFilterValueChange}
//             min={0}
//             max={100}
//           />
//         </div>
//         <div className="col-md-4 d-flex gap-2 mb-2">
//           {/* <button className="btn btn-secondary w-100" onClick={handleApplyFilterAndSort}>
//             Apply Filter
//           </button> */}
//           <button className="btn btn-outline-danger" onClick={handleClearFilter}>
//             Clear
//           </button>
//         </div>
//       </div>

//       {/* Location Cards */}
//       <div className="row">
//         {filteredLocations.length > 0 ? (
//           filteredLocations.map((loc) => (
//             <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={loc.location}>
//               <div
//                 className="card h-100 shadow-sm"
//                 style={{ cursor: 'pointer' }}
//                 onClick={() => handleCardClick(loc.location)}
//               >
//                 <img
//                   src={loc.imageUrl || defaultImage}
//                   className="card-img-top"
//                   alt={loc.location}
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title text-center fw-bold">{loc.location}</h5>
//                   <p className="card-text fw-medium">
//                     Total Seats: {loc.totalSeats}
//                     <br />
//                     Occupied: {loc.occupiedSeats}
//                     <br />
//                     Vacant: {loc.totalSeats - loc.occupiedSeats}
//                     <br />
//                     Occupancy:{' '}
//                     {loc.totalSeats > 0
//                       ? ((loc.occupiedSeats / loc.totalSeats) * 100).toFixed(1)
//                       : 0}
//                     %
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="col-12 text-center">
//             <p>No locations found matching your criteria.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LocationPage;

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import defaultImage from '../assets/location.jpg';

const API_BASE_URL = 'http://localhost:8084';

const LocationPage = () => {
  const [locations, setLocations] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Helper to get sort parameters for the API
  const getSortParams = () => {
    switch (sortOption) {
      case 'alpha-asc':
        return { sortBy: 0, order: 1 }; // 0 for alphabetical, 1 for ascending
      case 'alpha-desc':
        return { sortBy: 0, order: 0 }; // 0 for alphabetical, 0 for descending
      case 'occupancy-low':
        return { sortBy: 1, order: 1 }; // 1 for occupancy, 1 for ascending (low to high)
      case 'occupancy-high':
        return { sortBy: 1, order: 0 }; // 1 for occupancy, 0 for descending (high to low)
      default:
        return { sortBy: 1, order: 0 }; // Default to occupancy high to low
    }
  };

  // Memoize the fetchLocations function to prevent unnecessary re-renders
  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { sortBy, order } = getSortParams();
    let minOccupancy = 0;
    let maxOccupancy = 100;

    if (filterType === 'greater' && filterValue !== '') {
      minOccupancy = parseFloat(filterValue);
    } else if (filterType === 'less' && filterValue !== '') {
      maxOccupancy = parseFloat(filterValue);
    }

    const minDec = minOccupancy / 100;
    const maxDec = maxOccupancy / 100;

    const url = `${API_BASE_URL}/locations/sort?minOccupancy=${minDec}&maxOccupancy=${maxDec}&sortBy=${sortBy}&order=${order}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        const message = await res.text();
        throw new Error(`HTTP error! Status: ${res.status}, Message: ${message}`);
      }
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.error("Error fetching locations:", err);
      setError("Failed to fetch locations: " + err.message);
      setLocations([]); // Clear locations on error
    } finally {
      setLoading(false);
    }
  }, [sortOption, filterType, filterValue]); // Dependencies for useCallback

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]); // Re-fetch whenever sort or filter options change

  const handleClearFilter = () => {
    setFilterType('');
    setFilterValue('');
    setSortOption('');
    setSearchTerm('');
    // fetchLocations will be called automatically due to dependency changes
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  // Apply search term filtering client-side after data fetch
  const filteredAndSearchedLocations = locations.filter((loc) =>
    loc.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (locationName) => {
    navigate(`/location/${locationName}`);
  };

  const handleAllocateClick = () => {
    navigate('/allocate-strategy', {
      state: {
        selectedSeats: [],
        cohortData: {
          cohortCode: '',
          inTrainingCount: 0,
          graduatedCount: 0,
          exitCount: 0,
          trainingStartDate: '',
          trainingEndDate: '',
          dateOfJoining: '',
          batchOwner: '',
          sl: '',
          practice: ''
        }
      }
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="text-primary">📍 Locations</h4>
        <button className="btn btn-success" onClick={handleAllocateClick}>
          ➕ Allocate Seats
        </button>
      </div>

      {/* Search and Sort */}
      <div className="row mb-3">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search with Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-2">
          <select className="form-select" value={sortOption} onChange={handleSortChange}>
            <option value="">Sort By</option>
            <option value="alpha-asc">Alphabetical (A–Z)</option>
            <option value="alpha-desc">Alphabetical (Z–A)</option>
            <option value="occupancy-low">Occupancy % (Low to High)</option>
            <option value="occupancy-high">Occupancy % (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Filter Section */}
      <div className="row mb-4">
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={filterType}
            onChange={handleFilterTypeChange}
          >
            <option value="">Filter by Occupancy</option>
            <option value="greater">Occupancy &gt; value</option>
            <option value="less">Occupancy &lt; value</option>
          </select>
        </div>
        <div className="col-md-4 mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="Enter % value"
            value={filterValue}
            onChange={handleFilterValueChange}
            min={0}
            max={100}
          />
        </div>
        <div className="col-md-4 d-flex gap-2 mb-2">
          <button className="btn btn-outline-danger" onClick={handleClearFilter}>
            Clear Filters & Sort
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Loading locations...
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && filteredAndSearchedLocations.length === 0 && (
        <div className="col-12 text-center">
          <p>No locations found matching your criteria.</p>
        </div>
      )}

      {/* Location Cards */}
      <div className="row">
        {!loading && !error && filteredAndSearchedLocations.map((loc) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={loc.location}>
            <div
              className="card h-100 shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => handleCardClick(loc.location)}
            >
              <img
                src={loc.imageUrl || defaultImage}
                className="card-img-top"
                alt={loc.location}
              />
              <div className="card-body">
                <h5 className="card-title text-center fw-bold">{loc.location}</h5>
                <p className="card-text fw-medium">
                  Total Seats: {loc.totalSeats}
                  <br />
                  Occupied: {loc.occupiedSeats}
                  <br />
                  Vacant: {loc.totalSeats - loc.occupiedSeats}
                  <br />
                  Occupancy:{' '}
                  {loc.totalSeats > 0
                    ? ((loc.occupiedSeats / loc.totalSeats) * 100).toFixed(1)
                    : 0}
                  %
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