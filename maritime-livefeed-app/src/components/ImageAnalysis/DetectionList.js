import React from 'react';
import { Box, Typography } from '@mui/material';

const DetectionList = ({ results, selectedLabel, onBoxClick, getColor }) => {
  return (
    <Box sx={{ mt: 2 }}>
      {results.map((result, index) => (
        <Box 
          key={index} 
          sx={{ 
            mb: 1,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            },
            backgroundColor: selectedLabel?.index === index ? 'rgba(0, 0, 0, 0.08)' : 'transparent'
          }}
          onClick={() => onBoxClick(result, index)}
        >
          <Box 
            sx={{ 
              width: 16, 
              height: 16, 
              mr: 1, 
              backgroundColor: getColor(index),
              borderRadius: '2px'
            }} 
          />
          <Typography variant="body2">
            {result.label} - Confidence: {(result.confidence * 100).toFixed(1)}%
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default DetectionList;