// src/components/LiveFeed.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const LiveFeed = () => {
  const [vessels, setVessels] = useState([]);

  useEffect(() => {
    const socket = io('YOUR_WEBSOCKET_SERVER_URL');

    socket.on('vesselData', (data) => {
      setVessels(data);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <Grid container spacing={3}>
      {vessels.map((vessel, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                {vessel.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Type: {vessel.type}
              </Typography>
              <Typography>
                Location: Latitude {vessel.lat}, Longitude {vessel.lon}
              </Typography>
              <Typography>
                Speed: {vessel.speed} knots
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default LiveFeed;
