import React from 'react';
import './RoomViewPage.css'; 
import { useNavigate, useParams } from 'react-router-dom';

const RoomViewPage = () => {
  const navigate = useNavigate();
  const { locationName, buildingName, roomType, roomNumber } = useParams();


  // Sample room data (can be replaced with dynamic API or props)
  const roomInfo = {
    location: locationName,
    roomCode: `${locationName.toUpperCase()} ${buildingName}`,
    floor: 4,
    roomNo: roomNumber,
    roomType: 'Training room (Standardized)',
    totalSeats: 50,
    excludingTrainer: 49,
    setup: '49 seats arranged in rows facing the board.',
    priority: 'High',
    status: 'Occupied',
    batches: [
      { code: 'INTQEA250XYZ1', count: 16 },
      { code: 'INTQEA250XYZ2', count: 15 },
    ],
  };

  const totalBatchCount = roomInfo.batches.reduce((sum, b) => sum + b.count, 0);

  return (
    <div className="room-view-page">
    
      

      {/* Content */}
      <div className="d-flex">
        {/* Sidebar */}
        <aside className="p-3 border-end" style={{ width: '300px', backgroundColor: '#f8f9fa' }}>
        <h6 style={{ cursor: 'pointer' }} onClick={() => navigate(`/location/${locationName}/${buildingName}/${roomType}`)}>
          &larr; Back to all rooms
        </h6>

          <hr />
          <p><strong>Location:</strong> {roomInfo.location}</p>
          <p><strong>Room Code:</strong> {roomInfo.roomCode}</p>
          <p><strong>Floor:</strong> {roomInfo.floor}</p>
          <p><strong>Room No:</strong> {roomInfo.roomNo}</p>
          <p><strong>Room Type:</strong> {roomInfo.roomType}</p>
          <p><strong>Total Seat Count:</strong> {roomInfo.totalSeats}</p>
          <p><strong>Excluding Trainer:</strong> {roomInfo.excludingTrainer}</p>
          <p><strong>Setup:</strong> {roomInfo.setup}</p>
          <p><strong>Priority:</strong> {roomInfo.priority}</p>
          <p><strong>Status:</strong> {roomInfo.status}</p>
          <hr />
          <h6>Batch Information</h6>
          {roomInfo.batches.map((batch, index) => (
            <p key={index}><strong>{batch.code}</strong>: {batch.count}</p>
          ))}
          <p><strong>Total Batch Count:</strong> {totalBatchCount}</p>
        </aside>

        {/* Main View */}
        <main className="p-4 flex-grow-1">
          <h5 className="mb-3">Dynamic View</h5>
          <div className="dynamic-view border p-3" style={{ minHeight: '300px' }}>
            {/* Placeholder for seat map */}
            <p>This area will display the seating layout for Room {roomInfo.roomNo}.</p>
            <button className="btn btn-primary mt-3">Allocate</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RoomViewPage;
