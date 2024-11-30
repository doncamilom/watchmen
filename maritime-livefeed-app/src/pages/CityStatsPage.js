// src/pages/CityStatsPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';

const CityStatsPage = () => {
  const { cityName } = useParams();

  // Placeholder for city data - you would replace this with an API request.
  const cityStats = {
    london: { shipsPassed: 1500, cargoTypes: ['Oil', 'Containers', 'Food'] },
    'new-york': { shipsPassed: 2000, cargoTypes: ['Vehicles', 'Electronics', 'Containers'] },
    // Add data for the other cities here...
  };

  const stats = cityStats[cityName.toLowerCase()] || { shipsPassed: 0, cargoTypes: [] };

  return (
    <Box mt={5}>
      <Typography variant="h4" gutterBottom>
        {cityName} Maritime Statistics
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6">
          Number of Ships Passed: {stats.shipsPassed}
        </Typography>
        <Typography variant="h6" mt={2}>
          Types of Cargo:
        </Typography>
        <ul>
          {stats.cargoTypes.map((type, index) => (
            <li key={index}>{type}</li>
          ))}
        </ul>
      </Paper>
    </Box>
  );
};

export default CityStatsPage;
