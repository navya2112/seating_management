// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import * as XLSX from 'xlsx';

// const ExcelUploadPage = () => {
//     const [excelFile, setExcelFile] = useState(null);
//     const [uploadStatus, setUploadStatus] = useState('');
//     const [uploadError, setUploadError] = useState('');

//     const [downloadLocation, setDownloadLocation] = useState('');
//     const [downloadBuilding, setDownloadBuilding] = useState('');
//     const [downloadRoomNo, setDownloadRoomNo] = useState('');
//     const [downloadMinOccupancy, setDownloadMinOccupancy] = useState('');
//     const [downloadMaxOccupancy, setDownloadMaxOccupancy] = useState('');
//     const [downloadStatus, setDownloadStatus] = useState('');
//     const [downloadError, setDownloadError] = useState('');

//     const [locations, setLocations] = useState([]);
//     const [buildings, setBuildings] = useState([]);
//     const [roomNos, setRoomNos] = useState([]);

//     const ROOM_API_BASE_URL = 'http://localhost:8084';
//     const BATCH_API_BASE_URL = 'http://localhost:8082'; // Corrected port if 8082 is the service port

//     // Effect to fetch initial locations (only runs once on mount)
//     useEffect(() => {
//         const fetchLocations = async () => {
//             try {
//                 const locationsResponse = await fetch(`${BATCH_API_BASE_URL}/api/batches/locations`);
//                 if (locationsResponse.ok) {
//                     const data = await locationsResponse.json();
//                     setLocations(['', ...data]);
//                 } else {
//                     console.error('Failed to fetch locations:', await locationsResponse.text());
//                 }
//             } catch (error) {
//                 console.error('Error fetching initial locations:', error);
//             }
//         };
//         fetchLocations();
//     }, []);

//     // Effect to fetch buildings based on selected location
//     useEffect(() => {
//         const fetchBuildings = async () => {
//             setBuildings(['']); // Reset buildings when location changes
//             setDownloadBuilding(''); // Reset selected building
//             setRoomNos(['']); // Reset room numbers
//             setDownloadRoomNo(''); // Reset selected room number

//             if (downloadLocation) {
//                 try {
//                     const buildingsResponse = await fetch(`${BATCH_API_BASE_URL}/api/batches/buildings?location=${downloadLocation}`);
//                     if (buildingsResponse.ok) {
//                         const data = await buildingsResponse.json();
//                         setBuildings(['', ...data]);
//                     } else {
//                         console.error('Failed to fetch buildings:', await buildingsResponse.text());
//                     }
//                 } catch (error) {
//                     console.error('Error fetching buildings:', error);
//                 }
//             }
//         };
//         fetchBuildings();
//     }, [downloadLocation]); // Re-run when downloadLocation changes

//     // Effect to fetch room numbers based on selected location and building
//     useEffect(() => {
//         const fetchRoomNumbers = async () => {
//             setRoomNos(['']); // Reset room numbers when building changes
//             setDownloadRoomNo(''); // Reset selected room number

//             if (downloadLocation || downloadBuilding) { // Fetch if either location or building is selected
//                 const params = new URLSearchParams();
//                 if (downloadLocation) params.append('location', downloadLocation);
//                 if (downloadBuilding) params.append('building', downloadBuilding);

//                 try {
//                     const roomNosResponse = await fetch(`${BATCH_API_BASE_URL}/api/batches/roomNos?${params.toString()}`);
//                     if (roomNosResponse.ok) {
//                         const data = await roomNosResponse.json();
//                         setRoomNos(['', ...data.sort((a, b) => a - b)]);
//                     } else {
//                         console.error('Failed to fetch room numbers:', await roomNosResponse.text());
//                     }
//                 } catch (error) {
//                     console.error('Error fetching room numbers:', error);
//                 }
//             }
//         };
//         fetchRoomNumbers();
//     }, [downloadLocation, downloadBuilding]); // Re-run when downloadLocation or downloadBuilding changes

//     const formatDate = (excelDate) => {
//         if (excelDate instanceof Date) {
//             return excelDate.toISOString().split('T')[0];
//         }
//         if (typeof excelDate === 'number') {
//             const date = XLSX.SSF.parse_date_code(excelDate);
//             const jsDate = new Date(date.y, date.m - 1, date.d);
//             return jsDate.toISOString().split('T')[0];
//         }
//         if (typeof excelDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(excelDate)) {
//             return excelDate;
//         }
//         return null;
//     };

