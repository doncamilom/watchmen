import React from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';

const SelectedLabelCard = ({ selectedLabel, vesselData }) => {
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

        {/* Vessel Information Section */}
        {vesselData && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Vessel Information
            </Typography>
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Name:</strong> {vesselData.name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Country:</strong> {vesselData.country_iso || 'N/A'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Type:</strong> {vesselData.type || 'N/A'}
              </Typography>
              {vesselData.type_specific && (
                <Typography variant="body2" gutterBottom>
                  <strong>Specific Type:</strong> {vesselData.type_specific}
                </Typography>
              )}
              <Typography variant="body2" gutterBottom>
                <strong>Route:</strong> {vesselData.dep_port || 'Unknown'} → {vesselData.dest_port || 'Unknown'}
              </Typography>
              
              {/* Navigation Information */}
              <Typography variant="body2" gutterBottom>
                <strong>Current Draught:</strong> {vesselData.current_draught} m
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Speed:</strong> {vesselData.speed} knots
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Course:</strong> {vesselData.course}°
              </Typography>
              
              {vesselData.lat && vesselData.lon && (
                <Typography variant="body2" gutterBottom>
                  <strong>Position:</strong> {vesselData.lat}, {vesselData.lon}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />
        
        {/* Detection Details Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Detection Details
          </Typography>
          
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