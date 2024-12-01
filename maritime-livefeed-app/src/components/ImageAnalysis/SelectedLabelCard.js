import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const SelectedLabelCard = ({ selectedLabel }) => {
  if (!selectedLabel) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Click on any detection to view details
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ 
          color: selectedLabel.color,
          fontWeight: 'bold'
        }}>
          {selectedLabel.label.toUpperCase()}
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            <strong>Confidence Score:</strong> {(selectedLabel.confidence * 100).toFixed(1)}%
          </Typography>
          
          <Typography variant="body1" gutterBottom>
            <strong>Location:</strong>
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2">
              X1: {selectedLabel.box[0].toFixed(1)}
            </Typography>
            <Typography variant="body2">
              Y1: {selectedLabel.box[1].toFixed(1)}
            </Typography>
            <Typography variant="body2">
              X2: {selectedLabel.box[2].toFixed(1)}
            </Typography>
            <Typography variant="body2">
              Y2: {selectedLabel.box[3].toFixed(1)}
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Dimensions:</strong>
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2">
              Width: {(selectedLabel.box[2] - selectedLabel.box[0]).toFixed(1)}
            </Typography>
            <Typography variant="body2">
              Height: {(selectedLabel.box[3] - selectedLabel.box[1]).toFixed(1)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SelectedLabelCard;