//     const handleFileChange = (e) => {
//         setExcelFile(e.target.files[0]);
//         setUploadStatus('');
//         setUploadError('');
//     };

//     const handleUpload = async () => {
//         if (!excelFile) {
//             setUploadError('Please select an Excel file to upload.');
//             return;
//         }

//         setUploadStatus('Processing file...');
//         setUploadError('');

//         const reader = new FileReader();
//         reader.onload = async (e) => {
//             try {
//                 const data = new Uint8Array(e.target.result);
//                 const workbook = XLSX.read(data, { type: 'array', cellDates: true, dateNF: 'YYYY-MM-DD' });
//                 const sheetName = workbook.SheetNames[0];
//                 const worksheet = workbook.Sheets[sheetName];

//                 const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//                 if (jsonSheet.length < 2) {
//                     setUploadError('Excel file is empty or contains only headers.');
//                     setUploadStatus('');
//                     return;
//                 }

//                 const headers = jsonSheet[0].map(h => typeof h === 'string' ? h.trim() : '');
//                 const rows = jsonSheet.slice(1);

//                 const roomDetailsToSave = [];
//                 const cohortDetailsToSave = [];
//                 const roomDataErrors = [];
//                 const cohortDataErrors = [];

//                 for (let i = 0; i < rows.length; i++) {
//                     const row = rows[i];
//                     const rowData = {};
//                     headers.forEach((header, index) => {
//                         rowData[header] = row[index];
//                     });

//                     const parsedFloorNumber = parseInt(rowData['Floor']);
//                     const parsedRoomNumber = parseInt(rowData['Room No/Module']);
//                     const parsedSeatCount = parseInt(rowData['Total Seat Count']);
//                     const parsedSeatingSetup = parseInt(rowData['Seating Set-up']);
//                     const parsedInTrainingCount = parseInt(rowData['In-Training Count']);
//                     const parsedGraduatedCount = parseInt(rowData['Graduted']);
//                     const parsedExitCount = parseInt(rowData['Exit']);

//                     // --- Validate and Map to Room Details ---
//                     const requiredRoomFields = [
//                         'Location', 'Facility', 'Building', 'Wing'
//                     ];
//                     let hasAllRoomTextualFields = requiredRoomFields.every(field => rowData[field]);
//                     let hasValidRoomNumbers = !isNaN(parsedFloorNumber) && !isNaN(parsedRoomNumber);

//                     if (hasAllRoomTextualFields && hasValidRoomNumbers) {
//                         roomDetailsToSave.push({
//                             id: {
//                                 location: rowData['Location'],
//                                 facility: rowData['Facility'],
//                                 building: rowData['Building'],
//                                 floorNumber: parsedFloorNumber,
//                                 wing: rowData['Wing'],
//                                 roomNumber: parsedRoomNumber,
//                             },
//                             roomType: rowData['Room Type'],
//                             roomTypeNameStandardized: rowData['Room Type - Name Standardised'],
//                             seatCount: !isNaN(parsedSeatCount) ? parsedSeatCount : 0,
//                             seatingSetup: !isNaN(parsedSeatingSetup) ? parsedSeatingSetup : 0,
//                             priority: rowData['Priority'],
//                             status: rowData['Status'] || 'ACTIVE',
//                         });
//                     } else {
//                         const missingOrInvalidFields = [];
//                         requiredRoomFields.forEach(field => {
//                             if (!rowData[field]) missingOrInvalidFields.push(field);
//                         });
//                         if (isNaN(parsedFloorNumber)) missingOrInvalidFields.push('Floor (invalid number)');
//                         if (isNaN(parsedRoomNumber)) missingOrInvalidFields.push('Room No/Module (invalid number)');
//                         roomDataErrors.push(`Row ${i + 2}: ${missingOrInvalidFields.join(', ')}`);
//                     }

//                     // --- Validate and Map to Cohort Details ---
//                     const requiredCohortFields = [
//                         'Batch Code', 'DOJ', 'Location', 'Facility', 'Building'
//                     ];
//                     let hasAllCohortTextualFields = requiredCohortFields.every(field => rowData[field]);
//                     let hasValidCohortNumbers = !isNaN(parsedFloorNumber) && !isNaN(parsedRoomNumber); // Room/Floor for cohort details as well

//                     if (hasAllCohortTextualFields && hasValidCohortNumbers) {
//                         cohortDetailsToSave.push({
//                             cohortCode: rowData['Batch Code'],
//                             inTrainingCount: !isNaN(parsedInTrainingCount) ? parsedInTrainingCount : 0,
//                             graduatedCount: !isNaN(parsedGraduatedCount) ? parsedGraduatedCount : 0,
//                             exitCount: !isNaN(parsedExitCount) ? parsedExitCount : 0,
//                             trainingStartDate: formatDate(rowData['Training Start Date']),
//                             trainingEndDate: formatDate(rowData['Training End Date']),
//                             batchOwner: rowData['TR Name'],
//                             dateOfJoining: formatDate(rowData['DOJ']),
//                             sl: rowData['SL'],
//                             practice: rowData['Practice'],
//                             location: rowData['Location'],
//                             facility: rowData['Facility'],
//                             building: rowData['Building'],
//                             floorNumber: parsedFloorNumber,
//                             roomNo: parsedRoomNumber,
//                         });
//                     } else {
//                         const missingOrInvalidFields = [];
//                         requiredCohortFields.forEach(field => {
//                             if (!rowData[field]) missingOrInvalidFields.push(field);
//                         });
//                         if (isNaN(parsedFloorNumber)) missingOrInvalidFields.push('Floor (invalid number)');
//                         if (isNaN(parsedRoomNumber)) missingOrInvalidFields.push('Room No/Module (invalid number)');
//                         cohortDataErrors.push(`Row ${i + 2}: ${missingOrInvalidFields.join(', ')}`);
//                     }
//                 }

//                 let combinedPreUploadErrors = '';
//                 if (roomDataErrors.length > 0) {
//                     combinedPreUploadErrors += `Errors in Room Data (These rows will be skipped):\n- ${roomDataErrors.join('\n- ')}\n\n`;
//                 }
//                 if (cohortDataErrors.length > 0) {
//                     combinedPreUploadErrors += `Errors in Cohort Data (These rows will be skipped):\n- ${cohortDataErrors.join('\n- ')}\n\n`;
//                 }

//                 if (roomDetailsToSave.length === 0 && cohortDetailsToSave.length === 0) {
//                     setUploadError(`No valid room or cohort data could be parsed from the Excel file after validation. Please check headers, required fields, and data types, especially for numeric columns like 'Room No/Module' and 'Floor'.\n\n${combinedPreUploadErrors.trim()}`);
//                     setUploadStatus('');
//                     return;
//                 }

//                 if (combinedPreUploadErrors) {
//                     setUploadStatus('Some rows skipped due to invalid data. Attempting to upload valid data...');
//                     setUploadError(combinedPreUploadErrors.trim());
//                 }

//                 console.log("Parsed Room Details for Backend:", roomDetailsToSave);
//                 console.log("Parsed Cohort Details for Backend:", cohortDetailsToSave);

//                 let allUploadSuccess = true;
//                 let combinedPostUploadErrorMessage = combinedPreUploadErrors;

//                 // 1. Send Room Details
//                 if (roomDetailsToSave.length > 0) {
//                     setUploadStatus('Uploading Room Details...');
//                     try {
//                         const roomResponse = await fetch(`${ROOM_API_BASE_URL}/api/rooms/add-batch`, {
//                             method: 'POST',
//                             headers: { 'Content-Type': 'application/json' },
//                             body: JSON.stringify(roomDetailsToSave),
//                         });
//                         if (!roomResponse.ok) {
//                             const errorText = await roomResponse.text();
//                             throw new Error(`Failed to add rooms in batch: ${roomResponse.status} - ${errorText}`);
//                         }
//                         console.log('Room details uploaded successfully.');
//                     } catch (error) {
//                         combinedPostUploadErrorMessage += `\nRoom Upload Error: ${error.message}`;
//                         allUploadSuccess = false;
//                     }
//                 } else {
//                     console.log("No valid room details to upload.");
//                 }

//                 // 2. Send Cohort Details
//                 if (cohortDetailsToSave.length > 0) {
//                     setUploadStatus('Uploading Cohort Details...');
//                     try {
//                         const cohortResponse = await fetch(`${BATCH_API_BASE_URL}/api/batches/upload-batch`, {
//                             method: 'POST',
//                             headers: { 'Content-Type': 'application/json' },
//                             body: JSON.stringify(cohortDetailsToSave),
//                         });
//                         if (!cohortResponse.ok) {
//                             const errorText = await cohortResponse.text();
//                             throw new Error(`Failed to upload cohort details: ${cohortResponse.status} - ${errorText}`);
//                         }
//                         console.log('Cohort details uploaded successfully.');
//                     } catch (error) {
//                         combinedPostUploadErrorMessage += `\nCohort Upload Error: ${error.message}`;
//                         allUploadSuccess = false;
//                     }
//                 } else {
//                     console.log("No valid cohort details to upload.");
//                 }

//                 if (allUploadSuccess && !combinedPreUploadErrors) {
//                     setUploadStatus('All data uploaded successfully!');
//                     setUploadError('');
//                 } else if (allUploadSuccess && combinedPreUploadErrors) {
//                     setUploadStatus('Upload completed. Some rows were skipped due to errors.');
//                     setUploadError(combinedPostUploadErrorMessage.trim());
//                 }
//                 else {
//                     setUploadStatus('Upload completed with errors.');
//                     setUploadError(combinedPostUploadErrorMessage.trim());
//                 }

//                 setExcelFile(null);
//             } catch (error) {
//                 console.error("Critical error processing Excel file or during upload:", error);
//                 setUploadError(`Critical error during file processing or API call: ${error.message}`);
//                 setUploadStatus('');
//             }
//         };
//         reader.readAsArrayBuffer(excelFile);
//     };

//     const handleDownload = async () => {
//         setDownloadStatus('Generating download...');
//         setDownloadError('');

//         const params = new URLSearchParams();
//         if (downloadLocation) params.append('location', downloadLocation);
//         if (downloadBuilding) params.append('building', downloadBuilding);
//         if (downloadRoomNo && !isNaN(parseInt(downloadRoomNo))) params.append('roomNo', downloadRoomNo);
//         if (downloadMinOccupancy) params.append('minOccupancy', downloadMinOccupancy);
//         if (downloadMaxOccupancy) params.append('maxOccupancy', downloadMaxOccupancy);

//         // The backend now generates XLSX by default for this endpoint
//         const url = `${BATCH_API_BASE_URL}/api/batches/download_batches?${params.toString()}`;

//         try {
//             const response = await fetch(url);

//             if (response.status === 204) {
//                 setDownloadError('No batches found matching the selected filters.');
//                 setDownloadStatus('');
//                 return;
//             }

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`Failed to download batches: ${response.status} - ${errorText}`);
//             }

//             const contentDisposition = response.headers.get('Content-Disposition');
//             let filename = 'batches.xlsx'; // Default to .xlsx
//             if (contentDisposition) {
//                 const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
//                 if (filenameMatch && filenameMatch[1]) {
//                     filename = filenameMatch[1];
//                 }
//             }

//             const blob = await response.blob();

//             // This check is good practice
//             if (!blob.type.includes('spreadsheetml.sheet')) { // Specifically check for .xlsx MIME type
//                 console.warn('Received content type is not XLSX:', blob.type);
//                 setDownloadError(`Received unexpected file format: ${blob.type}. Expected XLSX.`);
//                 setDownloadStatus('');
//                 return;
//             }

//             const downloadUrl = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = downloadUrl;
//             link.setAttribute('download', filename);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//             window.URL.revokeObjectURL(downloadUrl);

//             setDownloadStatus('Download successful!');
//         } catch (error) {
//             console.error("Error during download:", error);
//             setDownloadError(`Download failed: ${error.message}`);
//             setDownloadStatus('');
//         }
//     };


//     return (
//         <div className="container mt-4">
//             {/* Upload Section */}
//             <div className="card mb-4 shadow-sm">
//                 <div className="card-header bg-info text-white">
//                     <h5>📊 Upload Data from Excel</h5>
//                 </div>
//                 <div className="card-body">
//                     <div className="mb-3">
//                         <label htmlFor="excelUpload" className="form-label">
//                             Select Excel File (XLSX, XLS)
//                         </label>
//                         <input
//                             type="file"
//                             className="form-control"
//                             id="excelUpload"
//                             accept=".xlsx, .xls"
//                             onChange={handleFileChange}
//                         />
//                     </div>
//                     <button
//                         className="btn btn-primary"
//                         onClick={handleUpload}
//                         disabled={!excelFile || uploadStatus.startsWith('Processing') || uploadStatus.startsWith('Uploading')}
//                     >
//                         {uploadStatus.startsWith('Processing') || uploadStatus.startsWith('Uploading') ? 'Uploading...' : 'Upload Data'}
//                     </button>
//                     {uploadStatus && !uploadError && <p className="mt-2 text-success">{uploadStatus}</p>}
//                     {uploadError && <div className="mt-2 text-danger text-wrap" style={{ whiteSpace: 'pre-wrap' }}>{uploadError}</div>}
//                     {uploadStatus && uploadError && <p className="mt-2 text-warning">Upload completed with errors. See above for details.</p>}
//                     <p className="mt-3 text-muted small">
//                         Expected Excel Headers for Rooms: "Location", "Facility", "Building", "Floor", "Wing", "Room No/Module", "Room Type", "Room Type - Name Standardised", "Total Seat Count", "Seating Set-up", "Priority", "Status"<br/>
//                         Expected Excel Headers for Cohorts: "Batch Code", "In-Training Count", "<strong class='text-danger'>Graduted</strong>", "Exit", "Training Start Date", "Training End Date", "<strong class='text-danger'>TR Name</strong>", "DOJ", "SL", "Practice" (plus room identifiers: "Location", "Facility", "Building", "Floor", "Room No/Module")
//                     </p>
//                 </div>
//             </div>

//             {/* Download Section */}
//             <div className="card shadow-sm">
//                 <div className="card-header bg-success text-white">
//                     <h5>⬇️ Download Batch Data</h5>
//                 </div>
//                 <div className="card-body">
//                     <div className="row g-3">
//                         {/* Location Dropdown */}
//                         <div className="col-md-6">
//                             <label htmlFor="downloadLocation" className="form-label">Location</label>
//                             <select
//                                 className="form-select"
//                                 id="downloadLocation"
//                                 value={downloadLocation}
//                                 onChange={(e) => setDownloadLocation(e.target.value)}
//                             >
//                                 <option value="">All Locations</option>
//                                 {locations.map((loc, index) => (
//                                     <option key={index} value={loc}>{loc}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         {/* Building Dropdown */}
//                         <div className="col-md-6">
//                             <label htmlFor="downloadBuilding" className="form-label">Building</label>
//                             <select
//                                 className="form-select"
//                                 id="downloadBuilding"
//                                 value={downloadBuilding}
//                                 onChange={(e) => setDownloadBuilding(e.target.value)}
//                                 // Disable if no location is selected (optional, but good UX)
//                                 disabled={!downloadLocation && locations.length > 1}
//                             >
//                                 <option value="">All Buildings</option>
//                                 {buildings.map((bld, index) => (
//                                     <option key={index} value={bld}>{bld}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         {/* Room No Dropdown */}
//                         <div className="col-md-6">
//                             <label htmlFor="downloadRoomNo" className="form-label">Room No</label>
//                             <select
//                                 className="form-select"
//                                 id="downloadRoomNo"
//                                 value={downloadRoomNo}
//                                 onChange={(e) => setDownloadRoomNo(e.target.value)}
//                                 // Disable if no location or building is selected (optional)
//                                 disabled={(!downloadLocation && !downloadBuilding) && (locations.length > 1 || buildings.length > 1)}
//                             >
//                                 <option value="">All Rooms</option>
//                                 {roomNos.map((room, index) => (
//                                     <option key={index} value={room}>{room}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         {/* Min Occupancy Input */}
//                         <div className="col-md-6">
//                             <label htmlFor="downloadMinOccupancy" className="form-label">Min Occupancy (In-Training Count)</label>
//                             <input
//                                 type="number"
//                                 className="form-control"
//                                 id="downloadMinOccupancy"
//                                 value={downloadMinOccupancy}
//                                 onChange={(e) => setDownloadMinOccupancy(e.target.value)}
//                                 placeholder="e.g., 10"
//                             />
//                         </div>
//                         {/* Max Occupancy Input */}
//                         <div className="col-md-6">
//                             <label htmlFor="downloadMaxOccupancy" className="form-label">Max Occupancy (In-Training Count)</label>
//                             <input
//                                 type="number"
//                                 className="form-control"
//                                 id="downloadMaxOccupancy"
//                                 value={downloadMaxOccupancy}
//                                 onChange={(e) => setDownloadMaxOccupancy(e.target.value)}
//                                 placeholder="e.g., 50"
//                             />
//                         </div>
//                     </div>

//                     <button
//                         className="btn btn-success mt-4"
//                         onClick={handleDownload}
//                         disabled={downloadStatus.startsWith('Generating')}
//                     >
//                         {downloadStatus.startsWith('Generating') ? 'Generating...' : 'Download Filtered Data'}
//                     </button>

//                     {downloadStatus && !downloadError && <p className="mt-2 text-success">{downloadStatus}</p>}
//                     {downloadError && <p className="mt-2 text-danger text-wrap">{downloadError}</p>}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ExcelUploadPage;




import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';

const ExcelUploadPage = () => {
    const [excelFile, setExcelFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [uploadError, setUploadError] = useState('');

    const ROOM_API_BASE_URL = 'http://localhost:8084';
    const BATCH_API_BASE_URL = 'http://localhost:8082';

    // Define the primary color to match the Bootstrap 'bg-primary' for consistency
    // Bootstrap's default primary color is usually #007bff
    const primaryColor = '#007bff';

    const formatDate = (excelDate) => {
        if (excelDate instanceof Date) {
            return excelDate.toISOString().split('T')[0];
        }
        if (typeof excelDate === 'number') {
            const date = XLSX.SSF.parse_date_code(excelDate);
            const jsDate = new Date(date.y, date.m - 1, date.d);
            return jsDate.toISOString().split('T')[0];
        }
        if (typeof excelDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(excelDate)) {
            return excelDate;
        }
        return null;
    };

    const handleFileChange = (e) => {
        setExcelFile(e.target.files[0]);
        setUploadStatus('');
        setUploadError('');
    };

    const handleUpload = async () => {
        if (!excelFile) {
            setUploadError('Please select an Excel file to upload.');
            return;
        }

        setUploadStatus('Processing file...');
        setUploadError('');

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array', cellDates: true, dateNF: 'YYYY-MM-DD' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (jsonSheet.length < 2) {
                    setUploadError('Excel file is empty or contains only headers.');
                    setUploadStatus('');
                    return;
                }

                const headers = jsonSheet[0].map(h => typeof h === 'string' ? h.trim() : '');
                const rows = jsonSheet.slice(1);

                const roomDetailsToSave = [];
                const cohortDetailsToSave = [];
                const roomDataErrors = [];
                const cohortDataErrors = [];

                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    const rowData = {};
                    headers.forEach((header, index) => {
                        rowData[header] = row[index];
                    });

                    const parsedFloorNumber = parseInt(rowData['Floor']);
                    const parsedRoomNumber = parseInt(rowData['Room No/Module']);
                    const parsedSeatCount = parseInt(rowData['Total Seat Count']);
                    const parsedSeatingSetup = parseInt(rowData['Seating Set-up']);
                    const parsedInTrainingCount = parseInt(rowData['In-Training Count']);
                    const parsedGraduatedCount = parseInt(rowData['Graduted']);
                    const parsedExitCount = parseInt(rowData['Exit']);

                    // --- Validate and Map to Room Details ---
                    const requiredRoomFields = [
                        'Location', 'Facility', 'Building', 'Wing'
                    ];
                    let hasAllRoomTextualFields = requiredRoomFields.every(field => rowData[field]);
                    let hasValidRoomNumbers = !isNaN(parsedFloorNumber) && !isNaN(parsedRoomNumber);

                    if (hasAllRoomTextualFields && hasValidRoomNumbers) {
                        roomDetailsToSave.push({
                            id: {
                                location: rowData['Location'],
                                facility: rowData['Facility'],
                                building: rowData['Building'],
                                floorNumber: parsedFloorNumber,
                                wing: rowData['Wing'],
                                roomNumber: parsedRoomNumber,
                            },
                            roomType: rowData['Room Type'],
                            roomTypeNameStandardized: rowData['Room Type - Name Standardised'],
                            seatCount: !isNaN(parsedSeatCount) ? parsedSeatCount : 0,
                            seatingSetup: !isNaN(parsedSeatingSetup) ? parsedSeatingSetup : 0,
                            priority: rowData['Priority'],
                            status: rowData['Status'] || 'ACTIVE',
                        });
                    } else {
                        const missingOrInvalidFields = [];
                        requiredRoomFields.forEach(field => {
                            if (!rowData[field]) missingOrInvalidFields.push(field);
                        });
                        if (isNaN(parsedFloorNumber)) missingOrInvalidFields.push('Floor (invalid number)');
                        if (isNaN(parsedRoomNumber)) missingOrInvalidFields.push('Room No/Module (invalid number)');
                        roomDataErrors.push(`Row ${i + 2}: ${missingOrInvalidFields.join(', ')}`);
                    }

                    // --- Validate and Map to Cohort Details ---
                    const requiredCohortFields = [
                        'Batch Code', 'DOJ', 'Location', 'Facility', 'Building'
                    ];
                    let hasAllCohortTextualFields = requiredCohortFields.every(field => rowData[field]);
                    let hasValidCohortNumbers = !isNaN(parsedFloorNumber) && !isNaN(parsedRoomNumber); // Room/Floor for cohort details as well

                    if (hasAllCohortTextualFields && hasValidCohortNumbers) {
                        cohortDetailsToSave.push({
                            cohortCode: rowData['Batch Code'],
                            inTrainingCount: !isNaN(parsedInTrainingCount) ? parsedInTrainingCount : 0,
                            graduatedCount: !isNaN(parsedGraduatedCount) ? parsedGraduatedCount : 0,
                            exitCount: !isNaN(parsedExitCount) ? parsedExitCount : 0,
                            trainingStartDate: formatDate(rowData['Training Start Date']),
                            trainingEndDate: formatDate(rowData['Training End Date']),
                            batchOwner: rowData['TR Name'],
                            dateOfJoining: formatDate(rowData['DOJ']),
                            sl: rowData['SL'],
                            practice: rowData['Practice'],
                            location: rowData['Location'],
                            facility: rowData['Facility'],
                            building: rowData['Building'],
                            floorNumber: parsedFloorNumber,
                            roomNo: parsedRoomNumber,
                        });
                    } else {
                        const missingOrInvalidFields = [];
                        requiredCohortFields.forEach(field => {
                            if (!rowData[field]) missingOrInvalidFields.push(field);
                        });
                        if (isNaN(parsedFloorNumber)) missingOrInvalidFields.push('Floor (invalid number)');
                        if (isNaN(parsedRoomNumber)) missingOrInvalidFields.push('Room No/Module (invalid number)');
                        cohortDataErrors.push(`Row ${i + 2}: ${missingOrInvalidFields.join(', ')}`);
                    }
                }

                let combinedPreUploadErrors = '';
                if (roomDataErrors.length > 0) {
                    combinedPreUploadErrors += `Errors in Room Data (These rows will be skipped):\n- ${roomDataErrors.join('\n- ')}\n\n`;
                }
                if (cohortDataErrors.length > 0) {
                    combinedPreUploadErrors += `Errors in Cohort Data (These rows will be skipped):\n- ${cohortDataErrors.join('\n- ')}\n\n`;
                }

                if (roomDetailsToSave.length === 0 && cohortDetailsToSave.length === 0) {
                    setUploadError(`No valid room or cohort data could be parsed from the Excel file after validation. Please check headers, required fields, and data types, especially for numeric columns like 'Room No/Module' and 'Floor'.\n\n${combinedPreUploadErrors.trim()}`);
                    setUploadStatus('');
                    return;
                }

                if (combinedPreUploadErrors) {
                    setUploadStatus('Some rows skipped due to invalid data. Attempting to upload valid data...');
                    setUploadError(combinedPreUploadErrors.trim());
                }

                console.log("Parsed Room Details for Backend:", roomDetailsToSave);
                console.log("Parsed Cohort Details for Backend:", cohortDetailsToSave);

                let allUploadSuccess = true;
                let combinedPostUploadErrorMessage = combinedPreUploadErrors;

                // 1. Send Room Details
                if (roomDetailsToSave.length > 0) {
                    setUploadStatus('Uploading Room Details...');
                    try {
                        const roomResponse = await fetch(`${ROOM_API_BASE_URL}/api/rooms/add-batch`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(roomDetailsToSave),
                        });
                        if (!roomResponse.ok) {
                            const errorText = await roomResponse.text();
                            throw new Error(`Failed to add rooms in batch: ${roomResponse.status} - ${errorText}`);
                        }
                        console.log('Room details uploaded successfully.');
                    } catch (error) {
                        combinedPostUploadErrorMessage += `\nRoom Upload Error: ${error.message}`;
                        allUploadSuccess = false;
                    }
                } else {
                    console.log("No valid room details to upload.");
                }

                // 2. Send Cohort Details
                if (cohortDetailsToSave.length > 0) {
                    setUploadStatus('Uploading Cohort Details...');
                    try {
                        const cohortResponse = await fetch(`${BATCH_API_BASE_URL}/api/batches/upload-batch`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(cohortDetailsToSave),
                        });
                        if (!cohortResponse.ok) {
                            const errorText = await cohortResponse.text();
                            throw new Error(`Failed to upload cohort details: ${cohortResponse.status} - ${errorText}`);
                        }
                        console.log('Cohort details uploaded successfully.');
                    } catch (error) {
                        combinedPostUploadErrorMessage += `\nCohort Upload Error: ${error.message}`;
                        allUploadSuccess = false;
                    }
                } else {
                    console.log("No valid cohort details to upload.");
                }

                if (allUploadSuccess && !combinedPreUploadErrors) {
                    setUploadStatus('All data uploaded successfully!');
                    setUploadError('');
                } else if (allUploadSuccess && combinedPreUploadErrors) {
                    setUploadStatus('Upload completed. Some rows were skipped due to errors.');
                    setUploadError(combinedPostUploadErrorMessage.trim());
                }
                else {
                    setUploadStatus('Upload completed with errors.');
                    setUploadError(combinedPostUploadErrorMessage.trim());
                }

                setExcelFile(null);
            } catch (error) {
                console.error("Critical error processing Excel file or during upload:", error);
                setUploadError(`Critical error during file processing or API call: ${error.message}`);
                setUploadStatus('');
            }
        };
        reader.readAsArrayBuffer(excelFile);
    };

    return (
        <div className="container mt-4">
            {/* Upload Section */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h5>📊 Upload Data from Excel</h5>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="excelUpload" className="form-label">
                            Select Excel File (XLSX, XLS)
                        </label>
                        <input
                            type="file"
                            className="form-control"
                            id="excelUpload"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                        />
                    </div>
                    <button
                        // Apply inline styles to match the header color
                        style={{
                            // backgroundColor: primaryColor,
                            borderColor: primaryColor,
                            color: '#fff' // White text for contrast
                        }}
                        className="btn bg-primary" // Keep 'btn' for basic Bootstrap button styling
                        onClick={handleUpload}
                        disabled={!excelFile || uploadStatus.startsWith('Processing') || uploadStatus.startsWith('Uploading')}
                    >
                        {uploadStatus.startsWith('Processing') || uploadStatus.startsWith('Uploading') ? 'Uploading...' : 'Upload Data'}
                    </button>
                    {uploadStatus && !uploadError && <p className="mt-2 text-success">{uploadStatus}</p>}
                    {uploadError && <div className="mt-2 text-danger text-wrap" style={{ whiteSpace: 'pre-wrap' }}>{uploadError}</div>}
                    {uploadStatus && uploadError && <p className="mt-2 text-warning">Upload completed with errors. See above for details.</p>}
                    <p className="mt-3 text-muted small">
                        Expected Excel Headers for Rooms: "Location", "Facility", "Building", "Floor", "Wing", "Room No/Module", "Room Type", "Room Type - Name Standardised", "Total Seat Count", "Seating Set-up", "Priority", "Status"<br/>
                        Expected Excel Headers for Cohorts: "Batch Code", "In-Training Count", "Graduted", "Exit", "Training Start Date", "Training End Date", "TR Name", "DOJ", "SL", "Practice" (plus room identifiers: "Location", "Facility", "Building", "Floor", "Room No/Module")
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExcelUploadPage;