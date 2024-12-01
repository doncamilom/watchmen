// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TrackerPage from './pages/TrackerPage';
import CityStatsPage from './pages/CityStatsPage';
import VesselVisualization from './components/VesselVisualization';
import { AppBar, Toolbar, Typography, Container, Tabs, Tab } from '@mui/material';

function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Maritime Live Feed Tracker with LLM Integration
          </Typography>
          <Tabs value={value} onChange={handleChange}>
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



// // src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import TrackerPage from './pages/TrackerPage';
// import CityStatsPage from './pages/CityStatsPage';
// import { AppBar, Toolbar, Typography, Container, Tabs, Tab } from '@mui/material';

// function App() {
//   const [value, setValue] = React.useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   return (
//     <Router>
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             Maritime Live Feed Tracker with LLM Integration
//           </Typography>
//           <Tabs value={value} onChange={handleChange}>
//             <Tab label="Home" component={Link} to="/" />
//             <Tab label="Tracker" component={Link} to="/tracker" />
//           </Tabs>
//         </Toolbar>
//       </AppBar>
//       <Container>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/tracker" element={<TrackerPage />} />
//           <Route path="/city/:cityName" element={<CityStatsPage />} />
//         </Routes>
//       </Container>
//     </Router>
//   );
// }

// export default App;



