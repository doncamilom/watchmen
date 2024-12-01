import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Grid } from '@mui/material';
import ImageOverlay from '../components/ImageAnalysis/ImageOverlay';
import DetectionSummary from '../components/ImageAnalysis/DetectionSummary';
import DetectionList from '../components/ImageAnalysis/DetectionList';
import SelectedLabelCard from '../components/ImageAnalysis/SelectedLabelCard';
import ChatWithLLM from '../components/ImageAnalysis/ChatWithLLM';
import { getColor } from '../components/ImageAnalysis/utils/colors';

const ImageAnalysis = ({ cityName }) => {
  const [imageData, setImageData] = useState(null);
  const [maritimeData, setMaritimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [allLabels, setAllLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch image analysis data
        const imageResponse = await fetch('/backend_result.json');
        if (!imageResponse.ok) {
          throw new Error('Failed to fetch image analysis');
        }
        const imageResult = await imageResponse.json();
        
        // Fetch maritime data
        const maritimeResponse = await fetch('/maritime_data.json');
        if (!maritimeResponse.ok) {
          throw new Error('Failed to fetch maritime data');
        }
        const maritimeResult = await maritimeResponse.json();
        
        setImageData(imageResult);
        setMaritimeData(maritimeResult);

        // Process all labels
        if (imageResult && imageResult.results) {
          const processedLabels = imageResult.results.map((result, index) => ({
            ...result,
            color: getColor(index),
            index
          }));
          setAllLabels(processedLabels);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cityName]);

  useEffect(() => {
    if (selectedLabel && maritimeData && Array.isArray(maritimeData)) {
      const cityVessels = maritimeData.filter(vessel => {
        const depPort = vessel.dep_port?.toString().toUpperCase() || '';
        const destPort = vessel.dest_port?.toString().toUpperCase() || '';
        const searchCity = cityName.toString().toUpperCase();
        return depPort === searchCity || destPort === searchCity;
      });

      if (cityVessels.length > 0) {
        const randomVessel = cityVessels[Math.floor(Math.random() * cityVessels.length)];
        setSelectedVessel({
          ...randomVessel,
          current_draught: randomVessel.current_draught || 'N/A',
          speed: randomVessel.speed || 'N/A',
          course: randomVessel.course || 'N/A'
        });
      } else {
        setSelectedVessel(null);
      }
    } else {
      setSelectedVessel(null);
    }
  }, [selectedLabel, maritimeData, cityName]);

  const handleBoxClick = (result, index) => {
    setSelectedLabel({ ...result, color: getColor(index), index });
  };

  const handleLLMResponse = (updates) => {
    if (updates.boxes) {
      setImageData(prevData => ({
        ...prevData,
        results: updates.boxes
      }));
      
      // Update allLabels when boxes are updated
      const processedLabels = updates.boxes.map((result, index) => ({
        ...result,
        color: getColor(index),
        index
      }));
      setAllLabels(processedLabels);
    }
    
    if (updates.selectedLabel) {
      setSelectedLabel(updates.selectedLabel);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
        <Typography variant="h6">{error}</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box sx={{ flex: '1 1 70%' }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Port Analysis for {cityName}
          </Typography>
          
          {imageData && (
            <>
              <ImageOverlay
                imageData={imageData}
                onBoxClick={handleBoxClick}
                selectedLabel={selectedLabel}
                getColor={getColor}
              />

              <DetectionSummary imageData={imageData} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <Typography variant="h6" gutterBottom>
                    Detection Details
                  </Typography>
                  <DetectionList
                    results={imageData.results}
                    selectedLabel={selectedLabel}
                    onBoxClick={handleBoxClick}
                    getColor={getColor}
                  />
                </Grid>

                <Grid item xs={12} md={5}>
                  <SelectedLabelCard 
                    selectedLabel={selectedLabel} 
                    vesselData={selectedVessel}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Paper>
      </Box>

      <Box sx={{ flex: '1 1 30%', minWidth: '300px', maxWidth: '400px', height: '100vh' }}>
        <ChatWithLLM 
          onResponse={handleLLMResponse}
          selectedLabel={selectedLabel}
          imageData={imageData}
          vesselData={selectedVessel}
          maritimeData={maritimeData}
          allLabels={allLabels}
        />
      </Box>
    </Box>
  );
};

export default ImageAnalysis;