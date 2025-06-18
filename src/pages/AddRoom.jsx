import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AddRoom = () => {
  const navigate = useNavigate();
  const { locationName, buildingName } = useParams();

  const [formData, setFormData] = useState({
    location: locationName,
    building: buildingName,
    // facility: '',
    floor: '',
    wing: '',
    roomNo: '',
    roomType: '',
    roomTypeName: '',
    totalSeats: '',
    excludingTrainer: '',
    seatingSetup: '',
    seatingCalc: '',
    priority: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Room added:', formData);
    navigate(`/location/${locationName}/${buildingName}`);
  };

  return (
    <div className="container mt-4">
      {/* Back Navigation */}
      <div className="d-flex align-items-center mb-3">
        <span
          style={{ cursor: 'pointer', fontSize: '1.5rem' }}
          onClick={() => navigate(-1)}
        >
          ←
        </span>
        <h5 className="ms-3 mb-0">Back to Rooms</h5>
      </div>

      <h4 className="mb-4">ADD ROOM</h4>

      <form onSubmit={handleSubmit} className="row g-3">
        {/* Location and Building (read-only) */}
        <div className="col-md-4">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            name="location"
            value={formData.location}
            readOnly
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Building</label>
          <input
            type="text"
            className="form-control"
            name="building"
            value={formData.building}
            readOnly
          />
        </div>

        {/* Dropdown Fields */}
        {[
        //   { label: 'Facility', name: 'facility', options: ['HYD-HTC', 'CHN-SDB', 'BLR-EC'] },
          { label: 'Floor', name: 'floor', options: ['1', '2', '3'] },
          { label: 'Wing', name: 'wing', options: ['A', 'B', 'C'] },
          { label: 'Room No', name: 'roomNo', options: ['1', '2', '3'] },
          { label: 'Room Type', name: 'roomType', options: ['ODC', 'Training Room'] },
          { label: 'Room Type - Name Standardized', name: 'roomTypeName', options: ['Standard', 'Custom'] },
          { label: 'Priority', name: 'priority', options: ['Low', 'Medium', 'High'] },
        ].map((field, index) => (
          <div className="col-md-4" key={index}>
            <label className="form-label">{field.label}</label>
            <select
              className="form-select"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
            >
              <option value="">Select {field.label}</option>
              {field.options.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}

        {/* Numeric Fields */}
        {[
          { label: 'Total Seat Count', name: 'totalSeats' },
          { label: 'Seat Count excluding Trainer', name: 'excludingTrainer' },
          { label: 'Seating set-up', name: 'seatingSetup' },
          { label: 'Seating for calculation', name: 'seatingCalc' },
        ].map((field, index) => (
          <div className="col-md-4" key={index}>
            <label className="form-label">{field.label}</label>
            <input
              type="number"
              className="form-control"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <div className="col-12 mt-3">
          <button type="submit" className="btn btn-primary">ADD</button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;
