import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddLocationPage = () => {
  const [locationName, setLocationName] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCreate = () => {
    if (locationName && file) {
      console.log('Creating location:', locationName);
      console.log('File uploaded:', file.name);
      setSuccessMessage('Location successfully added!');

      // Clear form
      setLocationName('');
      setFile(null);
    } else {
      alert('Please enter a location name and upload a file.');
    }
  };

  // Automatically hide success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="container mt-4">
      <h5 className="mb-4 text-center">You can add your file with details to add new location</h5>

      {/* Drag and Drop Area */}
      <div
        className={`border rounded p-5 text-center ${dragActive ? 'bg-light' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ borderStyle: 'dashed', borderWidth: '3px', cursor: 'pointer' }}
      >
        <p className="mb-2">
          <strong>Drop your File</strong>
        </p>
        <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
        {file && <p className="mt-2 text-success">Selected File: {file.name}</p>}
      </div>

      {/* Location Name Input */}
      <div className="mt-4">
        <label htmlFor="locationName" className="form-label">Location Name:</label>
        <input
          type="text"
          id="locationName"
          className="form-control"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />
      </div>

      {/* Create Button */}
      <div className="mt-3 text-end">
        <button className="btn btn-primary" onClick={handleCreate}>Create</button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success mt-3 text-center" role="alert">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default AddLocationPage;
