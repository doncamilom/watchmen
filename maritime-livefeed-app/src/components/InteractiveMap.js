import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const cityCoordinates = {
  'ROTTERDAM': [51.9225, 4.47917],
  'OSAKA': [34.6937, 135.5022],
  'SINGAPORE': [1.3521, 103.8198],
  'LOS ANGELES': [34.0522, -118.2437],
  'SEATTLE': [47.6062, -122.3321],
  'HONG KONG': [22.3193, 114.1694],
  'NEW YORK': [40.7128, -74.0060],
  'VANCOUVER': [49.2827, -123.1207],
  'ANCHORAGE': [61.2181, -149.9003],
  'SYDNEY': [-33.8688, 151.2093],
  'SHANGHAI': [31.2304, 121.4737],
  'TOKYO': [35.6762, 139.6503],
  'MELBOURNE': [-37.8136, 144.9631],
  'AUCKLAND': [-36.8509, 174.7645],
  'MONTREAL': [45.5017, -73.5673]
};

const InteractiveMap = ({ cityData }) => {
  const navigate = useNavigate();

  // Calculate center position as average of all coordinates
  const centerPosition = Object.values(cityCoordinates).reduce(
    (acc, [lat, lng]) => [acc[0] + lat / Object.keys(cityCoordinates).length, 
                         acc[1] + lng / Object.keys(cityCoordinates).length],
    [0, 0]
  );

  const handleMarkerClick = (route) => {
    navigate(route);
  };

  return (
    <Box mt={5}>
      <Typography variant="h4" gutterBottom>
        Maritime Map
      </Typography>
      <MapContainer 
        center={centerPosition} 
        zoom={3} 
        style={{ height: '600px', width: '100%' }}
        minZoom={2}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {cityData.map((city) => (
          <Marker
            key={city.name}
            position={cityCoordinates[city.name]}
            eventHandlers={{
              click: () => handleMarkerClick(city.route)
            }}
          >
            <Popup>
              <div onClick={() => handleMarkerClick(city.route)} style={{ cursor: 'pointer' }}>
                <strong>{city.name}</strong>
                <br />
                Click to view details
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

InteractiveMap.propTypes = {
  cityData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      route: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default InteractiveMap;