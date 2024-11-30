// src/components/InteractiveMap.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography } from '@mui/material';

const InteractiveMap = () => {
  const centerPosition = [51.505, -0.09]; // Default center position (London)

  return (
    <Box mt={5}>
      <Typography variant="h4" gutterBottom>
        Maritime Map
      </Typography>
      <MapContainer center={centerPosition} zoom={5} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            Example Vessel - Coordinates: [51.505, -0.09]
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
};

export default InteractiveMap;
