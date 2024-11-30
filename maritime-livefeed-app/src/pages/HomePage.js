// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Grid } from '@mui/material';
import InteractiveMap from '../components/InteractiveMap';

const cityData = [
  { name: 'London', route: '/city/london' },
  { name: 'New York', route: '/city/new-york' },
  { name: 'Shanghai', route: '/city/shanghai' },
  { name: 'Singapore', route: '/city/singapore' },
  { name: 'Dubai', route: '/city/dubai' },
  { name: 'Tokyo', route: '/city/tokyo' },
  { name: 'Hamburg', route: '/city/hamburg' },
  { name: 'Los Angeles', route: '/city/los-angeles' },
  { name: 'Hong Kong', route: '/city/hong-kong' },
  { name: 'Mumbai', route: '/city/mumbai' },
];

const HomePage = () => {
  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h3" gutterBottom>
        Welcome to Maritime Live Feed Tracker
      </Typography>
      <Typography variant="body1" gutterBottom>
        Monitor live maritime data and get real-time insights with AI.
      </Typography>

      {/* Interactive Map */}
      <InteractiveMap />

      {/* Buttons for Different Cities */}
      <Box mt={5}>
        <Typography variant="h5" gutterBottom>
          Select a City to See Maritime Statistics
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {cityData.map((city) => (
            <Grid item key={city.name}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={city.route}
              >
                {city.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;

