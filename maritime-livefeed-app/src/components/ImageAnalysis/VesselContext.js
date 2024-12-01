// VesselContext.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const VesselContext = ({ selectedLabel }) => {
  if (!selectedLabel) return null;
  
  return (
    <Box sx={{ mb: 2, p: 1, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Selected Vessel: {selectedLabel.label}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Confidence: {(selectedLabel.confidence * 100).toFixed(1)}%
      </Typography>
    </Box>
  );
};

export default VesselContext;