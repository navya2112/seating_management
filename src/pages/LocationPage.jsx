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
//       .then((data) => {
//         console.log("Default locations:", data);
//         setLocations(data);
//       })
//       .catch((err) => {
//         console.error("Error fetching default locations:", err);
//         alert("Failed to fetch locations.");
//       });
//   };

//   // Only fetch default locations on initial component mount
//   useEffect(() => {
//     fetchDefaultLocations();
//   }, []);

//   const getSortParams = () => {
//     switch (sortOption) {
//       case 'alpha-asc':
//         return { sortBy: 0, order: 0 }; // Alphabetical A-Z (Ascending)
//       case 'alpha-desc':
//         return { sortBy: 0, order: 1 }; // Alphabetical Z-A (Descending)
//       case 'occupancy-low':
//         return { sortBy: 1, order: 0 }; // Occupancy Low to High (Ascending)
//       case 'occupancy-high':
//         return { sortBy: 1, order: 1 }; // Occupancy High to Low (Descending)
//       default:
//         // Default behavior when no sort option is selected or on initial load.
//         // If you want a specific default sort, set it here.
//         // For example, default to High Occupancy:
//         return { sortBy: 1, order: 1 };
//     }
//   };

//   const handleFilter = () => {
//     const { sortBy, order } = getSortParams(); // Get current sort params
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

//     console.log("Fetching with filter/sort from:", url);

