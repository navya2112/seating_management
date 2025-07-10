
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import buildingImage from '../assets/building.jpg';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const BuildingPage = () => {
//   const { locationName } = useParams();
//   const navigate = useNavigate();

//   const [roomWrappers, setRoomWrappers] = useState([]);
//   const [buildingNames, setBuildingNames] = useState([]);
//   const [buildingFloors, setBuildingFloors] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState('building');
//   const [order, setOrder] = useState('asc');
//   const [minSeats, setMinSeats] = useState('');
//   const [filterBuilding, setFilterBuilding] = useState('');
//   const [filterFloor, setFilterFloor] = useState('');

//   useEffect(() => {
//     fetchRoomWrappers();
//   }, [locationName]);

//   const fetchRoomWrappers = () => {
//     const capitalizedLocation =
//       locationName.charAt(0).toUpperCase() + locationName.slice(1).toLowerCase();

//     fetch(`http://localhost:8084/buildings/location?location=${capitalizedLocation}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setRoomWrappers(data);

//         const uniqueBuildings = new Set();
//         const floorsMap = {};

//         data.forEach((r) => {
//           const building = r.roomId.building;
//           const floor = r.roomId.floorNumber;

//           uniqueBuildings.add(building);
//           if (!floorsMap[building]) {
//             floorsMap[building] = new Set();
//           }
//           floorsMap[building].add(floor);
//         });

//         setBuildingNames(Array.from(uniqueBuildings));

//         const cleanedFloors = Object.fromEntries(
//           Object.entries(floorsMap).map(([b, set]) => [b, Array.from(set).sort((a, b) => a - b)])
//         );
//         setBuildingFloors(cleanedFloors);
//       })
//       .catch(() => alert('Failed to load rooms'));
//   };

//   const handleMinSeatFilter = () => {
//     if (!minSeats) return;
//     const filtered = roomWrappers.filter((r) => r.totalSeats >= parseInt(minSeats));
//     setRoomWrappers(filtered);
//   };

//   const handleLocationBuildingFloor = () => {
//     if (!filterBuilding || !filterFloor) return;
//     const filtered = roomWrappers.filter(
//       (r) =>
//         r.roomId.building === filterBuilding &&
//         r.roomId.floorNumber === parseInt(filterFloor)
//     );
//     setRoomWrappers(filtered);
//   };

//   const filteredResults = roomWrappers
//     .filter((r) =>
//       r.roomId.building.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .sort((a, b) => {
//       if (sortBy === 'seatCount') {
//         return order === 'asc' ? a.totalSeats - b.totalSeats : b.totalSeats - a.totalSeats;
//       } else {
//         return order === 'asc'
//           ? a.roomId.building.localeCompare(b.roomId.building)
//           : b.roomId.building.localeCompare(a.roomId.building);
//       }
//     });

//   return (
//     <div className="container mt-4">
//       <div className="d-flex align-items-center mb-3">
//         <span
//           style={{ cursor: 'pointer', fontSize: '1.5rem' }}
//           onClick={() => navigate(`/location`)}
//         >
//           ←
//         </span>
//         <h6 className="ms-3 mb-0">Back</h6>
//       </div>
//       <h4 className="mb-3 text-capitalize">{locationName} – Buildings</h4>

//       {/* Filters and Controls */}
//       <div className="border bg-light p-3 rounded mb-4">
//         <div className="row g-3 align-items-end">
//           <div className="col-md-3">
//             <label>🔎 Search Building</label>
//             <input
//               className="form-control"
//               placeholder="e.g., SDB1"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <div className="col-md-2">
//             <label>Sort By</label>
//             <select
//               className="form-select"
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//             >
//               <option value="building">Building</option>
//               <option value="seatCount">Seat Count</option>
//             </select>
//           </div>
//           <div className="col-md-2">
//             <label>Order</label>
//             <select
//               className="form-select"
//               value={order}
//               onChange={(e) => setOrder(e.target.value)}
//             >
//               <option value="asc">Asc</option>
//               <option value="desc">Desc</option>
//             </select>
//           </div>
//           <div className="col-md-2">
//             <button className="btn btn-outline-secondary w-100" onClick={fetchRoomWrappers}>
//               Reset
//             </button>
//           </div>
//         </div>

//         {/* Location filters */}
//         <div className="row mt-3 g-3 align-items-end">
//           <div className="col-md-3">
//             <label>Filter: Min Seats</label>
//             <input
//               type="number"
//               className="form-control"
//               value={minSeats}
//               onChange={(e) => setMinSeats(e.target.value)}
//             />
//           </div>
//           <div className="col-md-2">
//             <button className="btn btn-outline-primary w-100" onClick={handleMinSeatFilter}>
//               Apply
//             </button>
//           </div>
//           <div className="col-md-3">
//             <label>Building</label>
//             <select
//               className="form-select"
//               value={filterBuilding}
//               onChange={(e) => setFilterBuilding(e.target.value)}
//             >
//               <option value="">-- Select --</option>
//               {buildingNames.map((b) => (
//                 <option key={b} value={b}>
//                   {b}
//                 </option>
//               ))}
//             </select>
//           </div>
//           {filterBuilding && (
//             <div className="col-md-2">
//               <label>Floor</label>
//               <select
//                 className="form-select"
//                 value={filterFloor}
//                 onChange={(e) => setFilterFloor(e.target.value)}
//               >
//                 <option value="">-- Select --</option>
//                 {buildingFloors[filterBuilding]?.map((f) => (
//                   <option key={f} value={f}>
//                     {f}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//           <div className="col-md-2">
//             <button
//               className="btn btn-outline-primary w-100"
//               onClick={handleLocationBuildingFloor}
//             >
//               Apply
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Cards */}
//       <div className="row">
//         {filteredResults.length === 0 && (
//           <p className="text-muted">No rooms found matching the criteria.</p>
//         )}
//         {filteredResults.map((room, idx) => (
//           <div className="col-md-4 mb-4" key={`${room.roomId.building}-${idx}`}>
//             <div
//               className="card shadow-sm h-100"
//               onClick={() =>
//                 navigate(`/location/${room.roomId.location}/${room.roomId.building}`)
//               }
//               style={{ cursor: 'pointer' }}
//             >
//               <img src={buildingImage} className="card-img-top" alt={room.roomId.building} />
//               <div className="card-body">
//                 <h6 className="card-title text-center fw-bold">{room.roomId.building}</h6>
//                 <p className="card-text" style={{ fontSize: '0.9rem' }}>
//                   Floor: {room.roomId.floorNumber}
//                   <br />
//                   Room No: {room.roomId.roomNumber}
//                   <br />
//                   Seats: {room.totalSeats}
//                   <br />
//                   Occupied: {room.occupiedSeats}
//                   <br />
//                   Occupancy:{" "}
//                   {room.totalSeats > 0
//                     ? ((room.occupiedSeats / room.totalSeats) * 100).toFixed(1)
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

// export default BuildingPage;
// import React, { useEffect, useState, useCallback } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import buildingImage from '../assets/building.jpg';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const API_BASE_URL = 'http://localhost:8084';

// const BuildingPage = () => {
//   const { locationName } = useParams();
//   const navigate = useNavigate();

//   const [allRoomWrappers, setAllRoomWrappers] = useState([]); // Stores original fetched data
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState('building'); // 'building' or 'seatCount'
//   const [order, setOrder] = useState('asc');     // 'asc' or 'desc'
//   const [minSeatsFilter, setMinSeatsFilter] = useState(''); // Changed to minSeatsFilter to avoid confusion with sortBy
//   const [filterBuilding, setFilterBuilding] = useState('');
//   const [filterFloor, setFilterFloor] = useState('');

//   // Derived state for unique building names and their floors
//   const [uniqueBuildingNames, setUniqueBuildingNames] = useState([]);
//   const [buildingFloorMap, setBuildingFloorMap] = useState({});

//   const fetchRoomWrappers = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     const capitalizedLocation =
//       locationName.charAt(0).toUpperCase() + locationName.slice(1).toLowerCase();

//     try {
//       const res = await fetch(`${API_BASE_URL}/buildings/location?location=${capitalizedLocation}`);
//       if (!res.ok) {
//         const message = await res.text();
        
//         throw new Error(`HTTP error! Status: ${res.status}, Message: ${message}`);
//       }
//       const data = await res.json();
//       setAllRoomWrappers(data);

//       const uniqueBuildings = new Set();
//       const floorsMap = {};

//       data.forEach((r) => {
//         const building = r.roomId.building;
//         const floor = r.roomId.floorNumber;

//         uniqueBuildings.add(building);
//         if (!floorsMap[building]) {
//           floorsMap[building] = new Set();
//         }
//         floorsMap[building].add(floor);
//       });

//       setUniqueBuildingNames(Array.from(uniqueBuildings));
//       const cleanedFloors = Object.fromEntries(
//         Object.entries(floorsMap).map(([b, set]) => [b, Array.from(set).sort((a, b) => a - b)])
//       );
//       setBuildingFloorMap(cleanedFloors);

//     } catch (err) {
//       console.error("Error fetching rooms:", err);
//       setError("Failed to load rooms: " + err.message);
//       setAllRoomWrappers([]); // Clear on error
//     } finally {
//       setLoading(false);
//     }
//   }, [locationName]);

//   useEffect(() => {
//     fetchRoomWrappers();
//   }, [fetchRoomWrappers]);

//   // Derived state for aggregated building data
//   const aggregatedBuildingData = useCallback(() => {
//     const aggregated = {};
//     allRoomWrappers.forEach(room => {
//       const building = room.roomId.building;
//       if (!aggregated[building]) {
//         aggregated[building] = {
//           location: room.roomId.location,
//           building: building,
//           totalSeats: 0,
//           occupiedSeats: 0,
//           roomCount: 0 // Track number of rooms in this building
//         };
//       }
//       aggregated[building].totalSeats += room.totalSeats;
//       aggregated[building].occupiedSeats += room.occupiedSeats;
//       aggregated[building].roomCount += 1;
//     });
//     return Object.values(aggregated);
//   }, [allRoomWrappers]);

//   // Apply all filters and sorts
//   const filteredAndSortedBuildings = useCallback(() => {
//     let currentBuildings = aggregatedBuildingData();

//     // 1. Search filter
//     if (searchTerm) {
//       currentBuildings = currentBuildings.filter((b) =>
//         b.building.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // 2. Min Seats filter
//     if (minSeatsFilter !== '') {
//       const min = parseInt(minSeatsFilter, 10);
//       if (!isNaN(min)) {
//         currentBuildings = currentBuildings.filter((b) => b.totalSeats >= min);
//       }
//     }

//     // 3. Building/Floor filter (this is tricky as `aggregatedBuildingData` aggregates across floors.
//     // If you want to filter specific rooms by building/floor, you'd need to go back to `allRoomWrappers`
//     // and then aggregate those specific rooms. For now, this will filter the aggregated buildings.
//     // A more precise filter would show *only* rooms matching these criteria, then aggregate those.
//     // For the current structure, let's assume filtering the aggregated buildings by building name means
//     // showing *only* that building, and floor filtering isn't directly applicable to a building aggregate.
//     // If you need to show aggregated data for *only* rooms on a specific floor within a building,
//     // you'd need a different aggregation approach here.)
//     if (filterBuilding) {
//       currentBuildings = currentBuildings.filter(b => b.building === filterBuilding);
//     }
//     // Note: filterFloor is harder to apply to *aggregated building data* directly.
//     // If a building has multiple floors, filtering by one floor means showing rooms on that floor, not the whole building.
//     // The current UI might imply you filter the *list of buildings* by the rooms they contain on a specific floor.
//     // For now, let's omit `filterFloor` from the aggregated view, as it implies drilling down to rooms.
//     // If the requirement is to show the *sum of seats on a particular floor*, that would require re-aggregating `allRoomWrappers` based on that filter.

//     // 4. Sort
//     currentBuildings.sort((a, b) => {
//       if (sortBy === 'seatCount') {
//         return order === 'asc' ? a.totalSeats - b.totalSeats : b.totalSeats - a.totalSeats;
//       } else { // sortBy === 'building'
//         return order === 'asc'
//           ? a.building.localeCompare(b.building)
//           : b.building.localeCompare(a.building);
//       }
//     });

//     return currentBuildings;
//   }, [allRoomWrappers, searchTerm, minSeatsFilter, filterBuilding, sortBy, order, aggregatedBuildingData]);


//   const handleClearFilters = () => {
//     setSearchTerm('');
//     setSortBy('building');
//     setOrder('asc');
//     setMinSeatsFilter('');
//     setFilterBuilding('');
//     setFilterFloor('');
//     // fetchRoomWrappers will rerun due to useEffect if dependencies change,
//     // or you can explicitly call it if clearing requires re-fetching from source.
//     // Since all filters are applied client-side on allRoomWrappers, simply resetting states is enough.
//   };

//   return (
//     <div className="container mt-4">
//       <div className="d-flex align-items-center mb-3">
//         <span
//           style={{ cursor: 'pointer', fontSize: '1.5rem' }}
//           onClick={() => navigate(`/location`)}
//         >
//           ←
//         </span>
//         <h6 className="ms-3 mb-0">Back to Locations</h6>
//       </div>
//       <h4 className="mb-3 text-capitalize">{locationName} – Buildings</h4>

//       {/* Filters and Controls */}
//       <div className="border bg-light p-3 rounded mb-4">
//         <div className="row g-3 align-items-end">
//           <div className="col-md-3">
//             <label htmlFor="searchBuilding">🔎 Search Building</label>
//             <input
//               id="searchBuilding"
//               className="form-control"
//               placeholder="e.g., SDB1"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <div className="col-md-2">
//             <label htmlFor="sortBySelect">Sort By</label>
//             <select
//               id="sortBySelect"
//               className="form-select"
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//             >
//               <option value="building">Building</option>
//               <option value="seatCount">Total Seat Count</option>
//             </select>
//           </div>
//           <div className="col-md-2">
//             <label htmlFor="orderSelect">Order</label>
//             <select
//               id="orderSelect"
//               className="form-select"
//               value={order}
//               onChange={(e) => setOrder(e.target.value)}
//             >
//               <option value="asc">Ascending</option>
//               <option value="desc">Descending</option>
//             </select>
//           </div>
//           <div className="col-md-2">
//             <button className="btn btn-outline-secondary w-100" onClick={handleClearFilters}>
//               Reset Filters
//             </button>
//           </div>
//         </div>

//         <div className="row mt-3 g-3 align-items-end">
//           <div className="col-md-3">
//             <label htmlFor="minSeatsFilter">Filter: Min Total Seats</label>
//             <input
//               id="minSeatsFilter"
//               type="number"
//               className="form-control"
//               value={minSeatsFilter}
//               onChange={(e) => setMinSeatsFilter(e.target.value)}
//             />
//           </div>
//           <div className="col-md-3">
//             <label htmlFor="filterBuildingSelect">Filter by Building</label>
//             <select
//               id="filterBuildingSelect"
//               className="form-select"
//               value={filterBuilding}
//               onChange={(e) => {
//                 setFilterBuilding(e.target.value);
//                 setFilterFloor(''); // Reset floor when building changes
//               }}
//             >
//               <option value="">-- All Buildings --</option>
//               {uniqueBuildingNames.map((b) => (
//                 <option key={b} value={b}>
//                   {b}
//                 </option>
//               ))}
//             </select>
//           </div>
//           {filterBuilding && (
//             <div className="col-md-3">
//               <label htmlFor="filterFloorSelect">Filter by Floor (within {filterBuilding})</label>
//               <select
//                 id="filterFloorSelect"
//                 className="form-select"
//                 value={filterFloor}
//                 onChange={(e) => setFilterFloor(e.target.value)}
//               >
//                 <option value="">-- All Floors --</option>
//                 {buildingFloorMap[filterBuilding]?.map((f) => (
//                   <option key={f} value={f}>
//                     {f}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {loading && (
//         <div className="text-center">
//           <div className="spinner-border text-primary me-2" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           Loading buildings...
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-danger mt-3" role="alert">
//           {error}
//         </div>
//       )}

//       {/* Cards */}
//       <div className="row">
//         {!loading && !error && filteredAndSortedBuildings().length === 0 && (
//           <p className="text-muted">No buildings found matching the criteria.</p>
//         )}
//         {!loading && !error && filteredAndSortedBuildings().map((buildingAgg, idx) => (
//           <div className="col-md-4 mb-4" key={`${buildingAgg.building}-${idx}`}>
//             <div
//               className="card shadow-sm h-100"
//               onClick={() =>
//                 // Pass location and building name to RoomPage
//                 navigate(`/location/${locationName}/${buildingAgg.building}`)
//               }
//               style={{ cursor: 'pointer' }}
//             >
//               <img src={buildingImage} className="card-img-top" alt={buildingAgg.building} />
//               <div className="card-body">
//                 <h6 className="card-title text-center fw-bold">{buildingAgg.building}</h6>
//                 <p className="card-text" style={{ fontSize: '0.9rem' }}>
//                   Total Rooms: {buildingAgg.roomCount}
//                   <br />
//                   Total Seats: {buildingAgg.totalSeats}
//                   <br />
//                   Occupied Seats: {buildingAgg.occupiedSeats}
//                   <br />
//                   Vacant Seats: {buildingAgg.totalSeats - buildingAgg.occupiedSeats}
//                   <br />
//                   Occupancy:{" "}
//                   {buildingAgg.totalSeats > 0
//                     ? ((buildingAgg.occupiedSeats / buildingAgg.totalSeats) * 100).toFixed(1)
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

// export default BuildingPage;













// import React, { useEffect, useState, useCallback } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import buildingImage from '../assets/building.jpg';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const API_BASE_URL = 'http://localhost:8084';

// const BuildingPage = () => {
//     const { locationName } = useParams();
//     const navigate = useNavigate();

//     const [allRoomWrappers, setAllRoomWrappers] = useState([]); // Stores original fetched data
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const [searchTerm, setSearchTerm] = useState('');
//     const [sortBy, setSortBy] = useState('building'); // 'building' or 'seatCount'
//     const [order, setOrder] = useState('asc');       // 'asc' or 'desc'
//     const [minVacantSeatsFilter, setMinVacantSeatsFilter] = useState(''); // Changed to minVacantSeatsFilter
//     const [filterBuilding, setFilterBuilding] = useState('');
//     const [filterFloor, setFilterFloor] = useState('');

//     // Derived state for unique building names and their floors
//     const [uniqueBuildingNames, setUniqueBuildingNames] = useState([]);
//     const [buildingFloorMap, setBuildingFloorMap] = useState({});

//     const fetchRoomWrappers = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         const capitalizedLocation =
//             locationName.charAt(0).toUpperCase() + locationName.slice(1).toLowerCase();

//         try {
//             const res = await fetch(`${API_BASE_URL}/buildings/location?location=${capitalizedLocation}`);
//             if (!res.ok) {
//                 const message = await res.text();

//                 throw new Error(`HTTP error! Status: ${res.status}, Message: ${message}`);
//             }
//             const data = await res.json();
//             setAllRoomWrappers(data);

//             const uniqueBuildings = new Set();
//             const floorsMap = {};

//             data.forEach((r) => {
//                 const building = r.roomId.building;
//                 const floor = r.roomId.floorNumber;

//                 uniqueBuildings.add(building);
//                 if (!floorsMap[building]) {
//                     floorsMap[building] = new Set();
//                 }
//                 floorsMap[building].add(floor);
//             });

//             setUniqueBuildingNames(Array.from(uniqueBuildings));
//             const cleanedFloors = Object.fromEntries(
//                 Object.entries(floorsMap).map(([b, set]) => [b, Array.from(set).sort((a, b) => a - b)])
//             );
//             setBuildingFloorMap(cleanedFloors);

//         } catch (err) {
//             console.error("Error fetching rooms:", err);
//             setError("Failed to load rooms: " + err.message);
//             setAllRoomWrappers([]); // Clear on error
//         } finally {
//             setLoading(false);
//         }
//     }, [locationName]);

//     useEffect(() => {
//         fetchRoomWrappers();
//     }, [fetchRoomWrappers]);

//     // Derived state for aggregated building data
//     const aggregatedBuildingData = useCallback(() => {
//         const aggregated = {};
//         allRoomWrappers.forEach(room => {
//             const building = room.roomId.building;
//             if (!aggregated[building]) {
//                 aggregated[building] = {
//                     location: room.roomId.location,
//                     building: building,
//                     totalSeats: 0,
//                     occupiedSeats: 0,
//                     roomCount: 0 // Track number of rooms in this building
//                 };
//             }
//             aggregated[building].totalSeats += room.totalSeats;
//             aggregated[building].occupiedSeats += room.occupiedSeats;
//             aggregated[building].roomCount += 1;
//         });
//         return Object.values(aggregated);
//     }, [allRoomWrappers]);

//     // Apply all filters and sorts
//     const filteredAndSortedBuildings = useCallback(() => {
//         let currentBuildings = aggregatedBuildingData();

//         // 1. Search filter
//         if (searchTerm) {
//             currentBuildings = currentBuildings.filter((b) =>
//                 b.building.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }

//         // 2. Min Vacant Seats filter (MODIFIED)
//         if (minVacantSeatsFilter !== '') {
//             const min = parseInt(minVacantSeatsFilter, 10);
//             if (!isNaN(min)) {
//                 currentBuildings = currentBuildings.filter((b) => (b.totalSeats - b.occupiedSeats) >= min);
//             }
//         }

//         // 3. Building/Floor filter
//         if (filterBuilding) {
//             currentBuildings = currentBuildings.filter(b => b.building === filterBuilding);
//         }
//         // Note: filterFloor is still difficult to apply directly to *aggregated building data*.
//         // If you need to show aggregated data for *only* rooms on a specific floor within a building,
//         // you'd need a different aggregation approach where you first filter rooms by floor,
//         // then aggregate those filtered rooms into a building sum.
//         // For the current UI, if a building is selected, the floor dropdown helps in understanding
//         // what floors are available in that building, but the *aggregation* itself
//         // still represents the whole building.
//         // If the intent is to show buildings that *contain* rooms on a specific floor,
//         // this `filterFloor` logic needs to be revisited, likely by re-aggregating `allRoomWrappers`
//         // after filtering by building and floor. For now, it remains commented out for aggregated view.


//         // 4. Sort
//         currentBuildings.sort((a, b) => {
//             if (sortBy === 'seatCount') {
//                 return order === 'asc' ? a.totalSeats - b.totalSeats : b.totalSeats - a.totalSeats;
//             } else { // sortBy === 'building'
//                 return order === 'asc'
//                     ? a.building.localeCompare(b.building)
//                     : b.building.localeCompare(a.building);
//             }
//         });

//         return currentBuildings;
//     }, [allRoomWrappers, searchTerm, minVacantSeatsFilter, filterBuilding, sortBy, order, aggregatedBuildingData]); // Updated dependency

//     const handleClearFilters = () => {
//         setSearchTerm('');
//         setSortBy('building');
//         setOrder('asc');
//         setMinVacantSeatsFilter(''); // Changed
//         setFilterBuilding('');
//         setFilterFloor('');
//     };

//     return (
//         <div className="container mt-4">
//             <div className="d-flex align-items-center mb-3">
//                 <span
//                     style={{ cursor: 'pointer', fontSize: '1.5rem' }}
//                     onClick={() => navigate(`/location`)}
//                 >
//                     ←
//                 </span>
//                 <h6 className="ms-3 mb-0">Back to Locations</h6>
//             </div>
//             <h4 className="mb-3 text-capitalize">{locationName} – Buildings</h4>

//             {/* Filters and Controls */}
//             <div className="border bg-light p-3 rounded mb-4">
//                 <div className="row g-3 align-items-end">
//                     <div className="col-md-3">
//                         <label htmlFor="searchBuilding">🔎 Search Building</label>
//                         <input
//                             id="searchBuilding"
//                             className="form-control"
//                             placeholder="e.g., SDB1"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>
//                     <div className="col-md-2">
//                         <label htmlFor="sortBySelect">Sort By</label>
//                         <select
//                             id="sortBySelect"
//                             className="form-select"
//                             value={sortBy}
//                             onChange={(e) => setSortBy(e.target.value)}
//                         >
//                             <option value="building">Building</option>
//                             <option value="seatCount">Total Seat Count</option>
//                         </select>
//                     </div>
//                     <div className="col-md-2">
//                         <label htmlFor="orderSelect">Order</label>
//                         <select
//                             id="orderSelect"
//                             className="form-select"
//                             value={order}
//                             onChange={(e) => setOrder(e.target.value)}
//                         >
//                             <option value="asc">Ascending</option>
//                             <option value="desc">Descending</option>
//                         </select>
//                     </div>
//                     <div className="col-md-2">
//                         <button className="btn btn-outline-secondary w-100" onClick={handleClearFilters}>
//                             Reset Filters
//                         </button>
//                     </div>
//                 </div>

//                 <div className="row mt-3 g-3 align-items-end">
//                     <div className="col-md-3">
//                         <label htmlFor="minVacantSeatsFilter">Filter: Min Vacant Seats</label> {/* MODIFIED LABEL */}
//                         <input
//                             id="minVacantSeatsFilter"
//                             type="number"
//                             className="form-control"
//                             value={minVacantSeatsFilter}
//                             onChange={(e) => setMinVacantSeatsFilter(e.target.value)} // MODIFIED STATE SETTER
//                             min="0" // Vacant seats cannot be negative
//                         />
//                     </div>
//                     <div className="col-md-3">
//                         <label htmlFor="filterBuildingSelect">Filter by Building</label>
//                         <select
//                             id="filterBuildingSelect"
//                             className="form-select"
//                             value={filterBuilding}
//                             onChange={(e) => {
//                                 setFilterBuilding(e.target.value);
//                                 setFilterFloor(''); // Reset floor when building changes
//                             }}
//                         >
//                             <option value="">-- All Buildings --</option>
//                             {uniqueBuildingNames.map((b) => (
//                                 <option key={b} value={b}>
//                                     {b}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     {filterBuilding && (
//                         <div className="col-md-3">
//                             <label htmlFor="filterFloorSelect">Filter by Floor (within {filterBuilding})</label>
//                             <select
//                                 id="filterFloorSelect"
//                                 className="form-select"
//                                 value={filterFloor}
//                                 onChange={(e) => setFilterFloor(e.target.value)}
//                             >
//                                 <option value="">-- All Floors --</option>
//                                 {buildingFloorMap[filterBuilding]?.map((f) => (
//                                     <option key={f} value={f}>
//                                         {f}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {loading && (
//                 <div className="text-center">
//                     <div className="spinner-border text-primary me-2" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                     Loading buildings...
//                 </div>
//             )}

//             {error && (
//                 <div className="alert alert-danger mt-3" role="alert">
//                     {error}
//                 </div>
//             )}

//             {/* Cards */}
//             <div className="row">
//                 {!loading && !error && filteredAndSortedBuildings().length === 0 && (
//                     <p className="text-muted">No buildings found matching the criteria.</p>
//                 )}
//                 {!loading && !error && filteredAndSortedBuildings().map((buildingAgg, idx) => (
//                     <div className="col-md-4 mb-4" key={`${buildingAgg.building}-${idx}`}>
//                         <div
//                             className="card shadow-sm h-100"
//                             onClick={() =>
//                                 // Pass location and building name to RoomPage
//                                 navigate(`/location/${locationName}/${buildingAgg.building}`)
//                             }
//                             style={{ cursor: 'pointer' }}
//                         >
//                             <img src={buildingImage} className="card-img-top" alt={buildingAgg.building} />
//                             <div className="card-body">
//                                 <h6 className="card-title text-center fw-bold">{buildingAgg.building}</h6>
//                                 <p className="card-text" style={{ fontSize: '0.9rem' }}>
//                                     Total Rooms: {buildingAgg.roomCount}
//                                     <br />
//                                     Total Seats: {buildingAgg.totalSeats}
//                                     <br />
//                                     Occupied Seats: {buildingAgg.occupiedSeats}
//                                     <br />
//                                     Vacant Seats: {buildingAgg.totalSeats - buildingAgg.occupiedSeats}
//                                     <br />
//                                     Occupancy:{" "}
//                                     {buildingAgg.totalSeats > 0
//                                         ? ((buildingAgg.occupiedSeats / buildingAgg.totalSeats) * 100).toFixed(1)
//                                         : 0}
//                                     %
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default BuildingPage;






// import React, { useEffect, useState, useCallback } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import buildingImage from '../assets/building.jpg';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const API_BASE_URL = 'http://localhost:8084';

// const BuildingPage = () => {
//     const { locationName } = useParams();
//     const navigate = useNavigate();

//     const [allRoomWrappers, setAllRoomWrappers] = useState([]); // Stores original fetched data
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const [searchTerm, setSearchTerm] = useState('');
//     const [sortBy, setSortBy] = useState('building'); // 'building' or 'vacantSeatCount' (CHANGED)
//     const [order, setOrder] = useState('asc');       // 'asc' or 'desc'
//     const [minVacantSeatsFilter, setMinVacantSeatsFilter] = useState('');

//     const [filterBuilding, setFilterBuilding] = useState('');
//     const [filterFloor, setFilterFloor] = useState('');

//     // Derived state for unique building names and their floors
//     const [uniqueBuildingNames, setUniqueBuildingNames] = useState([]);
//     const [buildingFloorMap, setBuildingFloorMap] = useState({});

//     const fetchRoomWrappers = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         const capitalizedLocation =
//             locationName.charAt(0).toUpperCase() + locationName.slice(1).toLowerCase();

//         try {
//             const res = await fetch(`${API_BASE_URL}/buildings/location?location=${capitalizedLocation}`);
//             if (!res.ok) {
//                 const message = await res.text();

//                 throw new Error(`HTTP error! Status: ${res.status}, Message: ${message}`);
//             }
//             const data = await res.json();
//             setAllRoomWrappers(data);

//             const uniqueBuildings = new Set();
//             const floorsMap = {};

//             data.forEach((r) => {
//                 const building = r.roomId.building;
//                 const floor = r.roomId.floorNumber;

//                 uniqueBuildings.add(building);
//                 if (!floorsMap[building]) {
//                     floorsMap[building] = new Set();
//                 }
//                 floorsMap[building].add(floor);
//             });

//             setUniqueBuildingNames(Array.from(uniqueBuildings));
//             const cleanedFloors = Object.fromEntries(
//                 Object.entries(floorsMap).map(([b, set]) => [b, Array.from(set).sort((a, b) => a - b)])
//             );
//             setBuildingFloorMap(cleanedFloors);

//         } catch (err) {
//             console.error("Error fetching rooms:", err);
//             setError("Failed to load rooms: " + err.message);
//             setAllRoomWrappers([]); // Clear on error
//         } finally {
//             setLoading(false);
//         }
//     }, [locationName]);

//     useEffect(() => {
//         fetchRoomWrappers();
//     }, [fetchRoomWrappers]);

//     // Derived state for aggregated building data
//     const aggregatedBuildingData = useCallback(() => {
//         const aggregated = {};
//         allRoomWrappers.forEach(room => {
//             const building = room.roomId.building;
//             if (!aggregated[building]) {
//                 aggregated[building] = {
//                     location: room.roomId.location,
//                     building: building,
//                     totalSeats: 0,
//                     occupiedSeats: 0,
//                     roomCount: 0, // Track number of rooms in this building
//                     vacantSeats: 0 // Added vacantSeats for easier sorting/filtering
//                 };
//             }
//             aggregated[building].totalSeats += room.totalSeats;
//             aggregated[building].occupiedSeats += room.occupiedSeats;
//             aggregated[building].roomCount += 1;
//             // Calculate vacant seats during aggregation
//             aggregated[building].vacantSeats = aggregated[building].totalSeats - aggregated[building].occupiedSeats;
//         });
//         return Object.values(aggregated);
//     }, [allRoomWrappers]);

//     // Apply all filters and sorts
//     const filteredAndSortedBuildings = useCallback(() => {
//         let currentBuildings = aggregatedBuildingData();

//         // 1. Search filter
//         if (searchTerm) {
//             currentBuildings = currentBuildings.filter((b) =>
//                 b.building.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }

//         // 2. Min Vacant Seats filter
//         if (minVacantSeatsFilter !== '') {
//             const min = parseInt(minVacantSeatsFilter, 10);
//             if (!isNaN(min)) {
//                 currentBuildings = currentBuildings.filter((b) => b.vacantSeats >= min); // Used vacantSeats from aggregation
//             }
//         }

//         // 3. Building/Floor filter
//         if (filterBuilding) {
//             currentBuildings = currentBuildings.filter(b => b.building === filterBuilding);
//         }
//         // filterFloor is still not directly applicable to aggregated building data.

//         // 4. Sort (MODIFIED)
//         currentBuildings.sort((a, b) => {
//             if (sortBy === 'vacantSeatCount') { // CHANGED to 'vacantSeatCount'
//                 return order === 'asc' ? a.vacantSeats - b.vacantSeats : b.vacantSeats - a.vacantSeats; // Sort by vacantSeats
//             } else { // sortBy === 'building'
//                 return order === 'asc'
//                     ? a.building.localeCompare(b.building)
//                     : b.building.localeCompare(a.building);
//             }
//         });

//         return currentBuildings;
//     }, [allRoomWrappers, searchTerm, minVacantSeatsFilter, filterBuilding, sortBy, order, aggregatedBuildingData]);

//     const handleClearFilters = () => {
//         setSearchTerm('');
//         setSortBy('building');
//         setOrder('asc');
//         setMinVacantSeatsFilter('');
//         setFilterBuilding('');
//         setFilterFloor('');
//     };

//     return (
//         <div className="container mt-4">
//             <div className="d-flex align-items-center mb-3">
//                 <span
//                     style={{ cursor: 'pointer', fontSize: '1.5rem' }}
//                     onClick={() => navigate(`/location`)}
//                 >
//                     ←
//                 </span>
//                 <h6 className="ms-3 mb-0">Back to Locations</h6>
//             </div>
//             <h4 className="mb-3 text-capitalize">{locationName} – Buildings</h4>

//             {/* Filters and Controls */}
//             <div className="border bg-light p-3 rounded mb-4">
//                 <div className="row g-3 align-items-end">
//                     <div className="col-md-3">
//                         <label htmlFor="searchBuilding">🔎 Search Building</label>
//                         <input
//                             id="searchBuilding"
//                             className="form-control"
//                             placeholder="e.g., SDB1"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>
//                     <div className="col-md-2">
//                         <label htmlFor="sortBySelect">Sort By</label>
//                         <select
//                             id="sortBySelect"
//                             className="form-select"
//                             value={sortBy}
//                             onChange={(e) => setSortBy(e.target.value)}
//                         >
//                             <option value="building">Building</option>
//                             <option value="vacantSeatCount">Vacant Seat Count</option> {/* CHANGED OPTION TEXT AND VALUE */}
//                         </select>
//                     </div>
//                     <div className="col-md-2">
//                         <label htmlFor="orderSelect">Order</label>
//                         <select
//                             id="orderSelect"
//                             className="form-select"
//                             value={order}
//                             onChange={(e) => setOrder(e.target.value)}
//                         >
//                             <option value="asc">Ascending</option>
//                             <option value="desc">Descending</option>
//                         </select>
//                     </div>
//                     <div className="col-md-2">
//                         <button className="btn btn-outline-secondary w-100" onClick={handleClearFilters}>
//                             Reset Filters
//                         </button>
//                     </div>
//                 </div>

//                 <div className="row mt-3 g-3 align-items-end">
//                     <div className="col-md-3">
//                         <label htmlFor="minVacantSeatsFilter">Filter: Min Vacant Seats</label>
//                         <input
//                             id="minVacantSeatsFilter"
//                             type="number"
//                             className="form-control"
//                             value={minVacantSeatsFilter}
//                             onChange={(e) => setMinVacantSeatsFilter(e.target.value)}
//                             min="0"
//                         />
//                     </div>
//                     {/* <div className="col-md-3">
//                         <label htmlFor="filterBuildingSelect">Filter by Building</label>
//                         <select
//                             id="filterBuildingSelect"
//                             className="form-select"
//                             value={filterBuilding}
//                             onChange={(e) => {
//                                 setFilterBuilding(e.target.value);
//                                 setFilterFloor(''); // Reset floor when building changes
//                             }}
//                         >
//                             <option value="">-- All Buildings --</option>
//                             {uniqueBuildingNames.map((b) => (
//                                 <option key={b} value={b}>
//                                     {b}
//                                 </option>
//                             ))}
//                         </select>
//                     </div> */}
//                     {filterBuilding && (
//                         <div className="col-md-3">
//                             <label htmlFor="filterFloorSelect">Filter by Floor (within {filterBuilding})</label>
//                             <select
//                                 id="filterFloorSelect"
//                                 className="form-select"
//                                 value={filterFloor}
//                                 onChange={(e) => setFilterFloor(e.target.value)}
//                             >
//                                 <option value="">-- All Floors --</option>
//                                 {buildingFloorMap[filterBuilding]?.map((f) => (
//                                     <option key={f} value={f}>
//                                         {f}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {loading && (
//                 <div className="text-center">
//                     <div className="spinner-border text-primary me-2" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                     Loading buildings...
//                 </div>
//             )}

//             {error && (
//                 <div className="alert alert-danger mt-3" role="alert">
//                     {error}
//                 </div>
//             )}

//             {/* Cards */}
//             <div className="row">
//                 {!loading && !error && filteredAndSortedBuildings().length === 0 && (
//                     <p className="text-muted">No buildings found matching the criteria.</p>
//                 )}
//                 {!loading && !error && filteredAndSortedBuildings().map((buildingAgg, idx) => (
//                     <div className="col-md-4 mb-4" key={`${buildingAgg.building}-${idx}`}>
//                         <div
//                             className="card shadow-sm h-100"
//                             onClick={() =>
//                                 // Pass location and building name to RoomPage
//                                 navigate(`/location/${locationName}/${buildingAgg.building}`)
//                             }
//                             style={{ cursor: 'pointer' }}
//                         >
//                             <img src={buildingImage} className="card-img-top" alt={buildingAgg.building} />
//                             <div className="card-body">
//                                 <h6 className="card-title text-center fw-bold">{buildingAgg.building}</h6>
//                                 <p className="card-text" style={{ fontSize: '0.9rem' }}>
//                                     Total Rooms: {buildingAgg.roomCount}
//                                     <br />
//                                     Total Seats: {buildingAgg.totalSeats}
//                                     <br />
//                                     Occupied Seats: {buildingAgg.occupiedSeats}
//                                     <br />
//                                     Vacant Seats: {buildingAgg.vacantSeats} {/* Display vacant seats */}
//                                     <br />
//                                     Occupancy:{" "}
//                                     {buildingAgg.totalSeats > 0
//                                         ? ((buildingAgg.occupiedSeats / buildingAgg.totalSeats) * 100).toFixed(1)
//                                         : 0}
//                                     %
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default BuildingPage;








// import React, { useEffect, useState, useCallback } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import buildingImage from '../assets/building.jpg';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const API_BASE_URL = 'http://localhost:8084';

// const BuildingPage = () => {
//     const { locationName } = useParams();
//     const navigate = useNavigate();

//     const [allRoomWrappers, setAllRoomWrappers] = useState([]); // Stores original fetched data
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const [searchTerm, setSearchTerm] = useState('');
//     const [sortBy, setSortBy] = useState('building'); // 'building' or 'vacantSeatCount'
//     const [order, setOrder] = useState('asc');       // 'asc' or 'desc'
//     const [minVacantSeatsFilter, setMinVacantSeatsFilter] = useState('');

//     const [filterBuilding, setFilterBuilding] = useState('');
//     const [filterFloor, setFilterFloor] = useState('');

//     // Derived state for unique building names and their floors
//     const [uniqueBuildingNames, setUniqueBuildingNames] = useState([]);
//     const [buildingFloorMap, setBuildingFloorMap] = useState({});

//     const fetchRoomWrappers = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         const capitalizedLocation =
//             locationName.charAt(0).toUpperCase() + locationName.slice(1).toLowerCase();

//         try {
//             const res = await fetch(`${API_BASE_URL}/buildings/location?location=${capitalizedLocation}`);
//             if (!res.ok) {
//                 const message = await res.text();
//                 throw new Error(`HTTP error! Status: ${res.status}, Message: ${message}`);
//             }
//             const data = await res.json();
//             setAllRoomWrappers(data);

//             const uniqueBuildings = new Set();
//             const floorsMap = {};

//             data.forEach((r) => {
//                 const building = r.roomId.building;
//                 const floor = r.roomId.floorNumber;

//                 uniqueBuildings.add(building);
//                 if (!floorsMap[building]) {
//                     floorsMap[building] = new Set();
//                 }
//                 floorsMap[building].add(floor);
//             });

//             setUniqueBuildingNames(Array.from(uniqueBuildings));
//             const cleanedFloors = Object.fromEntries(
//                 Object.entries(floorsMap).map(([b, set]) => [b, Array.from(set).sort((a, b) => a - b)])
//             );
//             setBuildingFloorMap(cleanedFloors);

//         } catch (err) {
//             console.error("Error fetching rooms:", err);
//             setError("Failed to load rooms: " + err.message);
//             setAllRoomWrappers([]); // Clear on error
//         } finally {
//             setLoading(false);
//         }
//     }, [locationName]);

//     useEffect(() => {
//         fetchRoomWrappers();
//     }, [fetchRoomWrappers]);

//     // Derived state for aggregated building data
//     const aggregatedBuildingData = useCallback(() => {
//         const aggregated = {};
//         allRoomWrappers.forEach(room => {
//             const building = room.roomId.building;
//             if (!aggregated[building]) {
//                 aggregated[building] = {
//                     location: room.roomId.location,
//                     building: building,
//                     totalSeats: 0,
//                     occupiedSeats: 0,
//                     roomCount: 0, // Track number of rooms in this building
//                     vacantSeats: 0 // Added vacantSeats for easier sorting/filtering
//                 };
//             }
//             aggregated[building].totalSeats += room.totalSeats;
//             aggregated[building].occupiedSeats += room.occupiedSeats;
//             aggregated[building].roomCount += 1;
//             // Calculate vacant seats during aggregation
//             aggregated[building].vacantSeats = aggregated[building].totalSeats - aggregated[building].occupiedSeats;
//         });
//         return Object.values(aggregated);
//     }, [allRoomWrappers]);

//     // Apply all filters and sorts
//     const filteredAndSortedBuildings = useCallback(() => {
//         let currentBuildings = aggregatedBuildingData();

//         // 1. Search filter
//         if (searchTerm) {
//             currentBuildings = currentBuildings.filter((b) =>
//                 b.building.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }

//         // 2. Min Vacant Seats filter
//         if (minVacantSeatsFilter !== '') {
//             const min = parseInt(minVacantSeatsFilter, 10);
//             if (!isNaN(min)) {
//                 currentBuildings = currentBuildings.filter((b) => b.vacantSeats >= min); // Used vacantSeats from aggregation
//             }
//         }

//         // 3. Building/Floor filter (Note: filterFloor is not directly applied to aggregated building data)
//         if (filterBuilding) {
//             currentBuildings = currentBuildings.filter(b => b.building === filterBuilding);
//         }


//         // 4. Sort
//         currentBuildings.sort((a, b) => {
//             if (sortBy === 'vacantSeatCount') {
//                 return order === 'asc' ? a.vacantSeats - b.vacantSeats : b.vacantSeats - a.vacantSeats; // Sort by vacantSeats
//             } else { // sortBy === 'building'
//                 return order === 'asc'
//                     ? a.building.localeCompare(b.building)
//                     : b.building.localeCompare(a.building);
//             }
//         });

//         return currentBuildings;
//     }, [allRoomWrappers, searchTerm, minVacantSeatsFilter, filterBuilding, sortBy, order, aggregatedBuildingData]);

//     const handleClearFilters = () => {
//         setSearchTerm('');
//         setSortBy('building');
//         setOrder('asc');
//         setMinVacantSeatsFilter('');
//         setFilterBuilding('');
//         setFilterFloor('');
//     };

//     return (
//         <div className="container mt-4">
//             {/* Inline Style Block for lift-on-hover */}
//             <style jsx>{`
//                 .lift-on-hover {
//                     transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
//                 }

//                 .lift-on-hover:hover {
//                     transform: translateY(-5px); /* Lifts the card slightly */
//                     box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important; /* Larger shadow */
//                 }
//             `}</style>

//             {/* Header with Title (similar to LocationPage) */}
//             <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
//                 <h3 className="text-dark fw-bold mb-0 text-capitalize">
//                     <i className="bi bi-building me-2"></i>{locationName} Buildings
//                 </h3>
//                 {/* Removed "Back to Locations" button as requested */}
//             </div>

//             {/* Filters and Controls (similar to LocationPage's filter section) */}
//             <div className="card shadow-sm mb-4">
//                 <div className="card-body">
//                     <div className="row g-3 align-items-end">
//                         <div className="col-md-5 col-lg-4">
//                             <label htmlFor="searchBuilding" className="form-label text-muted small mb-1">Search Building</label>
//                             <input
//                                 id="searchBuilding"
//                                 className="form-control"
//                                 placeholder="e.g., SDB1"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//                         <div className="col-md-4 col-lg-3">
//                             <label htmlFor="sortBySelect" className="form-label text-muted small mb-1">Sort By</label>
//                             <select
//                                 id="sortBySelect"
//                                 className="form-select"
//                                 value={sortBy}
//                                 onChange={(e) => setSortBy(e.target.value)}
//                             >
//                                 <option value="building">Building Name</option>
//                                 <option value="vacantSeatCount">Vacant Seats</option>
//                             </select>
//                         </div>
//                         <div className="col-md-3 col-lg-2">
//                             <label htmlFor="orderSelect" className="form-label text-muted small mb-1">Order</label>
//                             <select
//                                 id="orderSelect"
//                                 className="form-select"
//                                 value={order}
//                                 onChange={(e) => setOrder(e.target.value)}
//                             >
//                                 <option value="asc">Ascending</option>
//                                 <option value="desc">Descending</option>
//                             </select>
//                         </div>
//                         <div className="col-md-6 col-lg-3 d-grid gap-2">
//                             <label htmlFor="minVacantSeatsFilter" className="form-label text-muted small mb-1">Min Vacant Seats</label>
//                             <input
//                                 id="minVacantSeatsFilter"
//                                 type="number"
//                                 className="form-control"
//                                 placeholder="e.g., 5"
//                                 value={minVacantSeatsFilter}
//                                 onChange={(e) => setMinVacantSeatsFilter(e.target.value)}
//                                 min="0"
//                             />
//                         </div>
//                         {/* Removed Filter by Building/Floor dropdowns as they are not directly applicable to aggregated building cards */}
//                         {/* The original code had these commented out or conditionally rendered, keeping that behavior */}
//                         <div className="col-md-6 col-lg-2 d-grid gap-2">
//                             <button className="btn btn-outline-danger shadow-sm" onClick={handleClearFilters}>
//                                 <i className="bi bi-x-circle me-2"></i>Clear All
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {loading && (
//                 <div className="text-center py-5">
//                     <div className="spinner-border text-primary me-2" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                     <p className="mt-2 text-muted">Loading buildings for {locationName}...</p>
//                 </div>
//             )}

//             {error && (
//                 <div className="alert alert-danger mt-3" role="alert">
//                     {error}
//                 </div>
//             )}

//             {/* Building Cards (similar to LocationPage's card layout) */}
//             <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
//                 {!loading && !error && filteredAndSortedBuildings().length === 0 && (
//                     <div className="col-12">
//                         <div className="alert alert-info text-center" role="alert">
//                             No buildings found matching your criteria. Try adjusting your filters or search term.
//                         </div>
//                     </div>
//                 )}
//                 {!loading && !error && filteredAndSortedBuildings().map((buildingAgg, idx) => (
//                     <div className="col" key={`${buildingAgg.building}-${idx}`}>
//                         <div
//                             className="card h-100 shadow-sm border-0 lift-on-hover"
//                             style={{ cursor: 'pointer', borderRadius: '10px', overflow: 'hidden' }}
//                             onClick={() =>
//                                 navigate(`/location/${locationName}/${buildingAgg.building}`)
//                             }
//                         >
//                             <img
//                                 src={buildingImage}
//                                 className="card-img-top"
//                                 alt={buildingAgg.building}
//                                 style={{ height: '180px', objectFit: 'cover' }}
//                             />
//                             <div className="card-body d-flex flex-column justify-content-between">
//                                 <h5 className="card-title text-center fw-bold text-dark mb-3">
//                                     {buildingAgg.building}
//                                 </h5>
//                                 <ul className="list-group list-group-flush border-top border-bottom mb-3">
//                                     <li className="list-group-item d-flex justify-content-between align-items-center">
//                                         Total Rooms
//                                         <span className="badge bg-info rounded-pill">{buildingAgg.roomCount}</span>
//                                     </li>
//                                     <li className="list-group-item d-flex justify-content-between align-items-center">
//                                         Total Seats
//                                         <span className="badge bg-secondary rounded-pill">{buildingAgg.totalSeats}</span>
//                                     </li>
//                                     <li className="list-group-item d-flex justify-content-between align-items-center">
//                                         Occupied Seats
//                                         <span className="badge bg-warning rounded-pill">{buildingAgg.occupiedSeats}</span>
//                                     </li>
//                                     <li className="list-group-item d-flex justify-content-between align-items-center">
//                                         Vacant Seats
//                                         <span className="badge bg-success rounded-pill">{buildingAgg.vacantSeats}</span>
//                                     </li>
//                                 </ul>
//                                 <div className="text-center">
//                                     <p className="mb-0 fw-bold text-secondary">
//                                         Occupancy: <span className="text-dark">
//                                             {buildingAgg.totalSeats > 0
//                                                 ? ((buildingAgg.occupiedSeats / buildingAgg.totalSeats) * 100).toFixed(1)
//                                                 : 0}
//                                             %
//                                         </span>
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default BuildingPage;





import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import buildingImage from '../assets/building.jpg'; // Removed as image will be removed from cards
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'http://localhost:8084';

const BuildingPage = () => {
    const { locationName } = useParams();
    const navigate = useNavigate();

    const [allRoomWrappers, setAllRoomWrappers] = useState([]); // Stores original fetched data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('building'); // 'building' or 'vacantSeatCount'
    const [order, setOrder] = useState('asc');       // 'asc' or 'desc'
    const [minVacantSeatsFilter, setMinVacantSeatsFilter] = useState('');

    const [filterBuilding, setFilterBuilding] = useState('');
    const [filterFloor, setFilterFloor] = useState('');

    // Derived state for unique building names and their floors
    const [uniqueBuildingNames, setUniqueBuildingNames] = useState([]);
    const [buildingFloorMap, setBuildingFloorMap] = useState({});

    const fetchRoomWrappers = useCallback(async () => {
        setLoading(true);
        setError(null);
        const capitalizedLocation =
            locationName.charAt(0).toUpperCase() + locationName.slice(1).toLowerCase();

        try {
            const res = await fetch(`${API_BASE_URL}/buildings/location?location=${capitalizedLocation}`);
            if (!res.ok) {
                const message = await res.text();
                throw new Error(`HTTP error! Status: ${res.status}, Message: ${message}`);
            }
            const data = await res.json();
            setAllRoomWrappers(data);

            const uniqueBuildings = new Set();
            const floorsMap = {};

            data.forEach((r) => {
                const building = r.roomId.building;
                const floor = r.roomId.floorNumber;

                uniqueBuildings.add(building);
                if (!floorsMap[building]) {
                    floorsMap[building] = new Set();
                }
                floorsMap[building].add(floor);
            });

            setUniqueBuildingNames(Array.from(uniqueBuildings));
            const cleanedFloors = Object.fromEntries(
                Object.entries(floorsMap).map(([b, set]) => [b, Array.from(set).sort((a, b) => a - b)])
            );
            setBuildingFloorMap(cleanedFloors);

        } catch (err) {
            console.error("Error fetching rooms:", err);
            setError("Failed to load rooms: " + err.message);
            setAllRoomWrappers([]); // Clear on error
        } finally {
            setLoading(false);
        }
    }, [locationName]);

    useEffect(() => {
        fetchRoomWrappers();
    }, [fetchRoomWrappers]);

    // Derived state for aggregated building data
    const aggregatedBuildingData = useCallback(() => {
        const aggregated = {};
        allRoomWrappers.forEach(room => {
            const building = room.roomId.building;
            if (!aggregated[building]) {
                aggregated[building] = {
                    location: room.roomId.location,
                    building: building,
                    totalSeats: 0,
                    occupiedSeats: 0,
                    roomCount: 0, // Track number of rooms in this building
                    vacantSeats: 0 // Added vacantSeats for easier sorting/filtering
                };
            }
            aggregated[building].totalSeats += room.totalSeats;
            aggregated[building].occupiedSeats += room.occupiedSeats;
            aggregated[building].roomCount += 1;
            // Calculate vacant seats during aggregation
            aggregated[building].vacantSeats = aggregated[building].totalSeats - aggregated[building].occupiedSeats;
        });
        return Object.values(aggregated);
    }, [allRoomWrappers]);

    // Apply all filters and sorts
    const filteredAndSortedBuildings = useCallback(() => {
        let currentBuildings = aggregatedBuildingData();

        // 1. Search filter
        if (searchTerm) {
            currentBuildings = currentBuildings.filter((b) =>
                b.building.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. Min Vacant Seats filter
        if (minVacantSeatsFilter !== '') {
            const min = parseInt(minVacantSeatsFilter, 10);
            if (!isNaN(min)) {
                currentBuildings = currentBuildings.filter((b) => b.vacantSeats >= min); // Used vacantSeats from aggregation
            }
        }

        // 3. Building/Floor filter (Note: filterFloor is not directly applied to aggregated building data)
        if (filterBuilding) {
            currentBuildings = currentBuildings.filter(b => b.building === filterBuilding);
        }


        // 4. Sort
        currentBuildings.sort((a, b) => {
            if (sortBy === 'vacantSeatCount') {
                return order === 'asc' ? a.vacantSeats - b.vacantSeats : b.vacantSeats - a.vacantSeats; // Sort by vacantSeats
            } else { // sortBy === 'building'
                return order === 'asc'
                    ? a.building.localeCompare(b.building)
                    : b.building.localeCompare(a.building);
            }
        });

        return currentBuildings;
    }, [allRoomWrappers, searchTerm, minVacantSeatsFilter, filterBuilding, sortBy, order, aggregatedBuildingData]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setSortBy('building');
        setOrder('asc');
        setMinVacantSeatsFilter('');
        setFilterBuilding('');
        setFilterFloor('');
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

            {/* Header with Title (similar to LocationPage) */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h3 className="text-dark fw-bold mb-0 text-capitalize">
                    <i className="bi bi-building me-2"></i>{locationName} Buildings
                </h3>
            </div>

            {/* Filters and Controls (all in one row) */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-12 col-md-6 col-lg-3">
                            <label htmlFor="searchBuilding" className="form-label text-muted small mb-1">Search Building</label>
                            <input
                                id="searchBuilding"
                                className="form-control"
                                placeholder="e.g., SDB1"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-2">
                            <label htmlFor="sortBySelect" className="form-label text-muted small mb-1">Sort By</label>
                            <select
                                id="sortBySelect"
                                className="form-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="building">Building Name</option>
                                <option value="vacantSeatCount">Vacant Seats</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-6 col-lg-2">
                            <label htmlFor="orderSelect" className="form-label text-muted small mb-1">Order</label>
                            <select
                                id="orderSelect"
                                className="form-select"
                                value={order}
                                onChange={(e) => setOrder(e.target.value)}
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <label htmlFor="minVacantSeatsFilter" className="form-label text-muted small mb-1">Min Vacant Seats</label>
                            <input
                                id="minVacantSeatsFilter"
                                type="number"
                                className="form-control"
                                placeholder="e.g., 5"
                                value={minVacantSeatsFilter}
                                onChange={(e) => setMinVacantSeatsFilter(e.target.value)}
                                min="0"
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-2 d-grid"> {/* Clear All button moved here */}
                            <button className="btn btn-outline-danger shadow-sm" onClick={handleClearFilters}>
                                <i className="bi bi-x-circle me-2"></i>Clear All
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading buildings for {locationName}...</p>
                </div>
            )}

            {error && (
                <div className="alert alert-danger mt-3" role="alert">
                    {error}
                </div>
            )}

            {/* Building Cards */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {!loading && !error && filteredAndSortedBuildings().length === 0 && (
                    <div className="col-12">
                        <div className="alert alert-info text-center" role="alert">
                            No buildings found matching your criteria. Try adjusting your filters or search term.
                        </div>
                    </div>
                )}
                {!loading && !error && filteredAndSortedBuildings().map((buildingAgg, idx) => (
                    <div className="col" key={`${buildingAgg.building}-${idx}`}>
                        <div
                            className="card h-100 shadow border-0 lift-on-hover bg-white" // Changed shadow-sm to shadow
                            style={{ cursor: 'pointer', borderRadius: '10px', overflow: 'hidden' }}
                            onClick={() =>
                                navigate(`/location/${locationName}/${buildingAgg.building}`)
                            }
                        >
                            {/* Removed the image tag */}
                            <div className="card-body d-flex flex-column justify-content-between">
                                <h5 className="card-title text-center fw-bold text-dark mb-3">
                                    {buildingAgg.building}
                                </h5>
                                <ul className="list-group list-group-flush border-top border-bottom mb-3">
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Total Rooms
                                        <span className="badge bg-info rounded-pill">{buildingAgg.roomCount}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Total Seats
                                        <span className="badge bg-secondary rounded-pill">{buildingAgg.totalSeats}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Occupied Seats
                                        <span className="badge bg-warning rounded-pill">{buildingAgg.occupiedSeats}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Vacant Seats
                                        <span className="badge bg-success rounded-pill">{buildingAgg.vacantSeats}</span>
                                    </li>
                                </ul>
                                <div className="text-center">
                                    <p className="mb-0 fw-bold text-secondary">
                                        Occupancy: <span className="text-dark">
                                            {buildingAgg.totalSeats > 0
                                                ? ((buildingAgg.occupiedSeats / buildingAgg.totalSeats) * 100).toFixed(1)
                                                : 0}
                                            %
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuildingPage;


