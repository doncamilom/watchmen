import React from 'react';
import { Box, Typography } from '@mui/material';

const VesselContext = ({ selectedLabel, vesselData }) => {
  if (!selectedLabel) return null;
  
  return (
    <Box sx={{ mb: 2, p: 1.5, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 1 }}>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        <strong>Selected Vessel:</strong> {vesselData?.name || 'Unknown'}
      </Typography>
      {vesselData?.type_specific && (
        <Typography variant="body2" color="text.secondary">
          <strong>Type:</strong> {vesselData.type_specific}
        </Typography>
      )}
    </Box>
  );
};

export default VesselContext;