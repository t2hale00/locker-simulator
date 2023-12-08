import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LockerSelect({ selectedLocker, handleLockerSelect }) {
  // Add a new state to store the list of locations
  const [locations, setLocations] = useState([]);

  // Fetch locations when the component mounts
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:3002/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  return (
    <div>
      <label htmlFor="dropdown">Select Locker Location</label>
      <select id="dropdown" value={selectedLocker} onChange={handleLockerSelect}>
        <option value="">-- Select --</option>
        {locations.map((location) => (
          <option key={location.locationid} value={location.locationname}>
            {location.locationname}
          </option>
        ))}
      </select>

      {selectedLocker && (
        <p>You selected: {selectedLocker}</p>
      )}
    </div>
  );
}

export default LockerSelect;
