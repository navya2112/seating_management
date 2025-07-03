import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';

const ExcelUploadPage = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Base URL for your Spring Boot backend. Adjust if different.
  const API_BASE_URL = 'http://localhost:8084';

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
    setUploadStatus('');
    setUploadError('');
  };

  // Helper function to format dates from Excel
  const formatDate = (excelDate) => {
    if (excelDate instanceof Date) {
      return excelDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }
    // If it's a number (Excel date), convert it
    if (typeof excelDate === 'number') {
        const date = XLSX.SSF.parse_date_code(excelDate);
        const jsDate = new Date(date.y, date.m -1, date.d); // Month is 0-indexed in JS Date
        return jsDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }
    // If it's already a string in YYYY-MM-DD format, return as is.
    if (typeof excelDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(excelDate)) {
        return excelDate;
    }
    return null; // Return null for invalid or unparseable dates
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

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = row[index];
          });

          // --- Map to Room Details (using your Room and RoomId entity structure) ---
          if (rowData['Location'] && rowData['Facility'] && rowData['Building'] && rowData['Floor'] && rowData['Room No/Module'] && rowData['Wing']) {
            roomDetailsToSave.push({
              id: {
                location: rowData['Location'],
                facility: rowData['Facility'],
                building: rowData['Building'],
                floorNumber: parseInt(rowData['Floor']),
                wing: rowData['Wing'],
                roomNumber: parseInt(rowData['Room No/Module']),
              },
              roomType: rowData['Room Type'],
              roomTypeNameStandardized: rowData['Room Type - Name Standardised'],
              seatCount: parseInt(rowData['Total Seat Count']),
              seatingSetup: parseInt(rowData['Seating Set-up']),
              priority: rowData['Priority'],
              status: rowData['Status'] || 'ACTIVE',
            });
          }

          // --- Map to Cohort Details (using your CohortDetail entity structure) ---
          if (rowData['Batch Code'] && rowData['DOJ']) {
            cohortDetailsToSave.push({
              cohortCode: rowData['Batch Code'],
              inTrainingCount: parseInt(rowData['In-Training Count']) || 0,
              graduatedCount: parseInt(rowData['Graduted']) || 0,
              exitCount: parseInt(rowData['Exit']) || 0,
              trainingStartDate: formatDate(rowData['Training Start Date']),
              trainingEndDate: formatDate(rowData['Training End Date']),
              batchOwner: rowData['Batch Owner'],
              dateOfJoining: formatDate(rowData['DOJ']),
              sl: rowData['SL'],
              practice: rowData['Practice'],
              location: rowData['Location'],
              facility: rowData['Facility'],
              building: rowData['Building'],
              floorNumber: parseInt(rowData['Floor']),
              roomNo: parseInt(rowData['Room No/Module']),
            });
          }
        }

        if (roomDetailsToSave.length === 0 && cohortDetailsToSave.length === 0) {
            setUploadError("No valid room or cohort data could be parsed from the Excel file. Check headers and data types.");
            setUploadStatus('');
            return;
        }

        console.log("Parsed Room Details for Backend:", roomDetailsToSave);
        console.log("Parsed Cohort Details for Backend:", cohortDetailsToSave);

        let allUploadSuccess = true;
        let combinedErrorMessage = '';

        // 1. Send Room Details
        if (roomDetailsToSave.length > 0) {
            setUploadStatus('Uploading Room Details...');
            try {
              const roomResponse = await fetch(`http://localhost:8084/api/rooms/add-batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(roomDetailsToSave),
              });
              if (!roomResponse.ok) {
                const errorText = await roomResponse.text();
                throw new Error(`Failed to upload room details: ${roomResponse.status} - ${errorText}`);
              }
              console.log('Room details uploaded successfully.');
            } catch (error) {
              combinedErrorMessage += `\nRoom Upload Error: ${error.message}`;
              allUploadSuccess = false;
            }
        } else {
            console.log("No room details to upload.");
        }

        // 2. Send Cohort Details
        if (cohortDetailsToSave.length > 0) {
            setUploadStatus('Uploading Cohort Details...');        
            try {
              const cohortResponse = await fetch(`http://localhost:8082/api/batches/upload-batch`, {
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
              combinedErrorMessage += `\nCohort Upload Error: ${error.message}`;
              allUploadSuccess = false;
            }
        } else {
            console.log("No cohort details to upload.");
        }

        if (allUploadSuccess) {
            setUploadStatus('All data uploaded successfully!');
        } else {
            setUploadStatus('Upload completed with errors.');
            setUploadError(combinedErrorMessage.trim());
        }

        setExcelFile(null); // Clear file input
        // You might want to trigger a refresh of data in other components if they depend on this upload
      } catch (error) {
        console.error("Critical error processing Excel file or during upload:", error);
        setUploadError(`Critical error: ${error.message}`);
        setUploadStatus('');
      }
    };
    reader.readAsArrayBuffer(excelFile);
  };

  return (
    <div className="container mt-4">
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-info text-white">
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
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!excelFile || uploadStatus.startsWith('Processing') || uploadStatus.startsWith('Uploading')}
          >
            {uploadStatus.startsWith('Processing') || uploadStatus.startsWith('Uploading') ? 'Uploading...' : 'Upload Data'}
          </button>
          {uploadStatus && !uploadError && <p className="mt-2 text-success">{uploadStatus}</p>}
          {uploadError && <p className="mt-2 text-danger text-wrap">{uploadError}</p>}
          {uploadStatus && uploadError && <p className="mt-2 text-warning">Upload completed with errors. See above.</p>}
          <p className="mt-3 text-muted small">
            Expected Excel Headers for Rooms: "Location", "Facility", "Building", "Floor", "Wing", "Room No/Module", "Room Type", "Room Type - Name Standardised", "Total Seat Count", "Seating Set-up", "Priority", "Status"<br/>
            Expected Excel Headers for Cohorts: "Batch Code", "In-Training Count", "Graduted", "Exit", "Training Start Date", "Training End Date", "Batch Owner", "DOJ", "SL", "Practice" (plus room identifiers: "Location", "Facility", "Building", "Floor", "Room No/Module")
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExcelUploadPage;