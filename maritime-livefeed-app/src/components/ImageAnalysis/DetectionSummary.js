import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

const DetectionSummary = ({ imageData }) => {
  const averageConfidence = (
    imageData.results.reduce((avg, result) => avg + result.confidence, 0) / 
    (imageData.results.length || 1) * 100
  ).toFixed(1);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Detection Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h4" color="primary">
                {imageData.results.length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Objects Detected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h4" color="primary">
                {averageConfidence}%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Average Confidence Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DetectionSummary;