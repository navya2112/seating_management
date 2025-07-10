// import React, { useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';

// const AddRoom = () => {
//   const navigate = useNavigate();
//   const { locationName, buildingName } = useParams();

//   const [formData, setFormData] = useState({
//     location: locationName,
//     building: buildingName,
//     // facility: '',
//     floor: '',
//     wing: '',
//     roomNo: '',
//     roomType: '',
//     roomTypeName: '',
//     totalSeats: '',
//     excludingTrainer: '',
//     seatingSetup: '',
//     seatingCalc: '',
//     priority: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Room added:', formData);
//     navigate(`/location/${locationName}/${buildingName}`);
//   };

//   return (
//     <div className="container mt-4">
//       {/* Back Navigation */}
//       <div className="d-flex align-items-center mb-3">
//         <span
//           style={{ cursor: 'pointer', fontSize: '1.5rem' }}
//           onClick={() => navigate(-1)}
//         >
//           ←
//         </span>
//         <h5 className="ms-3 mb-0">Back to Rooms</h5>
//       </div>

//       <h4 className="mb-4">ADD ROOM</h4>

//       <form onSubmit={handleSubmit} className="row g-3">
//         {/* Location and Building (read-only) */}
//         <div className="col-md-4">
//           <label className="form-label">Location</label>
//           <input
//             type="text"
//             className="form-control"
//             name="location"
//             value={formData.location}
//             readOnly
//           />
//         </div>
//         <div className="col-md-4">
//           <label className="form-label">Building</label>
//           <input
//             type="text"
//             className="form-control"
//             name="building"
//             value={formData.building}
//             readOnly
//           />
//         </div>

//         {/* Dropdown Fields */}
//         {[
//         //   { label: 'Facility', name: 'facility', options: ['HYD-HTC', 'CHN-SDB', 'BLR-EC'] },
//           { label: 'Floor', name: 'floor', options: ['1', '2', '3'] },
//           { label: 'Wing', name: 'wing', options: ['A', 'B', 'C'] },
//           { label: 'Room No', name: 'roomNo', options: ['1', '2', '3'] },
//           { label: 'Room Type', name: 'roomType', options: ['ODC (open ODC)', 'Training Room','Modified ODC'] },
//           { label: 'Room Type - Name Standardized', name: 'roomTypeName', options: ['Standard', 'Custom'] },
//           { label: 'Priority', name: 'priority', options: ['Low', 'Medium', 'High'] },
//         ].map((field, index) => (
//           <div className="col-md-4" key={index}>
//             <label className="form-label">{field.label}</label>
//             <select
//               className="form-select"
//               name={field.name}
//               value={formData[field.name]}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select {field.label}</option>
//               {field.options.map((opt, i) => (
//                 <option key={i} value={opt}>{opt}</option>
//               ))}
//             </select>
//           </div>
//         ))}

//         {/* Numeric Fields */}
//         {[
//           { label: 'Total Seat Count', name: 'totalSeats' },
//           { label: 'Seat Count excluding Trainer', name: 'excludingTrainer' },
//           { label: 'Seating set-up', name: 'seatingSetup' },
//           { label: 'Seating for calculation', name: 'seatingCalc' },
//         ].map((field, index) => (
//           <div className="col-md-4" key={index}>
//             <label className="form-label">{field.label}</label>
//             <input
//               type="number"
//               className="form-control"
//               name={field.name}
//               value={formData[field.name]}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         ))}

//         <div className="col-12 mt-3">
//           <button type="submit" className="btn btn-primary">ADD</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddRoom;




import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Importing an icon for the back button

const AddRoom = () => {
    const navigate = useNavigate();
    const { locationName, buildingName } = useParams(); // These come from the URL params

    // State to hold form data, structured to match the backend Room model
    const [formData, setFormData] = useState({
        // Nested RoomId fields under 'id'
        id: {
            location: locationName || '', // Initialize with URL param
            facility: '', // This field was missing, now correctly added
            building: buildingName || '', // Initialize with URL param
            floorNumber: '', // Will be converted from string to number
            wing: '',
            roomNumber: '', // Will be converted from string to number
        },
        roomType: '',
        roomTypeNameStandardized: '', // Corrected name from 'roomTypeName' to match backend model
        seatCount: '', // Will be converted from string to number
        seatingSetup: '', // Will be converted from string to number
        priority: '',
        // status: 'ACTIVE', // Backend sets this default, but you can send it if you want
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Handle nested 'id' fields. Note: 'facility' is now included.
        if (['location', 'facility', 'building', 'floorNumber', 'wing', 'roomNumber'].includes(name)) {
            setFormData((prev) => ({
                ...prev,
                id: {
                    ...prev.id,
                    [name]: value,
                },
            }));
        } else {
            // Handle top-level Room fields
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Data Transformation: Convert string numbers to actual numbers
        // This is crucial because your Java Integer types expect numbers, not strings.
        const payload = {
            id: {
                location: formData.id.location,
                facility: formData.id.facility, // Ensure facility is included in the payload
                building: formData.id.building,
                floorNumber: parseInt(formData.id.floorNumber),
                wing: formData.id.wing,
                roomNumber: parseInt(formData.id.roomNumber),
            },
            roomType: formData.roomType,
            roomTypeNameStandardized: formData.roomTypeNameStandardized,
            seatCount: parseInt(formData.seatCount),
            seatingSetup: parseInt(formData.seatingSetup),
            priority: formData.priority,
            // status: formData.status, // Include if you want to explicitly send status
        };

        // Basic validation
        // Check all 'id' sub-fields and main room fields
        const requiredIdFields = [payload.id.location, payload.id.facility, payload.id.building, payload.id.wing];
        const requiredNumberIdFields = [payload.id.floorNumber, payload.id.roomNumber];
        const requiredRoomFields = [payload.roomType, payload.roomTypeNameStandardized, payload.priority];
        const requiredRoomNumberFields = [payload.seatCount, payload.seatingSetup];

        if (requiredIdFields.some(val => val === '') ||
            requiredNumberIdFields.some(val => isNaN(val)) ||
            requiredRoomFields.some(val => val === '') ||
            requiredRoomNumberFields.some(val => isNaN(val))) {
            alert("Please fill in all required fields correctly (numbers must be valid).");
            console.error("Validation failed. Payload:", payload); // Log payload for debugging
            return;
        }
        console.log(formData.id)
        try {
            const response = await fetch('http://localhost:8084/api/rooms/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Room added successfully! Room Number: ${result.id.roomNumber}`);
                console.log('Room added successfully:', result);
                // Navigate back to the rooms list or a confirmation page
                navigate(`/location/${locationName}/${buildingName}`);
            } else {
                const errorText = await response.text(); // Get error message from backend
                alert(`Failed to add room: ${errorText}`);
                console.error('Failed to add room:', response.status, errorText);
            }
        } catch (error) {
            console.error('Error adding room:', error);
            alert('An error occurred while adding the room.');
        }
    };

    return (
        <div className="container mt-4">
            {/* Back Navigation */}
            <div className="d-flex align-items-center mb-4">
                <button
                    className="btn btn-outline-secondary d-flex align-items-center"
                    onClick={() => navigate(-1)}
                >
                    {/* <FaArrowLeft className="me-2" />  */}
                    Back to list of Rooms
                </button>
            </div>

            {/* Card with no specific background for the body, light header, and blue 'ADD ROOM' text */}
            <div className="card shadow-lg" style={{ borderColor: '#ddd' }}>
                <div className="card-header" style={{ backgroundColor: '#f8f9fa', color: '#007bff' }}>
                    <h4 className="mb-0">ADD ROOM</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="row g-3">
                        {/* All fields are now part of a single row g-3 form */}

                        <div className="col-md-4">
                            <label className="form-label" style={{ color: '#333' }}>Location <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="location"
                                value={formData.id.location}
                                onChange={handleChange}
                                readOnly
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label" style={{ color: '#333' }}>Building <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="building"
                                value={formData.id.building}
                                onChange={handleChange}
                                readOnly
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label" style={{ color: '#333' }}>Facility <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="facility"
                                value={formData.id.facility}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label" style={{ color: '#333' }}>Floor <span className="text-danger">*</span></label>
                            <input
                                type="number"
                                className="form-control"
                                name="floorNumber"
                                value={formData.id.floorNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label" style={{ color: '#333' }}>Wing <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="wing"
                                value={formData.id.wing}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label" style={{ color: '#333' }}>Room No <span className="text-danger">*</span></label>
                            <input
                                type="number"
                                className="form-control"
                                name="roomNumber"
                                value={formData.id.roomNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label" style={{ color: '#333' }}>Room Type <span className="text-danger">*</span></label>
                            <select
                                className="form-select"
                                name="roomType"
                                value={formData.roomType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Room Type</option>
                                <option value="ODC (open ODC)">ODC (open ODC)</option>
                                <option value="Training Room">Training Room</option>
                                <option value="Modified ODC">Modified ODC</option>
                                <option value="ODC-Custom TRs">ODC-Custom TRs</option>
                                <option value="Video Conference Room">Video Conference Room</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label" style={{ color: '#333' }}>Room Type - Name Standardized <span className="text-danger">*</span></label>
                            <select
                                className="form-select"
                                name="roomTypeNameStandardized"
                                value={formData.roomTypeNameStandardized}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Standardized Name</option>
                                <option value="Standard">Standard</option>
                                <option value="Custom">Custom</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label" style={{ color: '#333' }}>Priority <span className="text-danger">*</span></label>
                            <select
                                className="form-select"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Priority</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label" style={{ color: '#333' }}>Total Seat Count <span className="text-danger">*</span></label>
                            <input
                                type="number"
                                className="form-control"
                                name="seatCount"
                                value={formData.seatCount}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label" style={{ color: '#333' }}>Seating set-up <span className="text-danger">*</span></label>
                            <input
                                type="number"
                                className="form-control"
                                name="seatingSetup"
                                value={formData.seatingSetup}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                        <div className="col-12 mt-4 text-end">
                            <button type="submit" className="btn btn-primary">ADD ROOM</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddRoom;