
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';

// const RoomViewPage = () => {
//   const navigate = useNavigate();
//   const { locationName, buildingName, roomType, roomNumber } = useParams();

//   const [roomWrapper, setRoomWrapper] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [removedSeats, setRemovedSeats] = useState([]);
//   const [occupiedSeats, setOccupiedSeats] = useState([]);
//   const [cohortData, setCohortData] = useState({
//     cohortCode: "",
//     inTrainingCount: 0,
//     graduatedCount: 0,
//     exitCount: 0,
//     trainingStartDate: "",
//     trainingEndDate: "",
//     dateOfJoining: "",
//     batchOwner: "",
//     sl: "",
//     practice: ""
//   });
  
//   const handleCohortChange = (e) => {
//     const { name, value } = e.target;
//     setCohortData(prev => ({ ...prev, [name]: value }));
//   };
  

//   useEffect(() => {
//     const fetchRoomDetails = async () => {
//       const parsedRoomNumber = parseInt(roomNumber);
//       if (!locationName || !buildingName || !roomType || isNaN(parsedRoomNumber)) {
//         setError("Invalid or missing route parameters.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const queryParams = new URLSearchParams({
//           location: locationName,
//           building: buildingName,
//           roomType,
//           roomNumber: parsedRoomNumber
//         });


//         const response = await fetch(`http://localhost:8084/api/rooms/view?${queryParams.toString()}`);
//         if (!response.ok) {
//           const text = await response.text();
//           throw new Error(`Room not found (${response.status}): ${text}`);
//         }

//         const data = await response.json();
//         setRoomWrapper(data);

//         const occupiedList = Array.from({ length: data.occupiedSeats }, (_, i) => i + 1);
//         setOccupiedSeats(occupiedList);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRoomDetails();
//   }, [locationName, buildingName, roomType, roomNumber]);

//   const toggleSeat = (seatNumber) => {
//     if (occupiedSeats.includes(seatNumber) || removedSeats.includes(seatNumber)) return;
//     setSelectedSeats((prev) =>
//       prev.includes(seatNumber)
//         ? prev.filter((n) => n !== seatNumber)
//         : [...prev, seatNumber]
//     );
//   };
  
//   const handleRemoveSeat = (seatNumber, e) => {
//     e.preventDefault();
//     if (occupiedSeats.includes(seatNumber)) return;
//     setRemovedSeats((prev) => (prev.includes(seatNumber) ? prev : [...prev, seatNumber]));
//     setSelectedSeats((prev) => prev.filter((n) => n !== seatNumber));
//   };
  
//   if (loading) return <div className="container mt-4">Loading room info...</div>;
//   if (error) return <div className="alert alert-danger mt-4">{error}</div>;
//   if (!roomWrapper) return <div className="alert alert-warning mt-4">No room data found.</div>;

//   const { roomId, totalSeats, occupiedSeats: backendOccupied } = roomWrapper;
//   const vacant = Math.max(totalSeats - backendOccupied - selectedSeats.length, 0);
//   const rows = Math.ceil(totalSeats / 6);

//   return (
//     <div className="container mt-4">
//       <button className="btn btn-sm btn-outline-secondary mb-3" onClick={() => navigate(-1)}>&larr; Back</button>
//       <h5 className="mb-3 text-primary">Room {roomId?.roomNumber} – {roomType}</h5>

//       <div className="row">
//         {/* Info Panel */}
//         <div className="col-md-6">
//           <ul className="list-group mb-4">
//             <li className="list-group-item"><strong>Location:</strong> {roomId?.location}</li>
//             <li className="list-group-item"><strong>Facility:</strong> {roomId?.facility}</li>
//             <li className="list-group-item"><strong>Building:</strong> {roomId?.building}</li>
//             <li className="list-group-item"><strong>Floor:</strong> {roomId?.floorNumber}</li>
//             <li className="list-group-item"><strong>Wing:</strong> {roomId?.wing}</li>
//             <li className="list-group-item"><strong>Total Seats:</strong> {totalSeats}</li>
//             <li className="list-group-item"><strong>Occupied:</strong> {backendOccupied}</li>
//             <li className="list-group-item"><strong>Remaining Available:</strong> {vacant}</li>
//           </ul>
//         </div>
        

        

//         {/* Seat Grid */}
//         <div className="col-md-6">
//           <h6 className="mb-3">Seating Layout</h6>
//           {Array.from({ length: rows }).map((_, rowIdx) => (
//             <div className="d-flex justify-content-center gap-2 mb-2" key={rowIdx}>
//               {Array.from({ length: 6 }).map((_, colIdx) => {
//                 const seatNumber = rowIdx * 6 + colIdx + 1;
//                 if (seatNumber > totalSeats) return null;

//                 const isOccupied = occupiedSeats.includes(seatNumber);
//                 const isRemoved = removedSeats.includes(seatNumber);
//                 const isSelected = selectedSeats.includes(seatNumber);

//                 let seatClass = "btn btn-sm ";
//                 if (isOccupied) seatClass += "btn-secondary";
//                 else if (isRemoved) seatClass += "btn-danger";
//                 else if (isSelected) seatClass += "btn-success";
//                 else seatClass += "btn-outline-secondary";

//                 const style = {
//                   width: "42px",
//                   height: "42px",
//                   marginRight: ((colIdx + 1) % 3 === 0) ? "20px" : "0"
//                 };

//                 return (
//                   <button
//                     key={seatNumber}
//                     className={seatClass}
//                     style={style}
//                     onClick={() => toggleSeat(seatNumber)}
//                     onContextMenu={(e) => handleRemoveSeat(seatNumber, e)}
//                     disabled={isOccupied}
//                     title={
//                       isOccupied
//                         ? `Seat ${seatNumber} (Occupied)`
//                         : isRemoved
//                         ? `Seat ${seatNumber} (Removed)`
//                         : isSelected
//                         ? `Seat ${seatNumber} (Selected)`
//                         : `Seat ${seatNumber}`
//                     }
//                   >
//                     {seatNumber}
//                   </button>
//                 );
//               })}
//             </div>
//           ))}

//           <p className="form-text mt-2">
//             🟩 Selected &nbsp; ❌ Removed &nbsp; ⬜ Available &nbsp; 🔘 Occupied
//           </p>
//           <p>
//             <strong>Selected:</strong> {selectedSeats.length} &nbsp;|&nbsp;
//             <strong>Removed:</strong> {removedSeats.length} &nbsp;|&nbsp;
//             <strong>Remaining Available:</strong> {vacant}
//           </p>



//           {/* <button
//             className="btn btn-primary mt-3"
//             onClick={() =>
//               navigate('/allocate-strategy', { state: { selectedSeats,cohortData } })
//             }
//           >
//             Allocate Seats
//           </button> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoomViewPage;
// import React, { useEffect, useState, useCallback } from 'react';
// import { useNavigate, useParams, useLocation } from 'react-router-dom'; // Added useLocation

// const API_BASE_URL = 'http://localhost:8084';

// const RoomViewPage = () => {
//   const navigate = useNavigate();
//   const { locationName, buildingName, roomType, roomNumber } = useParams();
//   const locationState = useLocation().state; // Access state passed from Link

//   const [roomWrapper, setRoomWrapper] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [removedSeats, setRemovedSeats] = useState([]);
//   const [occupiedSeats, setOccupiedSeats] = useState([]); // Seats that are already occupied per backend

//   const [cohortData, setCohortData] = useState(
//     locationState?.cohortData || { // Initialize from passed state or default
//       cohortCode: "",
//       inTrainingCount: 0,
//       graduatedCount: 0,
//       exitCount: 0,
//       trainingStartDate: "",
//       trainingEndDate: "",
//       dateOfJoining: "",
//       batchOwner: "",
//       sl: "",
//       practice: ""
//     }
//   );

//   const handleCohortChange = (e) => {
//     const { name, value } = e.target;
//     setCohortData(prev => ({ ...prev, [name]: value }));
//   };

//   // Map URL room types to formatted display types for UI and API calls
//   const roomTypeMap = {
//     'trainingroom': 'Training Room',
//     'modifiedodc': 'Modified ODC',
//     'odc(openodc)': 'ODC (open ODC)',
//     'conferenceroom': 'Conference Room',
//     'seminarhall': 'Seminar Hall',
//     'meetingroom': 'Meeting Room'
//   };

//   // Get the display-friendly room type title for UI and API
//   const apiAndDisplayRoomType = roomTypeMap[roomType ? roomType.toLowerCase() : ''] || roomType;


//   useEffect(() => {
//     const fetchRoomDetails = async () => {
//       const parsedRoomNumber = parseInt(roomNumber);
//       if (!locationName || !buildingName || !roomType || isNaN(parsedRoomNumber)) {
//         setError("Invalid or missing route parameters for room details.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const queryParams = new URLSearchParams({
//           location: encodeURIComponent(locationName),
//           building: encodeURIComponent(buildingName),
//           roomType: encodeURIComponent(apiAndDisplayRoomType), // Use the mapped type for API
//           roomNumber: encodeURIComponent(parsedRoomNumber) // Encode room number too
//         });

//         const response = await fetch(`${API_BASE_URL}/api/rooms/view?${queryParams.toString()}`);
//         if (!response.ok) {
//           const text = await response.text();
//           throw new Error(`Room not found (${response.status}): ${text || response.statusText}`);
//         }

//         const data = await response.json();
//         setRoomWrapper(data);

//         // Populate occupiedSeats from backend data
//         // Assuming backend returns a list of occupied seat numbers or similar
//         // If 'data.occupiedSeats' is just a count, you'll need another API to get actual seat numbers.
//         // For now, let's assume `data.occupiedSeatNumbers` is an array of numbers, or generate from count.
//         const initialOccupied = Array.from({ length: data.occupiedSeats }, (_, i) => i + 1); // This assumes first `occupiedSeats` are filled
//         // A more robust solution would be to get actual occupied seat numbers from backend if available.
//         setOccupiedSeats(initialOccupied);

//       } catch (err) {
//         console.error("Error fetching room details:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRoomDetails();
//   }, [locationName, buildingName, roomType, roomNumber, apiAndDisplayRoomType]); // Add apiAndDisplayRoomType to deps

//   const toggleSeat = (seatNumber) => {
//     // Cannot select an already occupied or removed seat
//     if (occupiedSeats.includes(seatNumber) || removedSeats.includes(seatNumber)) {
//         console.log(`Seat ${seatNumber} is occupied or removed. Cannot select.`);
//         return;
//     }
//     setSelectedSeats((prev) =>
//       prev.includes(seatNumber)
//         ? prev.filter((n) => n !== seatNumber) // Deselect
//         : [...prev, seatNumber].sort((a, b) => a - b) // Select and sort
//     );
//   };

//   const handleRemoveSeat = (seatNumber, e) => {
//     e.preventDefault(); // Prevent context menu from appearing
//     // Cannot remove an already occupied seat from the backend perspective
//     if (occupiedSeats.includes(seatNumber)) {
//         console.log(`Seat ${seatNumber} is permanently occupied. Cannot remove.`);
//         return;
//     }
//     setRemovedSeats((prev) =>
//       prev.includes(seatNumber)
//         ? prev.filter((n) => n !== seatNumber) // Un-remove
//         : [...prev, seatNumber].sort((a,b) => a-b) // Remove
//     );
//     setSelectedSeats((prev) => prev.filter((n) => n !== seatNumber)); // Ensure it's not also selected
//   };

//   if (loading) return <div className="container mt-4 text-center"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div><p>Loading room info...</p></div>;
//   if (error) return <div className="alert alert-danger mt-4"><strong>Error:</strong> {error}</div>;
//   if (!roomWrapper) return <div className="alert alert-warning mt-4">No room data found for Room {roomNumber}.</div>;

//   const { roomId, totalSeats, occupiedSeats: backendOccupiedCount } = roomWrapper;
//   // Calculate dynamically remaining vacant seats
//   const currentAvailable = totalSeats - backendOccupiedCount - selectedSeats.length - removedSeats.length;
//   const vacant = Math.max(currentAvailable, 0); // Ensure vacant is not negative

//   const rows = Math.ceil(totalSeats / 6); // Assuming 6 seats per row for layout

//   return (
//     <div className="container mt-4">
//       <button className="btn btn-sm btn-outline-secondary mb-3" onClick={() => navigate(-1)}>&larr; Back</button>
//       <h5 className="mb-3 text-primary">Room {roomId?.roomNumber} – {apiAndDisplayRoomType}</h5>

//       <div className="row">
//         {/* Info Panel */}
//         <div className="col-md-6">
//           <ul className="list-group mb-4">
//             <li className="list-group-item"><strong>Location:</strong> {roomId?.location}</li>
//             <li className="list-group-item"><strong>Facility:</strong> {roomId?.facility}</li>
//             <li className="list-group-item"><strong>Building:</strong> {roomId?.building}</li>
//             <li className="list-group-item"><strong>Floor:</strong> {roomId?.floorNumber}</li>
//             <li className="list-group-item"><strong>Wing:</strong> {roomId?.wing}</li>
//             <li className="list-group-item"><strong>Total Seats:</strong> {totalSeats}</li>
//             <li className="list-group-item"><strong>Occupied (Backend):</strong> {backendOccupiedCount}</li>
//             <li className="list-group-item"><strong>Currently Selected:</strong> {selectedSeats.length}</li>
//             <li className="list-group-item"><strong>Currently Removed:</strong> {removedSeats.length}</li>
//             <li className="list-group-item"><strong>Vacant (after current selections/removals):</strong> {vacant}</li>
//           </ul>
//         </div>

//         {/* Seat Grid */}
//         <div className="col-md-6">
//           <h6 className="mb-3">Seating Layout</h6>
//           {Array.from({ length: rows }).map((_, rowIdx) => (
//             <div className="d-flex justify-content-center gap-2 mb-2" key={rowIdx}>
//               {Array.from({ length: 6 }).map((_, colIdx) => {
//                 const seatNumber = rowIdx * 6 + colIdx + 1;
//                 if (seatNumber > totalSeats) return null; // Don't render seats beyond total capacity

//                 const isOccupiedByBackend = occupiedSeats.includes(seatNumber); // From backend
//                 const isRemovedLocally = removedSeats.includes(seatNumber); // User marked as removed
//                 const isSelectedLocally = selectedSeats.includes(seatNumber); // User marked as selected

//                 let seatClass = "btn btn-sm ";
//                 if (isOccupiedByBackend) seatClass += "btn-secondary"; // Already occupied
//                 else if (isRemovedLocally) seatClass += "btn-danger"; // Marked for removal (e.g., damaged)
//                 else if (isSelectedLocally) seatClass += "btn-success"; // Selected by user for allocation
//                 else seatClass += "btn-outline-secondary"; // Available

//                 const style = {
//                   width: "42px",
//                   height: "42px",
//                   marginRight: ((colIdx + 1) % 3 === 0) ? "20px" : "0" // Add gap after every 3 seats for visual grouping
//                 };

//                 return (
//                   <button
//                     key={seatNumber}
//                     className={seatClass}
//                     style={style}
//                     onClick={() => toggleSeat(seatNumber)}
//                     onContextMenu={(e) => handleRemoveSeat(seatNumber, e)} // Right-click to "remove"
//                     disabled={isOccupiedByBackend} // Cannot interact with already occupied seats
//                     title={
//                       isOccupiedByBackend
//                         ? `Seat ${seatNumber} (Occupied)`
//                         : isRemovedLocally
//                         ? `Seat ${seatNumber} (Marked Removed)`
//                         : isSelectedLocally
//                         ? `Seat ${seatNumber} (Selected for Allocation)`
//                         : `Seat ${seatNumber} (Available)`
//                     }
//                   >
//                     {seatNumber}
//                   </button>
//                 );
//               })}
//             </div>
//           ))}

//           <p className="form-text mt-2">
//             🟩 Selected &nbsp; ❌ Removed &nbsp; ⬜ Available &nbsp; 🔘 Occupied
//             <br/>
//             (Right-click an available seat to mark as Removed)
//           </p>
//           <p>
//             <strong>Selected:</strong> {selectedSeats.length} &nbsp;|&nbsp;
//             <strong>Removed (local):</strong> {removedSeats.length} &nbsp;|&nbsp;
//             <strong>Vacant (effective):</strong> {vacant}
//           </p>

//           {/* Cohort Data Form - for allocation */}
//           <h6 className="mt-4 mb-3">Cohort Details for Allocation</h6>
//           <form className="mb-4">
//             <div className="row g-2">
//               <div className="col-md-6 mb-2">
//                 <label className="form-label">Cohort Code</label>
//                 <input type="text" className="form-control" name="cohortCode" value={cohortData.cohortCode} onChange={handleCohortChange} />
//               </div>
//               <div className="col-md-6 mb-2">
//                 <label className="form-label">Batch Owner</label>
//                 <input type="text" className="form-control" name="batchOwner" value={cohortData.batchOwner} onChange={handleCohortChange} />
//               </div>
//               <div className="col-md-4 mb-2">
//                 <label className="form-label">In Training</label>
//                 <input type="number" className="form-control" name="inTrainingCount" value={cohortData.inTrainingCount} onChange={handleCohortChange} min="0" />
//               </div>
//               <div className="col-md-4 mb-2">
//                 <label className="form-label">Graduated</label>
//                 <input type="number" className="form-control" name="graduatedCount" value={cohortData.graduatedCount} onChange={handleCohortChange} min="0" />
//               </div>
//               <div className="col-md-4 mb-2">
//                 <label className="form-label">Exited</label>
//                 <input type="number" className="form-control" name="exitCount" value={cohortData.exitCount} onChange={handleCohortChange} min="0" />
//               </div>
//               <div className="col-md-6 mb-2">
//                 <label className="form-label">Training Start Date</label>
//                 <input type="date" className="form-control" name="trainingStartDate" value={cohortData.trainingStartDate} onChange={handleCohortChange} />
//               </div>
//               <div className="col-md-6 mb-2">
//                 <label className="form-label">Training End Date</label>
//                 <input type="date" className="form-control" name="trainingEndDate" value={cohortData.trainingEndDate} onChange={handleCohortChange} />
//               </div>
//               <div className="col-md-6 mb-2">
//                 <label className="form-label">Date of Joining</label>
//                 <input type="date" className="form-control" name="dateOfJoining" value={cohortData.dateOfJoining} onChange={handleCohortChange} />
//               </div>
//               <div className="col-md-6 mb-2">
//                 <label className="form-label">SL</label>
//                 <input type="text" className="form-control" name="sl" value={cohortData.sl} onChange={handleCohortChange} />
//               </div>
//               <div className="col-12 mb-2">
//                 <label className="form-label">Practice</label>
//                 <input type="text" className="form-control" name="practice" value={cohortData.practice} onChange={handleCohortChange} />
//               </div>
//             </div>
//           </form>

//           {/* Allocate Button */}
//           <button
//             className="btn btn-primary mt-3 w-100"
//             onClick={() =>
//               navigate('/allocate-strategy', {
//                 state: {
//                   selectedSeats,
//                   removedSeats, // Pass removed seats too if needed for backend processing
//                   roomDetails: roomWrapper, // Pass full room details
//                   cohortData // Pass cohort data
//                 }
//               })
//             }
//             disabled={selectedSeats.length === 0 && removedSeats.length === 0} // Disable if no seats selected or removed
//           >
//             Proceed to Allocate / Update Room
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoomViewPage;

// import React, { useEffect, useState, useCallback } from 'react';
// import { useNavigate, useParams, useLocation } from 'react-router-dom';

// const API_BASE_URL = 'http://localhost:8084'; // Ensure this matches your backend API URL

// const RoomViewPage = () => {
//   const navigate = useNavigate();
//   // useParams automatically decodes URL segments, so these are plain strings
//   const { locationName, buildingName, roomType, roomNumber } = useParams();
//   const locationState = useLocation().state; // Access state passed from Link (e.g., from SpecificRoom)

//   const [roomWrapper, setRoomWrapper] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedSeats, setSelectedSeats] = useState([]); // Seats the user wants to allocate
//   const [removedSeats, setRemovedSeats] = useState([]);   // Seats the user wants to mark as removed/damaged
//   const [occupiedSeats, setOccupiedSeats] = useState([]); // Seats marked as occupied by the backend

//   const [cohortData, setCohortData] = useState(
//     locationState?.cohortData || { // Initialize from passed state or default empty object
//       cohortCode: "",
//       inTrainingCount: 0,
//       graduatedCount: 0,
//       exitCount: 0,
//       trainingStartDate: "",
//       trainingEndDate: "",
//       dateOfJoining: "",
//       batchOwner: "",
//       sl: "",
//       practice: ""
//     }
//   );

//   const handleCohortChange = (e) => {
//     const { name, value } = e.target;
//     setCohortData(prev => ({ ...prev, [name]: value }));
//   };

//   // Map URL room types (slugified) to backend/display-friendly formatted names.
//   // This map should be consistent with the one used in RoomPage and SpecificRoom.
//   const roomTypeMap = {
//     'trainingroom': 'Training Room',
//     'modifiedodc': 'Modified ODC',
//     'odc(openodc)': 'ODC (open ODC)',
//     'conferenceroom': 'Conference Room',
//     'seminarhall': 'Seminar Hall',
//     'meetingroom': 'Meeting Room',
//     'odc-customtrs':'ODC-Custom TRs',
//     'videoconferenceroom':'Video Conference Room'
//     // Add any other room types as needed
//   };

//   // Get the room type string that should be sent to the backend and displayed.
//   // The `roomType` from `useParams` is already decoded (e.g., "odc(openodc)").
//   // We use this decoded value as a key for the `roomTypeMap`.
//   const apiAndDisplayRoomType = roomTypeMap[roomType?.toLowerCase()] || roomType;

//   // Use useCallback to memoize the fetch function to prevent unnecessary re-runs
//   const fetchRoomDetails = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     const parsedRoomNumber = parseInt(roomNumber);

//     // Basic validation of URL parameters
//     if (!locationName || !buildingName || !roomType || isNaN(parsedRoomNumber)) {
//       setError("Invalid or missing room identifier in URL.");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Create URLSearchParams.
//       // IMPORTANT: Pass the *decoded* parameter values directly.
//       // URLSearchParams will automatically apply encodeURIComponent internally
//       // when `.toString()` is called. This prevents double encoding.
//       const queryParams = new URLSearchParams({
//         location: locationName,
//         building: buildingName,
//         roomType: apiAndDisplayRoomType, // Use the mapped/formatted room type string
//         roomNumber: parsedRoomNumber,
//       });

//       const url = `${API_BASE_URL}/api/rooms/view?${queryParams.toString()}`;
//       console.log("Fetching room details from URL:", url); // For debugging: check the final URL

//       const response = await fetch(url);

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(`Room not found (${response.status}): ${text || response.statusText}`);
//       }

//       const data = await response.json();
//       console.log("Room details fetched:", data); // For debugging

//       setRoomWrapper(data);

//       // Initialize occupiedSeats from backend data.
//       // Assuming 'data.occupiedSeats' from the backend represents a COUNT.
//       // If your backend provides an array of specific occupied seat numbers (e.g., data.occupiedSeatNumbers: [1, 5, 6]),
//       // you should use that directly: `setOccupiedSeats(data.occupiedSeatNumbers || []);`
//       const initialOccupiedSeatList = Array.from({ length: data.occupiedSeats }, (_, i) => i + 1);
//       setOccupiedSeats(initialOccupiedSeatList);

//     } catch (err) {
//       console.error("Error fetching room details:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [locationName, buildingName, roomType, roomNumber, apiAndDisplayRoomType]); // Dependencies for useCallback

//   useEffect(() => {
//     fetchRoomDetails();
//   }, [fetchRoomDetails]); // Re-run when the memoized fetchRoomDetails changes (i.e., when its dependencies change)

//   // Toggles a seat's selection status for allocation
//   const toggleSeat = (seatNumber) => {
//     // Prevent selecting seats that are already occupied by backend or locally marked as removed
//     if (occupiedSeats.includes(seatNumber) || removedSeats.includes(seatNumber)) {
//         console.log(`Seat ${seatNumber} is occupied or marked removed. Cannot select.`);
//         return;
//     }
//     setSelectedSeats((prev) =>
//       prev.includes(seatNumber)
//         ? prev.filter((n) => n !== seatNumber) // Deselect the seat
//         : [...prev, seatNumber].sort((a, b) => a - b) // Select and sort for consistent display
//     );
//   };

//   // Handles right-click to mark a seat as "removed" (e.g., broken, not usable)
//   const handleRemoveSeat = (seatNumber, e) => {
//     e.preventDefault(); // Prevent default browser context menu on right-click

//     // Cannot mark as removed if it's already occupied by the backend
//     if (occupiedSeats.includes(seatNumber)) {
//         console.log(`Seat ${seatNumber} is permanently occupied. Cannot mark as removed.`);
//         return;
//     }

//     setRemovedSeats((prev) =>
//       prev.includes(seatNumber)
//         ? prev.filter((n) => n !== seatNumber) // Un-mark as removed
//         : [...prev, seatNumber].sort((a,b) => a-b) // Mark as removed and sort
//     );
//     setSelectedSeats((prev) => prev.filter((n) => n !== seatNumber)); // Ensure it's not also selected if being removed
//   };

//   // Display loading, error, or no data messages
//   if (loading) return (
//     <div className="container mt-4 text-center">
//       <div className="spinner-border text-primary" role="status">
//         <span className="visually-hidden">Loading...</span>
//       </div>
//       <p className="mt-2">Loading room information...</p>
//     </div>
//   );

//   if (error) return (
//     <div className="alert alert-danger mt-4 text-center">
//       <strong>Error:</strong> {error}
//     </div>
//   );

//   if (!roomWrapper) return (
//     <div className="alert alert-warning mt-4 text-center">
//       No room data found for Room {roomNumber}. Please check the URL or try again.
//     </div>
//   );

//   // Destructure relevant room details after data is loaded
//   const { roomId, totalSeats, occupiedSeats: backendOccupiedCount } = roomWrapper;

//   // Calculate current effective vacant seats
//   const currentAvailable = totalSeats - backendOccupiedCount - selectedSeats.length - removedSeats.length;
//   const vacant = Math.max(currentAvailable, 0); // Ensure vacant count doesn't go below zero

//   // Determine number of rows for the seating grid (assuming 6 seats per row)
//   const rows = Math.ceil(totalSeats / 6);

//   return (
//     <div className="container mt-4">
//       {/* Back Button */}
//       <button className="btn btn-sm btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
//         &larr; Back
//       </button>

//       {/* Room Title */}
//       <h5 className="mb-3 text-primary">
//         Room {roomId?.roomNumber} – {apiAndDisplayRoomType}
//       </h5>

//       <div className="row">
//         {/* Room Information Panel */}
//         <div className="col-md-6 mb-4">
//           <ul className="list-group shadow-sm">
//             <li className="list-group-item d-flex justify-content-between align-items-center">
//               <strong>Location:</strong> <span>{roomId?.location}</span>
//             </li>
//             <li className="list-group-item d-flex justify-content-between align-items-center">
//               <strong>Facility:</strong> <span>{roomId?.facility}</span>
//             </li>
//             <li className="list-group-item d-flex justify-content-between align-items-center">
//               <strong>Building:</strong> <span>{roomId?.building}</span>
//             </li>
//             <li className="list-group-item d-flex justify-content-between align-items-center">
//               <strong>Floor:</strong> <span>{roomId?.floorNumber}</span>
//             </li>
//             <li className="list-group-item d-flex justify-content-between align-items-center">
//               <strong>Wing:</strong> <span>{roomId?.wing}</span>
//             </li>
//             <li className="list-group-item d-flex justify-content-between align-items-center">
//               <strong>Total Seats:</strong> <span>{totalSeats}</span>
//             </li>
//             <li className="list-group-item d-flex justify-content-between align-items-center">
//               <strong>Occupied (Backend):</strong> <span>{backendOccupiedCount}</span>
//             </li>
//             <li className="list-group-item d-flex justify-content-between align-items-center">
//               <strong>Currently Selected:</strong> <span className="badge bg-success rounded-pill">{selectedSeats.length}</span>
//             </li>
//             <li className="list-group-item d-flex justify-content-between align-items-center">
//               <strong>Currently Marked Removed:</strong> <span className="badge bg-danger rounded-pill">{removedSeats.length}</span>
//             </li>
//             <li className="list-group-item d-flex justify-content-between align-items-center">
//               <strong>Vacant (Effective):</strong> <span className="badge bg-info text-dark rounded-pill">{vacant}</span>
//             </li>
//           </ul>
//         </div>

//         {/* Seat Grid & Legend */}
//         <div className="col-md-6 mb-4">
//           <h6 className="mb-3 text-center">Seating Layout</h6>
//           <div className="seat-grid-container border p-3 rounded shadow-sm bg-light">
//             {Array.from({ length: rows }).map((_, rowIdx) => (
//               <div className="d-flex justify-content-center gap-2 mb-2" key={rowIdx}>
//                 {Array.from({ length: 6 }).map((_, colIdx) => {
//                   const seatNumber = rowIdx * 6 + colIdx + 1;
//                   // Only render seats up to the total capacity
//                   if (seatNumber > totalSeats) return null;

//                   const isOccupiedByBackend = occupiedSeats.includes(seatNumber);
//                   const isRemovedLocally = removedSeats.includes(seatNumber);
//                   const isSelectedLocally = selectedSeats.includes(seatNumber);

//                   let seatClass = "btn btn-sm ";
//                   if (isOccupiedByBackend) seatClass += "btn-secondary opacity-75"; // Grey for occupied
//                   else if (isRemovedLocally) seatClass += "btn-danger"; // Red for removed
//                   else if (isSelectedLocally) seatClass += "btn-success"; // Green for selected
//                   else seatClass += "btn-outline-secondary"; // Border for available

//                   const seatStyle = {
//                     width: "45px", // Increased size slightly
//                     height: "45px",
//                     lineHeight: "35px", // Center text vertically
//                     marginRight: ((colIdx + 1) % 3 === 0 && colIdx !== 5) ? "15px" : "0", // Gap after every 3 seats, but not at end of row
//                     fontWeight: 'bold'
//                   };

//                   return (
//                     <button
//                       key={seatNumber}
//                       className={seatClass}
//                       style={seatStyle}
//                       onClick={() => toggleSeat(seatNumber)}
//                       onContextMenu={(e) => handleRemoveSeat(seatNumber, e)}
//                       disabled={isOccupiedByBackend} // Cannot interact with backend-occupied seats
//                       title={
//                         isOccupiedByBackend
//                           ? `Seat ${seatNumber} (Occupied)`
//                           : isRemovedLocally
//                           ? `Seat ${seatNumber} (Marked for Removal)`
//                           : isSelectedLocally
//                           ? `Seat ${seatNumber} (Selected for Allocation)`
//                           : `Seat ${seatNumber} (Available)`
//                       }
//                     >
//                       {seatNumber}
//                     </button>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>

//           {/* Seating Legend */}
//           <p className="form-text mt-3 text-center">
//             <span className="badge bg-success me-2">🟩 Selected</span>
//             <span className="badge bg-danger me-2">❌ Removed</span>
//             <span className="badge bg-outline-secondary me-2" style={{border: '1px solid #6c757d'}}>⬜ Available</span>
//             <span className="badge bg-secondary me-2">🔘 Occupied</span>
//             <br/>
//             <small>(Right-click an available seat to mark it for removal)</small>
//           </p>

//         </div>
//       </div>

//     </div>
//   );
// };

// export default RoomViewPage;



import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8084'; // Ensure this matches your backend API URL

const RoomViewPage = () => {
    const navigate = useNavigate();
    const { locationName, buildingName, roomType, floorNumber, roomNumber } = useParams();

    const [roomWrapper, setRoomWrapper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [removedSeats, setRemovedSeats] = useState([]);
    const [occupiedSeats, setOccupiedSeats] = useState([]);

    const roomTypeMap = {
        'trainingroom': 'Training Room',
        'modifiedodc': 'Modified ODC',
        'odc(openodc)': 'ODC (open ODC)',
        'conferenceroom': 'Conference Room',
        'seminarhall': 'Seminar Hall',
        'meetingroom': 'Meeting Room',
        'odc-customtrs': 'ODC-Custom TRs',
        'videoconferenceroom': 'Video Conference Room'
    };

    const apiAndDisplayRoomType = roomTypeMap[roomType.toLowerCase()] || roomType;

    const fetchRoomDetails = useCallback(async () => {
        setLoading(true);
        setError(null);

        const parsedRoomNumber = parseInt(roomNumber);
        const parsedFloorNumber = parseInt(floorNumber);

        if (!locationName || !buildingName || !roomType || isNaN(parsedFloorNumber) || isNaN(parsedRoomNumber)) {
            setError("Invalid or missing room identifier in URL (location, building, room type, floor, or room number).");
            setLoading(false);
            return;
        }

        try {
            const queryParams = new URLSearchParams({
                location: locationName,
                building: buildingName,
                roomType: apiAndDisplayRoomType,
                floorNumber: parsedFloorNumber,
                roomNumber: parsedRoomNumber,
            });

            const url = `${API_BASE_URL}/api/rooms/view?${queryParams.toString()}`;
            console.log("Fetching room details from URL:", url);

            const response = await fetch(url);

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Room not found (${response.status}): ${text || response.statusText}`);
            }

            const data = await response.json();
            console.log("Room details fetched:", data);

            setRoomWrapper(data);

            const initialOccupiedSeatList = Array.from({ length: data.occupiedSeats }, (_, i) => i + 1);
            setOccupiedSeats(initialOccupiedSeatList);

        } catch (err) {
            console.error("Error fetching room details:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [locationName, buildingName, roomType, floorNumber, roomNumber, apiAndDisplayRoomType]);

    useEffect(() => {
        fetchRoomDetails();
    }, [fetchRoomDetails]);

    const toggleSeat = (seatNumber) => {
        if (occupiedSeats.includes(seatNumber) || removedSeats.includes(seatNumber)) {
            console.log(`Seat ${seatNumber} is occupied or marked removed. Cannot select.`);
            return;
        }
        setSelectedSeats((prev) =>
            prev.includes(seatNumber)
                ? prev.filter((n) => n !== seatNumber)
                : [...prev, seatNumber].sort((a, b) => a - b)
        );
    };

    const handleRemoveSeat = (seatNumber, e) => {
        e.preventDefault();

        if (occupiedSeats.includes(seatNumber)) {
            console.log(`Seat ${seatNumber} is permanently occupied. Cannot mark as removed.`);
            return;
        }

        setRemovedSeats((prev) =>
            prev.includes(seatNumber)
                ? prev.filter((n) => n !== seatNumber)
                : [...prev, seatNumber].sort((a, b) => a - b)
        );
        setSelectedSeats((prev) => prev.filter((n) => n !== seatNumber));
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="ms-3 fs-5">Loading room information...</p>
        </div>
    );

    if (error) return (
        <div className="alert alert-danger mt-5 mx-auto" style={{ maxWidth: '600px' }}>
            <h4 className="alert-heading">Error!</h4>
            <p>{error}</p>
            <hr />
            <p className="mb-0">Please try again or contact support if the problem persists.</p>
        </div>
    );

    if (!roomWrapper) return (
        <div className="alert alert-warning mt-5 mx-auto" style={{ maxWidth: '600px' }}>
            <h4 className="alert-heading">No Room Data Found!</h4>
            <p>We couldn't find data for Room **{roomNumber}** on Floor **{floorNumber}**.</p>
            <hr />
            <p className="mb-0">Please verify the URL or try navigating from the main room selection page.</p>
        </div>
    );

    const { roomId, totalSeats, occupiedSeats: backendOccupiedCount } = roomWrapper;

    const currentAvailable = totalSeats - backendOccupiedCount - selectedSeats.length - removedSeats.length;
    const vacant = Math.max(currentAvailable, 0);

    const rows = Math.ceil(totalSeats / 6);

    return (
        <div className="container mt-4">
            <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
                {/* &larr;  */}
                Back to list of rooms
            </button>

            <div className="card shadow-lg mb-4">
                <div className="card-header bg-primary text-white p-3">
                    {/* Changed h4 to h5 here */}
                    <h5 className="mb-0">
                        Room {roomId?.roomNumber} – {apiAndDisplayRoomType}
                        <span className="badge bg-light text-primary float-end">Floor: {roomId?.floorNumber}</span>
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row g-4">
                        {/* Room Information Panel */}
                        <div className="col-lg-6">
                            <h5 className="text-primary mb-3">Room Details</h5>
                            <ul className="list-group list-group-flush border rounded-3 overflow-hidden shadow-sm">
                                <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                    <strong>Location:</strong> <span className="text-muted">{roomId?.location}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                    <strong>Facility:</strong> <span className="text-muted">{roomId?.facility}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                    <strong>Building:</strong> <span className="text-muted">{roomId?.building}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                    <strong>Floor:</strong> <span className="text-muted">{roomId?.floorNumber}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                    <strong>Wing:</strong> <span className="text-muted">{roomId?.wing}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                    <strong>Total Seats:</strong> <span className="badge bg-dark rounded-pill fs-6 px-3 py-2">{totalSeats}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                    <strong>Occupied :</strong> <span className="badge bg-secondary rounded-pill fs-6 px-3 py-2">{backendOccupiedCount}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                    <strong>Currently Selected:</strong> <span className="badge bg-success rounded-pill fs-6 px-3 py-2">{selectedSeats.length}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                    <strong>Currently Marked Removed:</strong> <span className="badge bg-danger rounded-pill fs-6 px-3 py-2">{removedSeats.length}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                    <strong>Vacant (Effective):</strong> <span className="badge bg-info text-dark rounded-pill fs-6 px-3 py-2">{vacant}</span>
                                </li>
                            </ul>
                        </div>

                        {/* Seat Grid & Legend */}
                        <div className="col-lg-6">
                            <h5 className="text-primary mb-3 text-center">Seating Layout</h5>
                            <div className="seat-grid-container border p-3 rounded shadow-sm bg-light">
                                {Array.from({ length: rows }).map((_, rowIdx) => (
                                    <div className="d-flex justify-content-center gap-2 mb-2" key={rowIdx}>
                                        {Array.from({ length: 6 }).map((_, colIdx) => {
                                            const seatNumber = rowIdx * 6 + colIdx + 1;
                                            if (seatNumber > totalSeats) return null;

                                            const isOccupiedByBackend = occupiedSeats.includes(seatNumber);
                                            const isRemovedLocally = removedSeats.includes(seatNumber);
                                            const isSelectedLocally = selectedSeats.includes(seatNumber);

                                            let seatClass = "btn btn-sm ";
                                            if (isOccupiedByBackend) seatClass += "btn-secondary opacity-75";
                                            else if (isRemovedLocally) seatClass += "btn-danger";
                                            else if (isSelectedLocally) seatClass += "btn-success";
                                            else seatClass += "btn-outline-secondary";

                                            const seatStyle = {
                                                width: "45px",
                                                height: "45px",
                                                lineHeight: "35px",
                                                marginRight: ((colIdx + 1) % 3 === 0 && colIdx !== 5) ? "15px" : "0",
                                                fontWeight: 'bold'
                                            };

                                            return (
                                                <button
                                                    key={seatNumber}
                                                    className={seatClass}
                                                    style={seatStyle}
                                                    onClick={() => toggleSeat(seatNumber)}
                                                    onContextMenu={(e) => handleRemoveSeat(seatNumber, e)}
                                                    disabled={isOccupiedByBackend}
                                                    title={
                                                        isOccupiedByBackend
                                                            ? `Seat ${seatNumber} (Occupied)`
                                                            : isRemovedLocally
                                                                ? `Seat ${seatNumber} (Marked for Removal)`
                                                                : isSelectedLocally
                                                                    ? `Seat ${seatNumber} (Selected for Allocation)`
                                                                    : `Seat ${seatNumber} (Available)`
                                                    }
                                                >
                                                    {seatNumber}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>

                            {/* Seating Legend */}
                            <div className="mt-4 p-3 border rounded-3 bg-white shadow-sm">
                                <h6 className="mb-3 text-center">Seating Legend</h6>
                                <div className="d-flex flex-wrap justify-content-center gap-3">
                                    <span className="badge bg-success py-2 px-3 fs-6">
                                        <span className="me-2"></span> Selected
                                    </span>
                                    <span className="badge bg-danger py-2 px-3 fs-6">
                                        <span className="me-2"></span> Removed
                                    </span>
                                    <span className="badge bg-outline-secondary text-secondary py-2 px-3 fs-6" style={{ border: '1px solid #6c757d' }}>
                                        <span className="me-2"></span> Available
                                    </span>
                                    <span className="badge bg-secondary py-2 px-3 fs-6">
                                        <span className="me-2"></span> Occupied
                                    </span>
                                </div>
                                <p className="form-text text-center mt-3 mb-0">
                                    <small>(Right-click an available seat to mark it for removal)</small>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomViewPage;