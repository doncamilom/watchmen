// src/components/VesselVisualization.js
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';

const VesselVisualization = () => {
  const [vesselData, setVesselData] = useState([]);

  useEffect(() => {
    fetch('/maritime_data.json')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setVesselData(data);
      });
  }, []);

  // Example: count vessels by type
  const vesselTypeCounts = {};
  vesselData.forEach((vessel) => {
    vesselTypeCounts[vessel.type] = (vesselTypeCounts[vessel.type] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(vesselTypeCounts),
    datasets: [
      {
        label: 'Number of Vessels',
        data: Object.values(vesselTypeCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Vessel Types
      </Typography>
      <Bar data={chartData} />
    </Box>
  );
};

export default VesselVisualization;
