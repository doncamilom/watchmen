import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TrackerPage from './pages/TrackerPage';
import CityStatsPage from './pages/CityStatsPage';
import VesselVisualization from './components/VesselVisualization';
import { AppBar, Toolbar, Typography, Container, Tabs, Tab, Button } from '@mui/material';

function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button
            component={Link}
            to="/"
            sx={{
              textTransform: 'none',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              mr: 3
            }}
            onClick={() => setValue(0)} // Reset tabs when clicking home
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                letterSpacing: '0.5px'
              }}
            >
              Seas the Day!
            </Typography>
          </Button>
          
          <Tabs 
            value={value} 
            onChange={handleChange}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': {
                  color: 'white'
                }
              }
            }}
          >
            <Tab label="Home" component={Link} to="/" />
            <Tab label="Tracker" component={Link} to="/tracker" />
            <Tab label="Visualization" component={Link} to="/visualization" />
          </Tabs>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/city/:cityName" element={<CityStatsPage />} />
          <Route path="/visualization" element={<VesselVisualization />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;