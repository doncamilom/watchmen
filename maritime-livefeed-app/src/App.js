// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TrackerPage from './pages/TrackerPage';
import CityStatsPage from './pages/CityStatsPage';
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
          </Tabs>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/city/:cityName" element={<CityStatsPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;



