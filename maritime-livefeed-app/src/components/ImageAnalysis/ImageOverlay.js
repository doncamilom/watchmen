import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';

const ImageOverlay = ({ imageData, onBoxClick, selectedLabel, getColor }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const renderImage = () => {
    if (!imageData?.image) return null;
    return `data:image/jpeg;base64,${imageData.image}`;
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (imageRef.current && containerRef.current) {
        const img = imageRef.current;
        const container = containerRef.current;
        
        // Get the natural dimensions of the image
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        
        // Get the actual displayed dimensions
        const displayedWidth = img.clientWidth;
        const displayedHeight = img.clientHeight;
        
        // Calculate scaling factors
        const scaleX = displayedWidth / naturalWidth;
        const scaleY = displayedHeight / naturalHeight;

        setDimensions({
          width: displayedWidth,
          height: displayedHeight
        });
        setScale({
          x: scaleX,
          y: scaleY
        });
      }
    };

    // Add resize observer
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  const handleImageLoad = () => {
    if (imageRef.current && containerRef.current) {
      const img = imageRef.current;
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      const displayedWidth = img.clientWidth;
      const displayedHeight = img.clientHeight;
      
      setDimensions({
        width: displayedWidth,
        height: displayedHeight
      });
      setScale({
        x: displayedWidth / naturalWidth,
        y: displayedHeight / naturalHeight
      });
    }
  };

  return (
    <Box ref={containerRef} sx={{ mb: 3, position: 'relative' }}>
      <img
        ref={imageRef}
        src={renderImage()}
        alt="Analysis"
        onLoad={handleImageLoad}
        style={{ 
          width: '100%', 
          height: 'auto', 
          borderRadius: '4px',
          maxHeight: '500px',
          objectFit: 'contain'
        }}
      />
      {dimensions.width > 0 && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        >
          {imageData.results.map((result, index) => {
            const [x1, y1, x2, y2] = result.box;
            const isSelected = selectedLabel?.index === index;
            
            // Scale the coordinates
            const scaledX1 = x1 * scale.x;
            const scaledY1 = y1 * scale.y;
            const scaledWidth = (x2 - x1) * scale.x;
            const scaledHeight = (y2 - y1) * scale.y;

            return (
              <g 
                key={index}
                onClick={() => onBoxClick(result, index)}
                style={{ cursor: 'pointer', pointerEvents: 'all' }}
              >
                <rect
                  x={scaledX1}
                  y={scaledY1}
                  width={scaledWidth}
                  height={scaledHeight}
                  fill={isSelected ? getColor(index) : 'none'}
                  fillOpacity={isSelected ? 0.2 : 0}
                  stroke={getColor(index)}
                  strokeWidth={isSelected ? "3" : "2"}
                  opacity="0.8"
                />
                <rect
                  x={scaledX1}
                  y={scaledY1 - 20 * scale.y}
                  width={80 * scale.x}
                  height={20 * scale.y}
                  fill={getColor(index)}
                  opacity="0.8"
                />
                <text
                  x={scaledX1 + 5 * scale.x}
                  y={scaledY1 - 5 * scale.y}
                  fill="white"
                  fontSize={`${12 * scale.x}px`}
                  fontWeight="bold"
                >
                  {`${result.label} ${(result.confidence * 100).toFixed(0)}%`}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </Box>
  );
};

export default ImageOverlay;