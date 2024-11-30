// src/pages/TrackerPage.js
import React from 'react';
import LiveFeed from '../components/LiveFeed';
import QueryLLM from '../components/QueryLLM';
import { Box, Typography, Paper } from '@mui/material';
const TrackerPage = () => {
  return (
    <Box mt={5}>
      <Typography variant="h3" gutterBottom>
        Maritime Live Tracker
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 5 }}>
        <Typography variant="h4" gutterBottom>
          Live Vessel Data
        </Typography>
        {/* <LiveFeed /> */}
      </Paper>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Query Maritime Data
        </Typography>
        {/* <QueryLLM /> */}
      </Paper>
    </Box>
  );
};

export default TrackerPage;
