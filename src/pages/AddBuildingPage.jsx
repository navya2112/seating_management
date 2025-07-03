import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const AddBuildingPage = () => {
  const [buildingName, setBuildingName] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

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
    if (buildingName && file) {
      console.log('Creating building:', buildingName);
      console.log('File uploaded:', file.name);
      setSuccessMessage('Building successfully added!');
      setBuildingName('');
      setFile(null);
    } else {
      alert('Please enter a building name and upload a file.');
    }
  };

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
      {/* Title and Back Arrow */}
      <div className="d-flex align-items-center mb-3">
        <span
          style={{ cursor: 'pointer', fontSize: '1.5rem' }}
          onClick={() => navigate(-1)}
        >
          ←
        </span>
        <h6 className="ms-3 mb-0">Back to buildings</h6>
      </div>

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

      {/* Building Name Input */}
      <div className="mt-4">
        <label htmlFor="buildingName" className="form-label">Building Name:</label>
        <input
          type="text"
          id="buildingName"
          className="form-control"
          value={buildingName}
          onChange={(e) => setBuildingName(e.target.value)}
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

export default AddBuildingPage;
