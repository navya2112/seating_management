// src/pages/DownloadPage.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// Note: XLSX is not needed in DownloadPage if the backend sends the file directly
// import * as XLSX from 'xlsx'; // Remove this if not used for parsing downloaded file

const DownloadPage = () => {
    const [downloadLocation, setDownloadLocation] = useState('');
    const [downloadBuilding, setDownloadBuilding] = useState('');
    const [downloadRoomNo, setDownloadRoomNo] = useState('');
    const [downloadMinOccupancy, setDownloadMinOccupancy] = useState('');
    const [downloadMaxOccupancy, setDownloadMaxOccupancy] = useState('');
    const [downloadStatus, setDownloadStatus] = useState('');
    const [downloadError, setDownloadError] = useState('');

    const [locations, setLocations] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [roomNos, setRoomNos] = useState([]);

    const BATCH_API_BASE_URL = 'http://localhost:8082'; // Corrected port if 8082 is the service port

    // Effect to fetch initial locations (only runs once on mount)
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const locationsResponse = await fetch(`${BATCH_API_BASE_URL}/api/batches/locations`);
                if (locationsResponse.ok) {
                    const data = await locationsResponse.json();
                    setLocations(['', ...data]);
                } else {
                    console.error('Failed to fetch locations:', await locationsResponse.text());
                }
            } catch (error) {
                console.error('Error fetching initial locations:', error);
            }
        };
        fetchLocations();
    }, []);

    // Effect to fetch buildings based on selected location
    useEffect(() => {
        const fetchBuildings = async () => {
            setBuildings(['']); // Reset buildings when location changes
            setDownloadBuilding(''); // Reset selected building
            setRoomNos(['']); // Reset room numbers
            setDownloadRoomNo(''); // Reset selected room number

            if (downloadLocation) {
                try {
                    const buildingsResponse = await fetch(`${BATCH_API_BASE_URL}/api/batches/buildings?location=${downloadLocation}`);
                    if (buildingsResponse.ok) {
                        const data = await buildingsResponse.json();
                        setBuildings(['', ...data]);
                    } else {
                        console.error('Failed to fetch buildings:', await buildingsResponse.text());
                    }
                } catch (error) {
                    console.error('Error fetching buildings:', error);
                }
            }
        };
        fetchBuildings();
    }, [downloadLocation]); // Re-run when downloadLocation changes

    // Effect to fetch room numbers based on selected location and building
    useEffect(() => {
        const fetchRoomNumbers = async () => {
            setRoomNos(['']); // Reset room numbers when building changes
            setDownloadRoomNo(''); // Reset selected room number

            if (downloadLocation || downloadBuilding) { // Fetch if either location or building is selected
                const params = new URLSearchParams();
                if (downloadLocation) params.append('location', downloadLocation);
                if (downloadBuilding) params.append('building', downloadBuilding);

                try {
                    const roomNosResponse = await fetch(`${BATCH_API_BASE_URL}/api/batches/roomNos?${params.toString()}`);
                    if (roomNosResponse.ok) {
                        const data = await roomNosResponse.json();
                        setRoomNos(['', ...data.sort((a, b) => a - b)]);
                    } else {
                        console.error('Failed to fetch room numbers:', await roomNosResponse.text());
                    }
                } catch (error) {
                    console.error('Error fetching room numbers:', error);
                }
            }
        };
        fetchRoomNumbers();
    }, [downloadLocation, downloadBuilding]); // Re-run when downloadLocation or downloadBuilding changes

    const handleDownload = async () => {
        setDownloadStatus('Generating download...');
        setDownloadError('');

        const params = new URLSearchParams();
        if (downloadLocation) params.append('location', downloadLocation);
        if (downloadBuilding) params.append('building', downloadBuilding);
        if (downloadRoomNo && !isNaN(parseInt(downloadRoomNo))) params.append('roomNo', downloadRoomNo);
        if (downloadMinOccupancy) params.append('minOccupancy', downloadMinOccupancy);
        if (downloadMaxOccupancy) params.append('maxOccupancy', downloadMaxOccupancy);

        // The backend now generates XLSX by default for this endpoint
        const url = `${BATCH_API_BASE_URL}/api/batches/download_batches?${params.toString()}`;

        try {
            const response = await fetch(url);

            if (response.status === 204) {
                setDownloadError('No batches found matching the selected filters.');
                setDownloadStatus('');
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to download batches: ${response.status} - ${errorText}`);
            }

            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'batches.xlsx'; // Default to .xlsx
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }

            const blob = await response.blob();

            // This check is good practice
            if (!blob.type.includes('spreadsheetml.sheet')) { // Specifically check for .xlsx MIME type
                console.warn('Received content type is not XLSX:', blob.type);
                setDownloadError(`Received unexpected file format: ${blob.type}. Expected XLSX.`);
                setDownloadStatus('');
                return;
            }

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

            setDownloadStatus('Download successful!');
        } catch (error) {
            console.error("Error during download:", error);
            setDownloadError(`Download failed: ${error.message}`);
            setDownloadStatus('');
        }
    };

    return (
        <div className="container mt-4">
            {/* Download Section */}
            <div className="card shadow-sm">
                <div className="card-header bg-success text-white">
                    <h5>⬇️ Download Batch Data</h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        {/* Location Dropdown */}
                        <div className="col-md-6">
                            <label htmlFor="downloadLocation" className="form-label">Location</label>
                            <select
                                className="form-select"
                                id="downloadLocation"
                                value={downloadLocation}
                                onChange={(e) => setDownloadLocation(e.target.value)}
                            >
                                <option value="">All Locations</option>
                                {locations.map((loc, index) => (
                                    <option key={index} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                        {/* Building Dropdown */}
                        <div className="col-md-6">
                            <label htmlFor="downloadBuilding" className="form-label">Building</label>
                            <select
                                className="form-select"
                                id="downloadBuilding"
                                value={downloadBuilding}
                                onChange={(e) => setDownloadBuilding(e.target.value)}
                                disabled={!downloadLocation && locations.length > 1}
                            >
                                <option value="">All Buildings</option>
                                {buildings.map((bld, index) => (
                                    <option key={index} value={bld}>{bld}</option>
                                ))}
                            </select>
                        </div>
                        {/* Room No Dropdown */}
                        <div className="col-md-6">
                            <label htmlFor="downloadRoomNo" className="form-label">Room No</label>
                            <select
                                className="form-select"
                                id="downloadRoomNo"
                                value={downloadRoomNo}
                                onChange={(e) => setDownloadRoomNo(e.target.value)}
                                disabled={(!downloadLocation && !downloadBuilding) && (locations.length > 1 || buildings.length > 1)}
                            >
                                <option value="">All Rooms</option>
                                {roomNos.map((room, index) => (
                                    <option key={index} value={room}>{room}</option>
                                ))}
                            </select>
                        </div>
                        {/* Min Occupancy Input */}
                        <div className="col-md-6">
                            <label htmlFor="downloadMinOccupancy" className="form-label">Min Occupancy (In-Training Count)</label>
                            <input
                                type="number"
                                className="form-control"
                                id="downloadMinOccupancy"
                                value={downloadMinOccupancy}
                                onChange={(e) => setDownloadMinOccupancy(e.target.value)}
                                placeholder="e.g., 10"
                            />
                        </div>
                        {/* Max Occupancy Input */}
                        <div className="col-md-6">
                            <label htmlFor="downloadMaxOccupancy" className="form-label">Max Occupancy (In-Training Count)</label>
                            <input
                                type="number"
                                className="form-control"
                                id="downloadMaxOccupancy"
                                value={downloadMaxOccupancy}
                                onChange={(e) => setDownloadMaxOccupancy(e.target.value)}
                                placeholder="e.g., 50"
                            />
                        </div>
                    </div>

                    <button
                        className="btn btn-success mt-4"
                        onClick={handleDownload}
                        disabled={downloadStatus.startsWith('Generating')}
                    >
                        {downloadStatus.startsWith('Generating') ? 'Generating...' : 'Download Filtered Data'}
                    </button>

                    {downloadStatus && !downloadError && <p className="mt-2 text-success">{downloadStatus}</p>}
                    {downloadError && <p className="mt-2 text-danger text-wrap">{downloadError}</p>}
                </div>
            </div>
        </div>
    );
};

export default DownloadPage;