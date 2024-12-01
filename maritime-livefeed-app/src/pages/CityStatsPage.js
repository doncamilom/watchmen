import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import DescriptiveStats from './DescriptiveStats';
import ImageAnalysis from './ImageAnalysis';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`city-tabpanel-${index}`}
    aria-labelledby={`city-tab-${index}`}
    {...other}
  >
    {value === index && (
      <Box sx={{ width: '100%' }}>
        {children}
      </Box>
    )}
  </div>
);

const CityStatsPage = () => {
  const { cityName } = useParams();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '100%',
      px: { xs: 2, sm: 3, md: 4 },
      py: 3
    }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        {cityName} Maritime Statistics
      </Typography>

      <Box sx={{ 
        width: '100%',
        maxWidth: '100%'
      }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Descriptive Summary" />
            <Tab label="Image Analysis" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <DescriptiveStats cityName={cityName} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <ImageAnalysis cityName={cityName} />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default CityStatsPage;