//     fetch(url)
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((data) => {
//         console.log("Filtered/Sorted response:", data);
//         setLocations(data);
//       })
//       .catch((err) => {
//         console.error("Error applying filter/sort:", err);
//         alert("Failed to apply filter/sort. Check console for details.");
//       });
//   };

//   const handleClearFilter = () => {
//     setFilterType('');
//     setFilterValue('');
//     setSortOption('');
//     fetchDefaultLocations(); // Fetch default locations after clearing filters
//   };

//   const handleSortChange = (e) => {
//     const newSortOption = e.target.value;
//     setSortOption(newSortOption);
//     // Directly call handleFilter after setting the new sort option.
//     // React's state updates are often batched, so calling it directly
//     // will likely use the updated state for sortOption.
//     // The useEffect below also handles this.
//   };

//   // Effect to trigger filter when sortOption, filterType, or filterValue changes
//   // This ensures that any change in search/filter/sort parameters re-fetches data.
//   useEffect(() => {
//     // Only apply filter/sort if a sort option is explicitly selected
//     // or if a filter is active, otherwise rely on fetchDefaultLocations
//     if (sortOption !== '' || filterType !== '' || searchTerm !== '') {
//       handleFilter();
//     }
//   }, [sortOption, filterType, filterValue, searchTerm]); // Dependencies

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

//       {/* <h2>Search and Sort</h2> */}
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
//             <option value="occupancy-high">Occupancy % (High to Low)</option>
//             <option value="occupancy-low">Occupancy % (Low to High)</option>
//           </select>
//         </div>
//       </div>

//       {/* <h2>Filter Section</h2> */}
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

//       {/* <h2>Location Cards</h2> */}
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
//                   Total Seats: {loc.totalSeats}<br />
//                   Occupied: {loc.occupiedSeats}<br />
//                   Vacant: {loc.totalSeats - loc.occupiedSeats}<br />
//                   Occupancy: {loc.totalSeats > 0 ? ((loc.occupiedSeats / loc.totalSeats) * 100).toFixed(1) : 0}%
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





import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import defaultImage from '../assets/location.jpg'; // Ensure this path is correct

const LocationPage = () => {
    const [locations, setLocations] = useState([]);
    const [sortOption, setSortOption] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const navigate = useNavigate();

    const API_BASE_URL = 'http://localhost:8084';

    const fetchDefaultLocations = () => {
        fetch(`${API_BASE_URL}/locations`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Default locations:", data);
                setLocations(data);
            })
            .catch((err) => {
                console.error("Error fetching default locations:", err);
                alert("Failed to fetch locations.");
            });
    };

    // Only fetch default locations on initial component mount
    useEffect(() => {
        fetchDefaultLocations();
    }, []);

    const getSortParams = () => {
        switch (sortOption) {
            case 'alpha-asc':
                return { sortBy: 0, order: 0 }; // Alphabetical A-Z (Ascending)
            case 'alpha-desc':
                return { sortBy: 0, order: 1 }; // Alphabetical Z-A (Descending)
            case 'occupancy-low':
                return { sortBy: 1, order: 0 }; // Occupancy Low to High (Ascending)
            case 'occupancy-high':
                return { sortBy: 1, order: 1 }; // Occupancy High to Low (Descending)
            default:
                // Default behavior when no sort option is selected or on initial load.
                // For example, default to High Occupancy if nothing else is specified:
                return { sortBy: 1, order: 1 };
        }
    };

    const handleFilter = () => {
        const { sortBy, order } = getSortParams(); // Get current sort params
        let min = 0;
        let max = 100;

        if (filterType === 'greater' && filterValue !== '') {
            min = parseFloat(filterValue);
        } else if (filterType === 'less' && filterValue !== '') {
            max = parseFloat(filterValue);
        }

        const minDec = min / 100;
        const maxDec = max / 100;

        const url = `${API_BASE_URL}/locations/sort?minOccupancy=${minDec}&maxOccupancy=${maxDec}&sortBy=${sortBy}&order=${order}`;

        console.log("Fetching with filter/sort from:", url);

        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log("Filtered/Sorted response:", data);
                setLocations(data);
            })
            .catch((err) => {
                console.error("Error applying filter/sort:", err);
                alert("Failed to apply filter/sort. Check console for details.");
            });
    };

    const handleClearFilter = () => {
        setFilterType('');
        setFilterValue('');
        setSortOption('');
        setSearchTerm(''); // Clear search term as well
        fetchDefaultLocations(); // Fetch default locations after clearing filters
    };

    const handleSortChange = (e) => {
        const newSortOption = e.target.value;
        setSortOption(newSortOption);
    };

    // Effect to trigger filter when sortOption, filterType, or filterValue changes
    // This ensures that any change in search/filter/sort parameters re-fetches data.
    useEffect(() => {
        // Only apply filter/sort if a sort option is explicitly selected
        // or if a filter is active, or if a search term is present
        if (sortOption !== '' || filterType !== '' || searchTerm !== '') {
            handleFilter();
        } else {
            // If all are cleared, ensure we're showing default data
            fetchDefaultLocations();
        }
    }, [sortOption, filterType, filterValue, searchTerm]); // Dependencies

    // Filter locations based on search term. This is client-side filtering
    // applied *after* potential server-side sorting/filtering.
    const filteredLocations = locations.filter((loc) =>
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
            {/* Inline Style Block for lift-on-hover */}
            <style jsx>{`
                .lift-on-hover {
                    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                }

                .lift-on-hover:hover {
                    transform: translateY(-5px); /* Lifts the card slightly */
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important; /* Larger shadow */
                }
            `}</style>

            {/* Header with Title and Allocate Button */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h3 className="text-dark fw-bold mb-0">
                    <i className="bi bi-geo-alt-fill me-2"></i>Locations
                </h3>
                <button
                    className="btn btn-primary shadow-sm"
                    onClick={handleAllocateClick}
                >
                    <i className="bi bi-plus-circle me-2"></i>Allocate Seats
                </button>
            </div>

            {/* Search, Sort, and Filter Section */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        {/* Search Input */}
                        <div className="col-md-5 col-lg-4">
                            <label htmlFor="searchLocation" className="form-label text-muted small mb-1">Search Location</label>
                            <input
                                type="text"
                                className="form-control"
                                id="searchLocation"
                                placeholder="e.g., Chennai"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="col-md-4 col-lg-3">
                            <label htmlFor="sortBy" className="form-label text-muted small mb-1">Sort By</label>
                            <select
                                className="form-select"
                                id="sortBy"
                                value={sortOption}
                                onChange={handleSortChange}
                            >
                                <option value="">Default (Occupancy High to Low)</option>
                                <option value="alpha-asc">Location A-Z</option>
                                <option value="alpha-desc">Location Z-A</option>
                                <option value="occupancy-high">Occupancy % (High to Low)</option>
                                <option value="occupancy-low">Occupancy % (Low to High)</option>
                            </select>
                        </div>

                        {/* Filter by Occupancy Type */}
                        <div className="col-md-3 col-lg-2">
                            <label htmlFor="filterType" className="form-label text-muted small mb-1">Occupancy Filter</label>
                            <select
                                className="form-select"
                                id="filterType"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="">None</option>
                                <option value="greater">Greater than (%)</option>
                                <option value="less">Less than (%)</option>
                            </select>
                        </div>

                        {/* Filter Value Input */}
                        <div className="col-md-3 col-lg-1">
                            <label htmlFor="filterValue" className="form-label text-muted small mb-1">Value</label>
                            <input
                                type="number"
                                className="form-control"
                                id="filterValue"
                                placeholder="%"
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                                min={0}
                                max={100}
                                disabled={!filterType} // Disable if no filter type is selected
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="col-md-6 col-lg-2 d-grid gap-2">
                            <button className="btn btn-secondary shadow-sm" onClick={handleFilter}>
                                <i className="bi bi-funnel-fill me-2"></i>Apply Filters
                            </button>
                            <button className="btn btn-outline-danger shadow-sm" onClick={handleClearFilter}>
                                <i className="bi bi-x-circle me-2"></i>Clear All
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Location Cards */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {filteredLocations.length > 0 ? (
                    filteredLocations.map((loc) => (
                        <div className="col" key={loc.location}>
                            <div
                                className="card h-100 shadow-sm border-0 lift-on-hover"
                                style={{ cursor: 'pointer', borderRadius: '10px', overflow: 'hidden' }}
                                onClick={() => handleCardClick(loc.location)}
                            >
                                <img
                                    src={loc.imageUrl || defaultImage}
                                    className="card-img-top"
                                    alt={loc.location}
                                    style={{ height: '180px', objectFit: 'cover' }}
                                />
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <h5 className="card-title text-center fw-bold text-dark mb-3">
                                        {loc.location}
                                    </h5>
                                    <ul className="list-group list-group-flush border-top border-bottom mb-3">
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Total Seats
                                            <span className="badge bg-info rounded-pill">{loc.totalSeats}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Occupied
                                            <span className="badge bg-warning rounded-pill">{loc.occupiedSeats}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Vacant
                                            <span className="badge bg-success rounded-pill">{loc.totalSeats - loc.occupiedSeats}</span>
                                        </li>
                                    </ul>
                                    <div className="text-center">
                                        <p className="mb-0 fw-bold text-secondary">
                                            Occupancy: <span className="text-dark">
                                                {loc.totalSeats > 0 ? ((loc.occupiedSeats / loc.totalSeats) * 100).toFixed(1) : 0}%
                                            </span>
                                        </p>
                                        {/* Removed the progress bar section below */}
                                        {/*
                                        <div className="progress mt-2" style={{ height: '8px' }}>
                                            <div
                                                className={`progress-bar ${loc.totalSeats > 0 && (loc.occupiedSeats / loc.totalSeats) * 100 > 75 ? 'bg-danger' : 'bg-primary'}`}
                                                role="progressbar"
                                                style={{ width: `${loc.totalSeats > 0 ? (loc.occupiedSeats / loc.totalSeats) * 100 : 0}%` }}
                                                aria-valuenow={loc.totalSeats > 0 ? (loc.occupiedSeats / loc.totalSeats) * 100 : 0}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            ></div>
                                        </div>
                                        */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-info text-center" role="alert">
                            No locations found matching your criteria. Try adjusting your filters or search term.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationPage;