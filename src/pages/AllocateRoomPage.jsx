import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AllocateRoomPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manual');

  // Shared state
  const [size, setSize] = useState('');
  const [bu, setBu] = useState('');
  const [mode, setMode] = useState('');
  const [fit, setFit] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      cohortSize: size,
      bu,
      mode,
      fit: activeTab === 'automate' ? fit : undefined,
    };

    console.log(`${activeTab} search:`, payload);

    if (activeTab === 'manual') {
      navigate('/manual-results');
    } else {
      navigate('/location/Chennai/SDB1/trainingRooms/6/view');
    }
  };

  return (
    <div className="allocate-room-page container mt-4">
      {/* Back Navigation */}
      <div className="mb-3">
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>
          &larr; Back
        </span>
      </div>

      {/* Tabs */}
      <div className="d-flex mb-4">
        <button
          className={`btn me-2 ${activeTab === 'manual' ? 'btn-warning' : 'btn-outline-secondary'}`}
          onClick={() => setActiveTab('manual')}
        >
          Manual
        </button>
        <button
          className={`btn ${activeTab === 'automate' ? 'btn-warning' : 'btn-outline-secondary'}`}
          onClick={() => setActiveTab('automate')}
        >
          Automate
        </button>
      </div>

      {/* Form */}
      <form className="card p-3 shadow-sm" onSubmit={handleSubmit} style={{ maxWidth: '500px', fontSize: '0.9rem' }}>
        <div className="mb-2">
          <label className="form-label">Size of Cohort</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Enter cohort size"
            required
          />
        </div>

        {activeTab === 'automate' && (
          <div className="mb-2">
            <label className="form-label">Fit Preference</label>
            <select
              className="form-select form-select-sm"
              value={fit}
              onChange={(e) => setFit(e.target.value)}
              required
            >
              <option value="">Select Fit</option>
              <option value="Best-fit">Best-fit</option>
              <option value="Avg-fit">Avg-fit</option>
              <option value="Worst-fit">Worst-fit</option>
            </select>
          </div>
        )}

        <button type="submit" className="btn btn-sm btn-success mt-2">
          Search
        </button>
      </form>
    </div>
  );
};

export default AllocateRoomPage;