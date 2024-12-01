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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);

  useEffect(() => {
    const fetchImageAnalysis = async () => {
      try {
        setLoading(true);
        const response = await fetch('/backend_result.json');
        if (!response.ok) {
          throw new Error('Failed to fetch image analysis');
        }
        const data = await response.json();
        setImageData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImageAnalysis();
  }, [cityName]);

  const handleBoxClick = (result, index) => {
    setSelectedLabel({ ...result, color: getColor(index), index });
  };

  const handleLLMResponse = (updates) => {
    if (updates.boxes) {
      setImageData(prevData => ({
        ...prevData,
        results: updates.boxes
      }));
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
      {/* Main Content */}
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
                  <SelectedLabelCard selectedLabel={selectedLabel} />
                </Grid>
              </Grid>
            </>
          )}
        </Paper>
      </Box>

      {/* Chat Panel */}
      <Box sx={{ flex: '1 1 30%', minWidth: '300px', maxWidth: '400px', height: '100vh' }}>
        <ChatWithLLM 
          onResponse={handleLLMResponse}
          selectedLabel={selectedLabel}
          imageData={imageData}
        />
      </Box>
    </Box>
  );
};

export default ImageAnalysis;