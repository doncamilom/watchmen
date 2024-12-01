import React, { useState } from 'react';
import { Card, CardContent, IconButton, Button, CircularProgress, TextField } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ImageCarousel = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const fetchImages = async () => {
    if (!query.trim()) {
      console.log('Query is empty, please enter a search term');
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching images with query:', query);
      const response = await fetch('http://liacpc3.epfl.ch:9178/select_images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data from server:', data);
      
      // Extract the base64 images from the result array
      if (data.result && Array.isArray(data.result)) {
        const processedImages = data.result.map(base64String => `data:image/jpeg;base64,${base64String}`);
        console.log('Processed images count:', processedImages.length);
        setImages(processedImages);
        setCurrentIndex(0);
      } else {
        console.error('Unexpected data structure:', data);
      }
    } catch (error) {
      console.error('Failed to fetch or process images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query"
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={fetchImages}
            disabled={loading || !query.trim()}
          >
            Search Images
          </Button>
        </div>
        
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: 256 
          }}>
            <CircularProgress />
          </div>
        ) : images.length > 0 ? (
          <div style={{ position: 'relative' }}>
            <div style={{ 
              position: 'relative', 
              height: 256, 
              backgroundColor: '#f5f5f5', 
              borderRadius: 8,
              overflow: 'hidden'
            }}>
              <img
                src={images[currentIndex]}
                alt={`Maritime image ${currentIndex + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
            
            {images.length > 1 && (
              <>
                <IconButton
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                  onClick={handlePrevious}
                >
                  <ChevronLeftIcon />
                </IconButton>
                
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                  onClick={handleNext}
                >
                  <ChevronRightIcon />
                </IconButton>

                <div style={{
                  position: 'absolute',
                  bottom: 16,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 8
                }}>
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: index === currentIndex ? '#1976d2' : '#bdbdbd',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={{
            height: 256,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#757575'
          }}>
            {query ? 'No images found' : 'Enter a query to search for images'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageCarousel;