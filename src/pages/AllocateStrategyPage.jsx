
// import React, { useState, useMemo } from 'react'; // useMemo to optimize cohortDetails prop
// import { useLocation, useNavigate } from 'react-router-dom';
// import AutomateAllocationForm from './AutomateAllocationForm'; // Adjust path if needed

// const AllocateStrategyPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Initial state for cohort data if passed (though we'll be adding inputs for them)
//   const initialCohortData = location.state?.cohortData || {
//     cohortCode: '',
//     inTrainingCount: 0,
//     graduatedCount: 0,
//     exitCount: 0,
//     trainingStartDate: '',
//     trainingEndDate: '',
//     dateOfJoining: '',
//     batchOwner: '',
//     sl: '',
//     practice: ''
//   };

//   const [activeTab, setActiveTab] = useState('manual');
//   const [sizeInput, setSizeInput] = useState(''); // Used for manual search size
//   const [allocationDate, setAllocationDate] = useState(''); // Used for manual search date
//   const [suggestedRooms, setSuggestedRooms] = useState([]);
//   const [confirmingRoom, setConfirmingRoom] = useState(null);

//   // Cohort details state (Master state, passed to children)
//   const [cohortCode, setCohortCode] = useState(initialCohortData.cohortCode);
//   const [inTrainingCount, setInTrainingCount] = useState(initialCohortData.inTrainingCount);
//   const [graduatedCount, setGraduatedCount] = useState(initialCohortData.graduatedCount);
//   const [exitCount, setExitCount] = useState(initialCohortData.exitCount);
//   const [trainingStartDate, setTrainingStartDate] = useState(initialCohortData.trainingStartDate);
//   const [trainingEndDate, setTrainingEndDate] = useState(initialCohortData.trainingEndDate);
//   const [dateOfJoining, setDateOfJoining] = useState(initialCohortData.dateOfJoining);
//   const [batchOwner, setBatchOwner] = useState(initialCohortData.batchOwner);
//   const [sl, setSl] = useState(initialCohortData.sl);
//   const [practice, setPractice] = useState(initialCohortData.practice);

//   // Memoize cohortDetails object to prevent unnecessary re-renders of child components
//   const cohortDetails = useMemo(() => ({
//     cohortCode, inTrainingCount, graduatedCount, exitCount,
//     trainingStartDate, trainingEndDate, dateOfJoining,
//     batchOwner, sl, practice
//   }), [
//     cohortCode, inTrainingCount, graduatedCount, exitCount,
//     trainingStartDate, trainingEndDate, dateOfJoining,
//     batchOwner, sl, practice
//   ]);

//   // --- Helper to validate common cohort inputs ---
//   const validateCohortInputs = () => {
//     // Check if required fields are filled and counts are valid
//     if (!cohortCode || !batchOwner || !sl || !practice || !trainingStartDate || !trainingEndDate || !dateOfJoining) {
//       alert("Please fill in all text/date fields for Cohort Details.");
//       return false;
//     }
//     // Check if numbers are valid
//     const counts = [inTrainingCount, graduatedCount, exitCount];
//     if (counts.some(count => isNaN(parseInt(count)) || parseInt(count) < 0)) {
//         alert("In Training Count, Graduated Count, and Exit Count must be valid non-negative numbers.");
//         return false;
//     }
//     if (parseInt(inTrainingCount) <= 0) {
//         alert("'In Training Count' must be greater than 0 for allocation.");
//         return false;
//     }
//     return true;
//   };

//   // --- Manual Allocation Logic ---
//   const handleSearch = async () => {
//     if (!validateCohortInputs()) return;
//     if (!sizeInput || !allocationDate) {
//       alert("Please enter required seat count and allocation date for manual search.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:8084/api/rooms/by-size-date?size=${sizeInput}&date=${allocationDate}`
//       );
//       const data = await response.json();
//       setSuggestedRooms(Array.isArray(data) ? data : []);
//       if (data.length === 0) {
//           alert("No rooms found for the specified size and date.");
//       }
//     } catch (err) {
//       console.error("Manual Search failed:", err);
//       alert("Error fetching room suggestions for manual allocation.");
//     }
//   };

//   const handleConfirmAllocate = async () => {
//     if (!validateCohortInputs() || !confirmingRoom) return;

//     const { roomId = {} } = confirmingRoom;

//     const payload = {
//       cohortCode: cohortCode,
//       trainingStartDate: trainingStartDate,
//       trainingEndDate: trainingEndDate,
//       batchOwner: batchOwner,
//       dateOfJoining: dateOfJoining,
//       sl: sl,
//       practice: practice,
//       inTrainingCount: parseInt(inTrainingCount),
//       graduatedCount: parseInt(graduatedCount),
//       exitCount: parseInt(exitCount),

//       location: roomId.location,
//       facility: roomId.facility,
//       building: roomId.building,
//       floorNumber: roomId.floorNumber,
//       roomNo: roomId.roomNumber
//     };

//     try {
//       console.log("Manual Allocation Payload (to /api/batches/allocate):", payload);
//       const response = await fetch(
//         `http://localhost:8084/api/batches/allocate`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload)
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
//         throw new Error(errorData.message || "Manual allocation failed");
//       }

//       const result = await response.json();
//       console.log("Manual Allocation Result:", result);
//       alert(`✅ Cohort "${result.cohortCode}" allocated successfully to Room: ${result.roomNo}.`);
//       setConfirmingRoom(null);
//       navigate("/location");
//     } catch (err) {
//       console.error("Manual Allocation error:", err);
//       alert(`❌ Manual Allocation failed: ${err.message || 'Please check console for details.'}`);
//     }
//   };

//   // --- Callbacks for AutomateAllocationForm ---
//   const handleAutomateSuccess = (message) => {
//     alert(`✅ ${message}`);
//     navigate("/location");
//   };

//   const handleAutomateError = (message) => {
//     alert(`❌ ${message}`);
//   };


//   return (
//     <div className="container mt-4">
//       <h5 className="mb-4">Allocate Room</h5>
//       <div className="d-flex">
//         {/* Sidebar */}
//         <div className="me-4 border-end pe-3" style={{ width: '200px' }}>
//           <button
//             className={`btn w-100 mb-2 ${activeTab === 'manual' ? 'btn-primary' : 'btn-outline-primary'}`}
//             onClick={() => setActiveTab('manual')}
//           >
//             Manual
//           </button>
//           <button
//             className={`btn w-100 ${activeTab === 'automate' ? 'btn-primary' : 'btn-outline-primary'}`}
//             onClick={() => setActiveTab('automate')}
//           >
//             Automate
//           </button>
//         </div>

//         {/* Content Area */}
//         <div className="flex-grow-1">
//           {/* Cohort Details Section (Always visible, as it's required for both manual and automate) */}
//           <h6>Cohort Details <span className="text-danger">*</span></h6>
//           <p className="text-muted small">Please fill these details for any allocation strategy.</p>
//           <div className="row mb-3">
//             <div className="col-md-6">
//               <label className="form-label">Cohort Code <span className="text-danger">*</span></label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={cohortCode}
//                 onChange={(e) => setCohortCode(e.target.value)}
//                 placeholder="e.g., MERN-STACK-2025-BATCH-A"
//                 required
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label">Batch Owner <span className="text-danger">*</span></label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={batchOwner}
//                 onChange={(e) => setBatchOwner(e.target.value)}
//                 placeholder="e.g., John Doe"
//                 required
//               />
//             </div>
//           </div>
//           <div className="row mb-3">
//             <div className="col-md-4">
//               <label className="form-label">Training Start Date <span className="text-danger">*</span></label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={trainingStartDate}
//                 onChange={(e) => setTrainingStartDate(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label">Training End Date <span className="text-danger">*</span></label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={trainingEndDate}
//                 onChange={(e) => setTrainingEndDate(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label">Date of Joining <span className="text-danger">*</span></label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={dateOfJoining}
//                 onChange={(e) => setDateOfJoining(e.target.value)}
//                 required
//               />
//             </div>
//           </div>
//           <div className="row mb-3">
//             <div className="col-md-4">
//               <label className="form-label">Service Line (SL) <span className="text-danger">*</span></label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={sl}
//                 onChange={(e) => setSl(e.target.value)}
//                 placeholder="e.g., Digital Transformation"
//                 required
//               />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label">Practice <span className="text-danger">*</span></label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={practice}
//                 onChange={(e) => setPractice(e.target.value)}
//                 placeholder="e.g., Cloud Solutions"
//                 required
//               />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label">In Training Count <span className="text-danger">*</span></label>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={inTrainingCount}
//                 onChange={(e) => setInTrainingCount(e.target.value)}
//                 min="1" // Must be at least 1 for allocation
//                 required
//               />
//             </div>
//           </div>
//           <div className="row mb-4">
//             <div className="col-md-6">
//               <label className="form-label">Graduated Count</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={graduatedCount}
//                 onChange={(e) => setGraduatedCount(e.target.value)}
//                 min="0"
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label">Exit Count</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={exitCount}
//                 onChange={(e) => setExitCount(e.target.value)}
//                 min="0"
//               />
//             </div>
//           </div>

//           <hr className="mb-4"/>

//           {/* Manual Tab Content */}
//           {activeTab === 'manual' && (
//             <div>
//               <h6>Manual Room Search & Allocation</h6>
//               <div className="row mb-3">
//                 <div className="col-md-6">
//                   <label className="form-label">Required Room Size (Seats) <span className="text-danger">*</span></label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     value={sizeInput}
//                     onChange={(e) => setSizeInput(e.target.value)}
//                     placeholder="Enter required seat count"
//                     min="1"
//                     required
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label">Allocation Date <span className="text-danger">*</span></label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     value={allocationDate}
//                     onChange={(e) => setAllocationDate(e.target.value)}
//                     min={new Date().toISOString().split("T")[0]}
//                     required
//                   />
//                 </div>
//               </div>

//               <button
//                 className="btn btn-success mb-4"
//                 onClick={handleSearch}
//                 disabled={!sizeInput || !allocationDate}
//               >
//                 🔍 Search Rooms
//               </button>

//               {suggestedRooms.length > 0 ? (
//                 <div className="row">
//                   {suggestedRooms.map((room, index) => {
//                     const { id = {}, roomType, seatCount, status } = room;
//                     return (
//                       <div key={index} className="col-md-4 mb-4">
//                         <button
//                           type="button"
//                           className="card btn btn-light text-start shadow-sm h-100 border border-primary"
//                           onClick={() => setConfirmingRoom(room)}
//                         >
//                           <div className="card-body">
//                             <h5 className="card-title text-primary">{roomType ?? "—"}</h5>
//                             <p className="card-text mb-1"><strong>Room #:</strong> {room.roomId.roomNumber ?? "—"}</p>
//                             <p className="card-text mb-1"><strong>Building:</strong> {room.roomId.building ?? "—"}</p>
//                             <p className="card-text mb-1"><strong>Floor:</strong> {room.roomId.floorNumber ?? "—"}</p>
//                             <p className="card-text mb-1"><strong>Seats:</strong> {room.totalSeats ?? "—"}</p>
//                             <p className="card-text mb-1"><strong>Status:</strong> {room.status ?? "—"}</p>
//                           </div>
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <p className="text-muted">No rooms to display yet. Enter size and date to search.</p>
//               )}
//             </div>
//           )}

//           {/* Automate Tab Content - Now a separate component */}
//           {activeTab === 'automate' && (
//             <AutomateAllocationForm
//               cohortDetails={cohortDetails} // Pass the complete cohortDetails object
//               onAllocationSuccess={handleAutomateSuccess}
//               onAllocationError={handleAutomateError}
//             />
//           )}
//         </div>
//       </div>

//       {/* Bootstrap Modal (for Manual tab confirmation) */}
//       {confirmingRoom && activeTab === 'manual' && (
//         <div className="modal fade show d-block" style={{ backgroundColor: "#00000088" }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content border-0 shadow">
//               <div className="modal-header">
//                 <h5 className="modal-title">Confirm Manual Allocation</h5>
//                 <button className="btn-close" onClick={() => setConfirmingRoom(null)}></button>
//               </div>
//               <div className="modal-body">
//                 <p>Allocate <strong>{cohortCode || "this cohort"}</strong> to:</p>
//                 <ul className="mb-0">
//                   <li><strong>Room #:</strong> {confirmingRoom?.roomId?.roomNumber}</li>
//                   <li><strong>Building:</strong> {confirmingRoom?.roomId?.building}</li>
//                   <li><strong>Type:</strong> {confirmingRoom?.roomType}</li>
//                   <li><strong>Date:</strong> {allocationDate}</li>
//                 </ul>
//                 <p className="mt-3">
//                     Please ensure all cohort details are accurate before confirming.
//                 </p>
//               </div>
//               <div className="modal-footer">
//                 <button className="btn btn-secondary" onClick={() => setConfirmingRoom(null)}>Cancel</button>
//                 <button className="btn btn-primary" onClick={handleConfirmAllocate}>Yes, Allocate</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllocateStrategyPage;

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AutomateAllocationForm from './AutomateAllocationForm'; // Adjust path if needed

const AllocateStrategyPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Initial state for cohort data if passed (though we'll be adding inputs for them)
    const initialCohortData = location.state?.cohortData || {
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
    };

    const [activeTab, setActiveTab] = useState('manual');
    const [sizeInput, setSizeInput] = useState(''); // Used for manual search size
    const [allocationDate, setAllocationDate] = useState(''); // Used for manual search date
    const [suggestedRooms, setSuggestedRooms] = useState([]); // All rooms from initial search
    const [filteredRooms, setFilteredRooms] = useState([]); // Rooms after applying client-side filters
    const [confirmingRoom, setConfirmingRoom] = useState(null);

    // Cohort details state (Master state, passed to children)
    const [cohortCode, setCohortCode] = useState(initialCohortData.cohortCode);
    const [inTrainingCount, setInTrainingCount] = useState(initialCohortData.inTrainingCount);
    const [graduatedCount, setGraduatedCount] = useState(initialCohortData.graduatedCount);
    const [exitCount, setExitCount] = useState(initialCohortData.exitCount);
    const [trainingStartDate, setTrainingStartDate] = useState(initialCohortData.trainingStartDate);
    const [trainingEndDate, setTrainingEndDate] = useState(initialCohortData.trainingEndDate);
    const [dateOfJoining, setDateOfJoining] = useState(initialCohortData.dateOfJoining);
    const [batchOwner, setBatchOwner] = useState(initialCohortData.batchOwner);
    const [sl, setSl] = useState(initialCohortData.sl);
    const [practice, setPractice] = useState(initialCohortData.practice);

    // States for client-side filter selections (applied after initial search)
    const [filterLocation, setFilterLocation] = useState('');
    const [filterBuilding, setFilterBuilding] = useState('');
    const [filterFloor, setFilterFloor] = useState('');
    const [filterRoomNumber, setFilterRoomNumber] = useState('');

    // States for distinct options available in current suggestedRooms for filters
    const [distinctLocations, setDistinctLocations] = useState([]);
    const [distinctBuildings, setDistinctBuildings] = useState([]);
    const [distinctFloors, setDistinctFloors] = useState([]);

    const API_BASE_URL = 'http://localhost:8084';

    // Memoize cohortDetails object to prevent unnecessary re-renders of child components
    const cohortDetails = useMemo(() => ({
        cohortCode, inTrainingCount, graduatedCount, exitCount,
        trainingStartDate, trainingEndDate, dateOfJoining,
        batchOwner, sl, practice
    }), [
        cohortCode, inTrainingCount, graduatedCount, exitCount,
        trainingStartDate, trainingEndDate, dateOfJoining,
        batchOwner, sl, practice
    ]);

    // --- Helper to validate common cohort inputs ---
    const validateCohortInputs = useCallback(() => {
        if (!cohortCode || !batchOwner || !sl || !practice || !trainingStartDate || !trainingEndDate || !dateOfJoining) {
            alert("Please fill in all text/date fields for Cohort Details.");
            return false;
        }
        const counts = [inTrainingCount, graduatedCount, exitCount];
        if (counts.some(count => isNaN(parseInt(count)) || parseInt(count) < 0)) {
            alert("In Training Count, Graduated Count, and Exit Count must be valid non-negative numbers.");
            return false;
        }
        if (parseInt(inTrainingCount) <= 0) {
            alert("'In Training Count' must be greater than 0 for allocation.");
            return false;
        }
        return true;
    }, [cohortCode, batchOwner, sl, practice, trainingStartDate, trainingEndDate, dateOfJoining, inTrainingCount, graduatedCount, exitCount]);

    // --- Manual Allocation Logic: Initial Search ---
    const handleSearch = async () => {
        if (!validateCohortInputs()) return;
        if (!sizeInput || !allocationDate) {
            alert("Please enter required seat count and allocation date for manual search.");
            return;
        }

        // Initial search only by size and date
        const url = `${API_BASE_URL}/api/rooms/by-size-date?size=${sizeInput}&date=${allocationDate}`;

        try {
            console.log("Initial Manual Search URL:", url);
            const response = await fetch(url);
            const data = await response.json();
            setSuggestedRooms(Array.isArray(data) ? data : []); // Store all fetched rooms
            setFilterLocation(''); // Reset filters on new search
            setFilterBuilding('');
            setFilterFloor('');
            setFilterRoomNumber('');

            if (data.length === 0) {
                alert("No rooms found for the specified size and date.");
            }
        } catch (err) {
            console.error("Initial Manual Search failed:", err);
            alert("Error fetching room suggestions for manual allocation.");
        }
    };

    // --- Client-side Filtering Logic ---
    useEffect(() => {
        let currentFilteredRooms = [...suggestedRooms]; // Start with all fetched rooms

        // Populate distinct locations
        const locations = [...new Set(currentFilteredRooms.map(room => room.roomId.location))].sort();
        setDistinctLocations(locations);

        // Apply location filter
        if (filterLocation) {
            currentFilteredRooms = currentFilteredRooms.filter(
                room => room.roomId.location === filterLocation
            );
        }

        // Populate distinct buildings based on *currently filtered* rooms
        const buildings = [...new Set(currentFilteredRooms.map(room => room.roomId.building))].sort();
        setDistinctBuildings(buildings);

        // Apply building filter
        if (filterBuilding) {
            currentFilteredRooms = currentFilteredRooms.filter(
                room => room.roomId.building === filterBuilding
            );
        }

        // Populate distinct floors based on *currently filtered* rooms
        const floors = [...new Set(currentFilteredRooms.map(room => room.roomId.floorNumber))].sort((a, b) => a - b);
        setDistinctFloors(floors);

        // Apply floor filter
        if (filterFloor) {
            currentFilteredRooms = currentFilteredRooms.filter(
                room => room.roomId.floorNumber === parseInt(filterFloor)
            );
        }

        // Apply room number filter
        if (filterRoomNumber) {
            const lowerCaseFilterRoomNumber = filterRoomNumber.toLowerCase();
            currentFilteredRooms = currentFilteredRooms.filter(
                room => room.roomId.roomNumber.toLowerCase().includes(lowerCaseFilterRoomNumber)
            );
        }

        setFilteredRooms(currentFilteredRooms);

        // Clear filter selections if the options are no longer available
        if (filterLocation && !locations.includes(filterLocation)) {
            setFilterLocation('');
        }
        if (filterBuilding && !buildings.includes(filterBuilding)) {
            setFilterBuilding('');
        }
        if (filterFloor && !floors.includes(parseInt(filterFloor))) {
            setFilterFloor('');
        }

    }, [suggestedRooms, filterLocation, filterBuilding, filterFloor, filterRoomNumber]);


    const handleConfirmAllocate = async () => {
        if (!validateCohortInputs() || !confirmingRoom) return;

        const { roomId = {} } = confirmingRoom;

        const payload = {
            cohortCode: cohortCode,
            trainingStartDate: trainingStartDate,
            trainingEndDate: trainingEndDate,
            batchOwner: batchOwner,
            dateOfJoining: dateOfJoining,
            sl: sl,
            practice: practice,
            inTrainingCount: parseInt(inTrainingCount),
            graduatedCount: parseInt(graduatedCount),
            exitCount: parseInt(exitCount),

            location: roomId.location,
            facility: roomId.facility, // Note: backend uses 'facility', current room model doesn't explicitly have it, will send undefined if not present
            building: roomId.building,
            floorNumber: roomId.floorNumber,
            roomNo: roomId.roomNumber
        };

        try {
            console.log("Manual Allocation Payload (to /api/batches/allocate):", payload);
            const response = await fetch(
                `${API_BASE_URL}/api/batches/allocate`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
                throw new Error(errorData.message || "Manual allocation failed");
            }

            const result = await response.json();
            console.log("Manual Allocation Result:", result);
            alert(`✅ Cohort "${result.cohortCode}" allocated successfully to Room: ${result.roomNo}.`);
            setConfirmingRoom(null);
            navigate("/location");
        } catch (err) {
            console.error("Manual Allocation error:", err);
            alert(`❌ Manual Allocation failed: ${err.message || 'Please check console for details.'}`);
        }
    };

    // --- Callbacks for AutomateAllocationForm ---
    const handleAutomateSuccess = (message) => {
        alert(`✅ ${message}`);
        navigate("/location");
    };

    const handleAutomateError = (message) => {
        alert(`❌ ${message}`);
    };


    return (
        <div className="container mt-4">
            <h5 className="mb-4">Allocate Room</h5>
            <div className="d-flex">
                {/* Sidebar */}
                <div className="me-4 border-end pe-3" style={{ width: '200px' }}>
                    <button
                        className={`btn w-100 mb-2 ${activeTab === 'manual' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveTab('manual')}
                    >
                        Manual
                    </button>
                    <button
                        className={`btn w-100 ${activeTab === 'automate' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveTab('automate')}
                    >
                        Automate
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-grow-1">
                    {/* Cohort Details Section (Always visible, as it's required for both manual and automate) */}
                    <h6>Cohort Details <span className="text-danger">*</span></h6>
                    <p className="text-muted small">Please fill these details for any allocation strategy.</p>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Cohort Code <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                value={cohortCode}
                                onChange={(e) => setCohortCode(e.target.value)}
                                placeholder="e.g., MERN-STACK-2025-BATCH-A"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Batch Owner <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                value={batchOwner}
                                onChange={(e) => setBatchOwner(e.target.value)}
                                placeholder="e.g., John Doe"
                                required
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label">Training Start Date <span className="text-danger">*</span></label>
                            <input
                                type="date"
                                className="form-control"
                                value={trainingStartDate}
                                onChange={(e) => setTrainingStartDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Training End Date <span className="text-danger">*</span></label>
                            <input
                                type="date"
                                className="form-control"
                                value={trainingEndDate}
                                onChange={(e) => setTrainingEndDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Date of Joining <span className="text-danger">*</span></label>
                            <input
                                type="date"
                                className="form-control"
                                value={dateOfJoining}
                                onChange={(e) => setDateOfJoining(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label">Service Line (SL) <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                value={sl}
                                onChange={(e) => setSl(e.target.value)}
                                placeholder="e.g., Digital Transformation"
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Practice <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                value={practice}
                                onChange={(e) => setPractice(e.target.value)}
                                placeholder="e.g., Cloud Solutions"
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">In Training Count <span className="text-danger">*</span></label>
                            <input
                                type="number"
                                className="form-control"
                                value={inTrainingCount}
                                onChange={(e) => setInTrainingCount(e.target.value)}
                                min="1" // Must be at least 1 for allocation
                                required
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label className="form-label">Graduated Count</label>
                            <input
                                type="number"
                                className="form-control"
                                value={graduatedCount}
                                onChange={(e) => setGraduatedCount(e.target.value)}
                                min="0"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Exit Count</label>
                            <input
                                type="number"
                                className="form-control"
                                value={exitCount}
                                onChange={(e) => setExitCount(e.target.value)}
                                min="0"
                            />
                        </div>
                    </div>

                    <hr className="mb-4" />

                    {/* Manual Tab Content */}
                    {activeTab === 'manual' && (
                        <div>
                            <h6>Manual Room Search & Allocation</h6>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Required Room Size (Seats) <span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={sizeInput}
                                        onChange={(e) => setSizeInput(e.target.value)}
                                        placeholder="Enter required seat count"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Allocation Date <span className="text-danger">*</span></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={allocationDate}
                                        onChange={(e) => setAllocationDate(e.target.value)}
                                        min={new Date().toISOString().split("T")[0]}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                className="btn btn-success mb-4"
                                onClick={handleSearch}
                                disabled={!sizeInput || !allocationDate}
                            >
                                🔍 Search Rooms
                            </button>

                            {suggestedRooms.length > 0 && (
                                <div className="mb-4 p-3 border rounded bg-light">
                                    <h6>Filter Search Results</h6>
                                    <div className="row g-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Location</label>
                                            <select
                                                className="form-select"
                                                value={filterLocation}
                                                onChange={(e) => {
                                                    setFilterLocation(e.target.value);
                                                    setFilterBuilding(''); // Reset more granular filters
                                                    setFilterFloor('');
                                                    setFilterRoomNumber('');
                                                }}
                                            >
                                                <option value="">All Locations</option>
                                                {distinctLocations.map((loc) => (
                                                    <option key={loc} value={loc}>{loc}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Building</label>
                                            <select
                                                className="form-select"
                                                value={filterBuilding}
                                                onChange={(e) => {
                                                    setFilterBuilding(e.target.value);
                                                    setFilterFloor(''); // Reset more granular filters
                                                    setFilterRoomNumber('');
                                                }}
                                                disabled={!filterLocation || distinctBuildings.length === 0}
                                            >
                                                <option value="">All Buildings</option>
                                                {distinctBuildings.map((building) => (
                                                    <option key={building} value={building}>{building}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Floor</label>
                                            <select
                                                className="form-select"
                                                value={filterFloor}
                                                onChange={(e) => {
                                                    setFilterFloor(e.target.value);
                                                    setFilterRoomNumber(''); // Reset more granular filters
                                                }}
                                                disabled={!filterLocation || !filterBuilding || distinctFloors.length === 0}
                                            >
                                                <option value="">All Floors</option>
                                                {distinctFloors.map((floor) => (
                                                    <option key={floor} value={floor}>{floor}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                    </div>
                                </div>
                            )}

                            {filteredRooms.length > 0 ? (
                                <div className="row">
                                    {filteredRooms.map((room, index) => {
                                        const { roomId = {}, roomType, totalSeats, status } = room;
                                        return (
                                            <div key={index} className="col-md-4 mb-4">
                                                <button
                                                    type="button"
                                                    className="card btn btn-light text-start shadow-sm h-100 border border-primary"
                                                    onClick={() => setConfirmingRoom(room)}
                                                >
                                                    <div className="card-body">
                                                        <h5 className="card-title text-primary">{roomType ?? "—"}</h5>
                                                        <p className="card-text mb-1"><strong>Room #:</strong> {roomId.roomNumber ?? "—"}</p>
                                                        <p className="card-text mb-1"><strong>Location:</strong> {roomId.location ?? "—"}</p>
                                                        <p className="card-text mb-1"><strong>Building:</strong> {roomId.building ?? "—"}</p>
                                                        <p className="card-text mb-1"><strong>Floor:</strong> {roomId.floorNumber ?? "—"}</p>
                                                        <p className="card-text mb-1"><strong>Seats:</strong> {totalSeats ?? "—"}</p>
                                                        <p className="card-text mb-1"><strong>Status:</strong> {status ?? "—"}</p>
                                                    </div>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                suggestedRooms.length > 0 ? (
                                    <p className="text-muted">No rooms found matching your filters.</p>
                                ) : (
                                    <p className="text-muted">No rooms to display yet. Enter size and date to search.</p>
                                )
                            )}
                        </div>
                    )}

                    {/* Automate Tab Content - Now a separate component */}
                    {activeTab === 'automate' && (
                        <AutomateAllocationForm
                            cohortDetails={cohortDetails} // Pass the complete cohortDetails object
                            onAllocationSuccess={handleAutomateSuccess}
                            onAllocationError={handleAutomateError}
                        />
                    )}
                </div>
            </div>

            {/* Bootstrap Modal (for Manual tab confirmation) */}
            {confirmingRoom && activeTab === 'manual' && (
                <div className="modal fade show d-block" style={{ backgroundColor: "#00000088" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Manual Allocation</h5>
                                <button className="btn-close" onClick={() => setConfirmingRoom(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Allocate <strong>{cohortCode || "this cohort"}</strong> to:</p>
                                <ul className="mb-0">
                                    <li><strong>Room #:</strong> {confirmingRoom?.roomId?.roomNumber}</li>
                                    <li><strong>Location:</strong> {confirmingRoom?.roomId?.location}</li>
                                    <li><strong>Building:</strong> {confirmingRoom?.roomId?.building}</li>
                                    <li><strong>Floor:</strong> {confirmingRoom?.roomId?.floorNumber}</li>
                                    <li><strong>Type:</strong> {confirmingRoom?.roomType}</li>
                                    <li><strong>Seats:</strong> {confirmingRoom?.totalSeats}</li>
                                    <li><strong>Date:</strong> {allocationDate}</li>
                                </ul>
                                <p className="mt-3">
                                    Please ensure all cohort details are accurate before confirming.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setConfirmingRoom(null)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleConfirmAllocate}>Yes, Allocate</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllocateStrategyPage;