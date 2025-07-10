// // src/components/AutomateAllocationForm.js (or wherever you prefer to put it)
// import React, { useState } from 'react';

// const AutomateAllocationForm = ({ cohortDetails, onAllocationSuccess, onAllocationError }) => {
//   // State for Automate Tab specific options
//   const [allocationType, setAllocationType] = useState('dynamic'); // 'dynamic', 'location', 'building'
//   const [selectedLocation, setSelectedLocation] = useState('');
//   const [selectedBuilding, setSelectedBuilding] = useState('');
//   const [fittingStrategy, setFittingStrategy] = useState('bestFit'); // 'bestFit' (1) or 'worstFit' (0)

//   // Destructure cohortDetails for direct use
//   const {
//     cohortCode, inTrainingCount, graduatedCount, exitCount,
//     trainingStartDate, trainingEndDate, dateOfJoining,
//     batchOwner, sl, practice
//   } = cohortDetails;

//   const handleAutomateAllocation = async () => {
//     // Basic validation: Check if cohort details are actually filled before attempting allocation
//     // This assumes `cohortDetails` passed from parent has been validated there.
//     // However, a double-check here doesn't hurt.
//     if (!cohortCode || !batchOwner || !sl || !practice || !trainingStartDate || !trainingEndDate || !dateOfJoining || parseInt(inTrainingCount) <= 0) {
//       onAllocationError("Please fill in all required Cohort Details (including a positive 'In Training Count') before running automated allocation.");
//       return;
//     }

//     // The backend /api/batches endpoints expect a 'Batch' object as @RequestBody
//     const batchPayload = {
//       cohortCode: cohortCode,
//       trainingStartDate: trainingStartDate,
//       trainingEndDate: trainingEndDate,
//       batchOwner: batchOwner,
//       dateOfJoining: dateOfJoining,
//       sl: sl,
//       practice: practice,
//       inTrainingCount: parseInt(inTrainingCount),
//       graduatedCount: parseInt(graduatedCount),
//       exitCount: parseInt(exitCount)
//     };

//     const fittingValue = fittingStrategy === 'bestFit' ? 1 : 0; // 1 for best-fit, 0 for worst-fit
//     let url = '';

//     switch (allocationType) {
//       case 'dynamic':
//         url = `http://localhost:8084/api/batches/dynamic?fitting=${fittingValue}`;
//         break;
//       case 'location':
//         if (!selectedLocation) {
//           onAllocationError("Please enter a location for 'By Specific Location' allocation.");
//           return;
//         }
//         url = `http://localhost:8084/api/batches/location/${encodeURIComponent(selectedLocation)}?fitting=${fittingValue}`;
//         break;
//       case 'building':
//         if (!selectedLocation || !selectedBuilding) {
//           onAllocationError("Please enter both location and building for 'By Specific Building' allocation.");
//           return;
//         }
//         url = `http://localhost:8084/api/batches/location/${encodeURIComponent(selectedLocation)}/building/${encodeURIComponent(selectedBuilding)}?fitting=${fittingValue}`;
//         break;
//       default:
//         onAllocationError("Invalid automated allocation type selected.");
//         return;
//     }

//     try {
//       console.log(`Automated Allocation URL: ${url}`);
//       console.log("Automated Allocation Batch Payload:", batchPayload);
//       const response = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(batchPayload)
//       });

//       if (!response.ok) {
//         const errorMessage = await response.text();
//         throw new Error(errorMessage || "Automated allocation failed");
//       }

//       const successMessage = await response.text();
//       onAllocationSuccess(`Automated Allocation Successful! ${successMessage}`);
//     } catch (err) {
//       console.error("Automated Allocation error:", err);
//       onAllocationError(`Automated Allocation failed: ${err.message || 'Please check console for details.'}`);
//     }
//   };

//   return (
//     <div>
//       <h6>Automated Room Allocation</h6>
//       <p className="text-muted">Let the system find the best room for your cohort based on your preferences.</p>

//       <div className="mb-3">
//         <label className="form-label">Allocation Scope <span className="text-danger">*</span></label>
//         <select
//           className="form-select"
//           value={allocationType}
//           onChange={(e) => {
//               setAllocationType(e.target.value);
//               if (e.target.value === 'dynamic') {
//                   setSelectedLocation('');
//                   setSelectedBuilding('');
//               } else if (e.target.value === 'location') {
//                   setSelectedBuilding('');
//               }
//           }}
//         >
//           <option value="dynamic">Dynamic (Search across all available rooms)</option>
//           <option value="location">By Specific Location</option>
//           <option value="building">By Specific Building within a Location</option>
//         </select>
//       </div>

//       {(allocationType === 'location' || allocationType === 'building') && (
//         <div className="mb-3">
//           <label className="form-label">Location <span className="text-danger">*</span></label>
//           <input
//             type="text"
//             className="form-control"
//             value={selectedLocation}
//             onChange={(e) => setSelectedLocation(e.target.value)}
//             placeholder="e.g., Chennai"
//             required
//           />
//         </div>
//       )}

//       {allocationType === 'building' && (
//         <div className="mb-3">
//           <label className="form-label">Building <span className="text-danger">*</span></label>
//           <input
//             type="text"
//             className="form-control"
//             value={selectedBuilding}
//             onChange={(e) => setSelectedBuilding(e.target.value)}
//             placeholder="e.g., SDB3 or CHN SIRUSERI (SEZ) | SIRUSERI IT PARK | SDB3"
//             required
//           />
//         </div>
//       )}

//       <div className="mb-4">
//         <label className="form-label">Fitting Strategy <span className="text-danger">*</span></label>
//         <select
//           className="form-select"
//           value={fittingStrategy}
//           onChange={(e) => setFittingStrategy(e.target.value)}
//         >
//           <option value="bestFit">Best Fit (Smallest suitable room with enough capacity)</option>
//           <option value="worstFit">Worst Fit (Largest suitable room with enough capacity)</option>
//         </select>
//       </div>

//       <button
//         className="btn btn-primary"
//         onClick={handleAutomateAllocation}
//       >
//         🚀 Run Automated Allocation
//       </button>
//     </div>
//   );
// };

// export default AutomateAllocationForm;
// src/components/AutomateAllocationForm.js
// import React, { useState, useEffect, useCallback } from 'react';

// const AutomateAllocationForm = ({ cohortDetails, onAllocationSuccess, onAllocationError }) => {
//   // State for Automate Tab specific options
//   const [allocationType, setAllocationType] = useState('dynamic'); // 'dynamic', 'location', 'building'
//   const [selectedLocation, setSelectedLocation] = useState('');
//   const [selectedBuilding, setSelectedBuilding] = useState('');
//   const [fittingStrategy, setFittingStrategy] = useState('bestFit'); // 'bestFit' (1) or 'worstFit' (0)

//   // New states for holding lists of available locations and buildings
//   const [availableLocations, setAvailableLocations] = useState([]);
//   const [availableBuildings, setAvailableBuildings] = useState([]);
//   const [isLoadingLocations, setIsLoadingLocations] = useState(false);
//   const [isLoadingBuildings, setIsLoadingBuildings] = useState(false);

//   // Destructure cohortDetails for direct use
//   const {
//     cohortCode, inTrainingCount, graduatedCount, exitCount,
//     trainingStartDate, trainingEndDate, dateOfJoining,
//     batchOwner, sl, practice
//   } = cohortDetails;

//   const API_BASE_URL = 'http://localhost:8084';

//   // --- Fetching Locations and Buildings ---

//   // Fetch all available locations
//   useEffect(() => {
//     const fetchLocationsList = async () => {
//       setIsLoadingLocations(true);
//       try {
//         const response = await fetch(`${API_BASE_URL}/locations`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch locations list.');
//         }
//         const data = await response.json();
//         // Assuming data is an array of objects like [{location: "Chennai"}, ...]
//         setAvailableLocations(data.map(loc => loc.location));
//       } catch (error) {
//         console.error("Error fetching locations list:", error);
//         // Optionally, show an error message to the user
//       } finally {
//         setIsLoadingLocations(false);
//       }
//     };
//     fetchLocationsList();
//   }, [API_BASE_URL]); // Depend on API_BASE_URL if it can change

//   // Fetch buildings for a selected location
//   useEffect(() => {
//     if (allocationType === 'building' && selectedLocation) {
//       const fetchBuildingsForLocation = async () => {
//         setIsLoadingBuildings(true);
//         try {
//           const response = await fetch(`${API_BASE_URL}/buildings/${encodeURIComponent(selectedLocation)}`);
//           if (!response.ok) {
//             throw new Error(`Failed to fetch buildings for ${selectedLocation}.`);
//           }
//           const data = await response.json();
//           // Assuming data is an array of strings like ["SDB3", "SDB1"]
//           setAvailableBuildings(data);
//         } catch (error) {
//           console.error(`Error fetching buildings for ${selectedLocation}:`, error);
//           setAvailableBuildings([]); // Clear buildings if there's an error
//           // Optionally, show an error message to the user
//         } finally {
//           setIsLoadingBuildings(false);
//         }
//       };
//       fetchBuildingsForLocation();
//     } else {
//       setAvailableBuildings([]); // Clear buildings if not in building allocation type or no location selected
//     }
//   }, [allocationType, selectedLocation, API_BASE_URL]);

//   // --- Handlers ---

//   const handleAutomateAllocation = async () => {
//     // Basic validation: Check if cohort details are actually filled before attempting allocation
//     if (!cohortCode || !batchOwner || !sl || !practice || !trainingStartDate || !trainingEndDate || !dateOfJoining || parseInt(inTrainingCount) <= 0) {
//       onAllocationError("Please fill in all required Cohort Details (including a positive 'In Training Count') before running automated allocation.");
//       return;
//     }

//     const batchPayload = {
//       cohortCode: cohortCode,
//       trainingStartDate: trainingStartDate,
//       trainingEndDate: trainingEndDate,
//       batchOwner: batchOwner,
//       dateOfJoining: dateOfJoining,
//       sl: sl,
//       practice: practice,
//       inTrainingCount: parseInt(inTrainingCount),
//       graduatedCount: parseInt(graduatedCount),
//       exitCount: parseInt(exitCount)
//     };

//     const fittingValue = fittingStrategy === 'bestFit' ? 1 : 0; // 1 for best-fit, 0 for worst-fit
//     let url = '';

//     switch (allocationType) {
//       case 'dynamic':
//         url = `${API_BASE_URL}/api/batches/dynamic?fitting=${fittingValue}`;
//         break;
//       case 'location':
//         if (!selectedLocation) {
//           onAllocationError("Please select a location for 'By Specific Location' allocation.");
//           return;
//         }
//         url = `${API_BASE_URL}/api/batches/location/${encodeURIComponent(selectedLocation)}?fitting=${fittingValue}`;
//         break;
//       case 'building':
//         if (!selectedLocation || !selectedBuilding) {
//           onAllocationError("Please select both location and building for 'By Specific Building' allocation.");
//           return;
//         }
//         url = `${API_BASE_URL}/api/batches/location/${encodeURIComponent(selectedLocation)}/building/${encodeURIComponent(selectedBuilding)}?fitting=${fittingValue}`;
//         break;
//       default:
//         onAllocationError("Invalid automated allocation type selected.");
//         return;
//     }

//     try {
//       console.log(`Automated Allocation URL: ${url}`);
//       console.log("Automated Allocation Batch Payload:", batchPayload);
//       const response = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(batchPayload)
//       });

//       if (!response.ok) {
//         const errorMessage = await response.text();
//         throw new Error(errorMessage || "Automated allocation failed");
//       }

//       const successMessage = await response.text();
//       onAllocationSuccess(`Automated Allocation Successful! ${successMessage}`);
//     } catch (err) {
//       console.error("Automated Allocation error:", err);
//       onAllocationError(`Automated Allocation failed: ${err.message || 'Please check console for details.'}`);
//     }
//   };

//   const handleAllocationTypeChange = (e) => {
//     const newType = e.target.value;
//     setAllocationType(newType);
//     // Reset selected location/building when changing allocation type
//     setSelectedLocation('');
//     setSelectedBuilding('');
//     setAvailableBuildings([]); // Clear buildings list when type changes
//   };

//   const handleLocationChange = (e) => {
//     const newLocation = e.target.value;
//     setSelectedLocation(newLocation);
//     setSelectedBuilding(''); // Reset building when location changes
//   };

//   const handleBuildingChange = (e) => {
//     setSelectedBuilding(e.target.value);
//   };

//   return (
//     <div>
//       <h6>Automated Room Allocation</h6>
//       <p className="text-muted">Let the system find the best room for your cohort based on your preferences.</p>

//       <div className="mb-3">
//         <label className="form-label">Allocation Scope <span className="text-danger">*</span></label>
//         <select
//           className="form-select"
//           value={allocationType}
//           onChange={handleAllocationTypeChange}
//         >
//           <option value="dynamic">Dynamic (Search across all available rooms)</option>
//           <option value="location">By Specific Location</option>
//           <option value="building">By Specific Building within a Location</option>
//         </select>
//       </div>

//       {(allocationType === 'location' || allocationType === 'building') && (
//         <div className="mb-3">
//           <label className="form-label">Location <span className="text-danger">*</span></label>
//           <select
//             className="form-select"
//             value={selectedLocation}
//             onChange={handleLocationChange}
//             required
//             disabled={isLoadingLocations}
//           >
//             <option value="">{isLoadingLocations ? 'Loading locations...' : 'Select a Location'}</option>
//             {availableLocations.map((loc) => (
//               <option key={loc} value={loc}>{loc}</option>
//             ))}
//           </select>
//           {isLoadingLocations && <div className="text-info mt-1">Fetching locations...</div>}
//         </div>
//       )}

//       {allocationType === 'building' && (
//         <div className="mb-3">
//           <label className="form-label">Building <span className="text-danger">*</span></label>
//           <select
//             className="form-select"
//             value={selectedBuilding}
//             onChange={handleBuildingChange}
//             required
//             disabled={!selectedLocation || isLoadingBuildings}
//           >
//             <option value="">
//               {!selectedLocation
//                 ? 'Select a location first'
//                 : isLoadingBuildings
//                   ? 'Loading buildings...'
//                   : 'Select a Building'}
//             </option>
//             {availableBuildings.map((building) => (
              
//               <option key={building} value={building}>{building}</option>
//             ))}
//           </select>
//           {isLoadingBuildings && <div className="text-info mt-1">Fetching buildings...</div>}
//         </div>
//       )}

//       <div className="mb-4">
//         <label className="form-label">Fitting Strategy <span className="text-danger">*</span></label>
//         <select
//           className="form-select"
//           value={fittingStrategy}
//           onChange={(e) => setFittingStrategy(e.target.value)}
//         >
//           <option value="bestFit">Best Fit (Smallest suitable room with enough capacity)</option>
//           <option value="worstFit">Worst Fit (Largest suitable room with enough capacity)</option>
//         </select>
//       </div>

//       <button
//         className="btn btn-primary"
//         onClick={handleAutomateAllocation}
//       >
//         🚀 Run Automated Allocation
//       </button>
//     </div>
//   );
// };

// export default AutomateAllocationForm;
import React, { useState, useEffect, useCallback } from 'react';

const AutomateAllocationForm = ({ cohortDetails, onAllocationSuccess, onAllocationError }) => {
  // State for Automate Tab specific options
  const [allocationType, setAllocationType] = useState('dynamic'); // 'dynamic', 'location', 'building'
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [fittingStrategy, setFittingStrategy] = useState('bestFit'); // 'bestFit' (1) or 'worstFit' (0)

  // New states for holding lists of available locations and buildings
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableBuildings, setAvailableBuildings] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(false);

  // Destructure cohortDetails for direct use
  const {
    cohortCode, inTrainingCount, graduatedCount, exitCount,
    trainingStartDate, trainingEndDate, dateOfJoining,
    batchOwner, sl, practice
  } = cohortDetails;

  const API_BASE_URL = 'http://localhost:8084';

  // --- Fetching Locations and Buildings ---

  // Fetch all available locations when the component mounts
  useEffect(() => {
    const fetchLocationsList = async () => {
      setIsLoadingLocations(true);
      try {
        const response = await fetch(`${API_BASE_URL}/locations`);
        if (!response.ok) {
          throw new Error('Failed to fetch locations list.');
        }
        const data = await response.json();
        // Assuming data is an array of objects like [{location: "Chennai"}, ...]
        setAvailableLocations(data.map(loc => loc.location));
      } catch (error) {
        console.error("Error fetching locations list:", error);
        onAllocationError("Failed to load locations. Please try again.");
      } finally {
        setIsLoadingLocations(false);
      }
    };
    fetchLocationsList();
  }, [API_BASE_URL, onAllocationError]); // Depend on API_BASE_URL and onAllocationError

  // Fetch buildings for a selected location when allocationType or selectedLocation changes
  useEffect(() => {
    if (allocationType === 'building' && selectedLocation) {
      const fetchBuildingsForLocation = async () => {
    setIsLoadingBuildings(true);
    try {
        // Use the new dedicated endpoint for building names
        const url = new URL(`${API_BASE_URL}/buildings/namesByLocation?location=${selectedLocation}`);
 console.log("Fetching buildings from URL:", url.toString());
 const response = await fetch(url.toString());
    
 if (!response.ok) {
     const errorText = await response.text();
     throw new Error(`HTTP error! status: ${response.status}. Server message: ${errorText}`);
 }
 const data = await response.json(); // data is now List<String>
    
 // Data is already an array of strings, so no further mapping needed
 setAvailableBuildings(data);
 } catch (error) {
     console.error(`Error fetching buildings for ${selectedLocation}:`, error);
    setAvailableBuildings([]); // Clear buildings if there's an error
    onAllocationError(`Failed to load buildings for ${selectedLocation}: ${error.message}`);
    } finally {
    setIsLoadingBuildings(false);
   }
    };
    fetchBuildingsForLocation();
   } else {
   setAvailableBuildings([]);
    }
     }, [allocationType, selectedLocation, API_BASE_URL, onAllocationError]);
  // --- Handlers ---

  const handleAutomateAllocation = async () => {
    // Basic validation: Check if cohort details are actually filled before attempting allocation
    if (!cohortCode || !batchOwner || !sl || !practice || !trainingStartDate || !trainingEndDate || !dateOfJoining || parseInt(inTrainingCount) <= 0) {
      onAllocationError("Please fill in all required Cohort Details (including a positive 'In Training Count') before running automated allocation.");
      return;
    }

    const batchPayload = {
      cohortCode: cohortCode,
      trainingStartDate: trainingStartDate,
      trainingEndDate: trainingEndDate,
      batchOwner: batchOwner,
      dateOfJoining: dateOfJoining,
      sl: sl,
      practice: practice,
      inTrainingCount: parseInt(inTrainingCount),
      graduatedCount: parseInt(graduatedCount),
      exitCount: parseInt(exitCount)
    };

    const fittingValue = fittingStrategy === 'bestFit' ? 1 : 0; // 1 for best-fit, 0 for worst-fit
    let url = '';

    switch (allocationType) {
      case 'dynamic':
        url = `${API_BASE_URL}/api/batches/dynamic?fitting=${fittingValue}`;
        break;
      case 'location':
        if (!selectedLocation) {
          onAllocationError("Please select a location for 'By Specific Location' allocation.");
          return;
        }
        url = `${API_BASE_URL}/api/batches/location/${encodeURIComponent(selectedLocation)}?fitting=${fittingValue}`;
        break;
      case 'building':
        if (!selectedLocation || !selectedBuilding) {
          onAllocationError("Please select both location and building for 'By Specific Building' allocation.");
          return;
        }
        url = `${API_BASE_URL}/api/batches/location/${encodeURIComponent(selectedLocation)}/building/${encodeURIComponent(selectedBuilding)}?fitting=${fittingValue}`;
        break;
      default:
        onAllocationError("Invalid automated allocation type selected.");
        return;
    }

    try {
      console.log(`Automated Allocation URL: ${url}`);
      console.log("Automated Allocation Batch Payload:", batchPayload);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batchPayload)
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Automated allocation failed");
      }

      const successMessage = await response.text();
      onAllocationSuccess(`Automated Allocation Successful! ${successMessage}`);
    } catch (err) {
      console.error("Automated Allocation error:", err);
      onAllocationError(`Automated Allocation failed: ${err.message || 'Please check console for details.'}`);
    }
  };

  const handleAllocationTypeChange = (e) => {
    const newType = e.target.value;
    setAllocationType(newType);
    // Reset selected location/building and clear available buildings when changing allocation type
    setSelectedLocation('');
    setSelectedBuilding('');
    setAvailableBuildings([]);
  };

  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    setSelectedLocation(newLocation);
    setSelectedBuilding(''); // Reset building when location changes
    setAvailableBuildings([]); // Clear existing buildings for the old location
  };

  const handleBuildingChange = (e) => {
    setSelectedBuilding(e.target.value);
  };

  return (
    <div>
      <h6>Automated Room Allocation</h6>
      <p className="text-muted">Let the system find the best room for your cohort based on your preferences.</p>

      <div className="mb-3">
        <label className="form-label">Allocation Scope <span className="text-danger">*</span></label>
        <select
          className="form-select"
          value={allocationType}
          onChange={handleAllocationTypeChange}
        >
          <option value="dynamic">Dynamic (Search across all available rooms)</option>
          <option value="location">By Specific Location</option>
          <option value="building">By Specific Building within a Location</option>
        </select>
      </div>

      {(allocationType === 'location' || allocationType === 'building') && (
        <div className="mb-3">
          <label className="form-label">Location <span className="text-danger">*</span></label>
          <select
            className="form-select"
            value={selectedLocation}
            onChange={handleLocationChange}
            required
            disabled={isLoadingLocations}
          >
            <option value="">{isLoadingLocations ? 'Loading locations...' : 'Select a Location'}</option>
            {availableLocations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          {isLoadingLocations && <div className="text-info mt-1">Fetching locations...</div>}
        </div>
      )}

      {allocationType === 'building' && (
        <div className="mb-3">
          <label className="form-label">Building <span className="text-danger">*</span></label>
          <select
            className="form-select"
            value={selectedBuilding}
            onChange={handleBuildingChange}
            required
            disabled={!selectedLocation || isLoadingBuildings}
          >
            <option value="">
              {!selectedLocation
                ? 'Select a location first'
                : isLoadingBuildings
                  ? 'Loading buildings...'
                  : availableBuildings.length === 0 && !isLoadingBuildings
                    ? 'No buildings found for this location'
                    : 'Select a Building'}
            </option>
            {availableBuildings.map((building) => (
              <option key={building} value={building}>{building}</option>
            ))}
          </select>
          {isLoadingBuildings && <div className="text-info mt-1">Fetching buildings...</div>}
        </div>
      )}

      <div className="mb-4">
        <label className="form-label">Fitting Strategy <span className="text-danger">*</span></label>
        <select
          className="form-select"
          value={fittingStrategy}
          onChange={(e) => setFittingStrategy(e.target.value)}
        >
          <option value="bestFit">Best Fit (Smallest suitable room with enough capacity)</option>
          <option value="worstFit">Worst Fit (Largest suitable room with enough capacity)</option>
        </select>
      </div>

      <button
        className="btn btn-primary"
        onClick={handleAutomateAllocation}
      >
        🚀 Run Automated Allocation
      </button>
    </div>
  );
};

export default AutomateAllocationForm;