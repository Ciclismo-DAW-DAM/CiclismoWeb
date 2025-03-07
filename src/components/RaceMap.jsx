import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RaceMap = ({ coordinates }) => {
  // Parse coordinates from string if needed
  const position = typeof coordinates === 'string' 
    ? coordinates.split(',').map(coord => parseFloat(coord.trim()))
    : [parseFloat(coordinates.lat), parseFloat(coordinates.lng)];

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      style={{ height: '200px', width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          Ubicación de la carrera
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default RaceMap;
