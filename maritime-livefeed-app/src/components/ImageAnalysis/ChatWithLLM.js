import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button } from '@mui/material';
import ConversationMessages from './ConversationMessages';
import ChatInput from './ChatInput';
import VesselContext from './VesselContext';
import ImageCarousel from './ImageCarousel';
import { generateSuggestions, parseResponse } from './utils/chatUtils';
import { getColor } from './utils/colors';

const ChatWithLLM = ({ onResponse, selectedLabel, imageData, vesselData, maritimeData, allLabels }) => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showCarousel, setShowCarousel] = useState(false);

  useEffect(() => {
    const newSuggestions = generateSuggestions(selectedLabel, imageData, vesselData);
    if (vesselData?.speed || vesselData?.current_draught || vesselData?.course) {
      newSuggestions.push(
        `What is the current speed and course of ${vesselData.name}?`,
        `Tell me about the vessel's draught and navigation details`,
        `Compare this vessel's speed with the port average`
      );
    }
    setSuggestions(newSuggestions);
  }, [selectedLabel, imageData, vesselData]);

  const calculateAverageSpeed = (data) => {
    if (!Array.isArray(data) || data.length === 0) return null;
    const speeds = data
      .map(vessel => vessel.speed)
      .filter(speed => speed != null && !isNaN(speed));
    if (speeds.length === 0) return null;
    return (speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length).toFixed(1);
  };

  const calculateAverageDraught = (data) => {
    if (!Array.isArray(data) || data.length === 0) return null;
    const draughts = data
      .map(vessel => vessel.current_draught)
      .filter(draught => draught != null && !isNaN(draught));
    if (draughts.length === 0) return null;
    return (draughts.reduce((sum, draught) => sum + draught, 0) / draughts.length).toFixed(1);
  };

  const countVesselTypes = (data) => {
    if (!Array.isArray(data)) return {};
    return data.reduce((acc, vessel) => {
      const type = vessel.type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  };

  const handleQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const requestBody = {
        query: query,
        data: {
          selected_detection: {
            box: selectedLabel?.box || null,
            confidence: selectedLabel?.confidence || null,
            vessel_type: selectedLabel?.label || null,
            index: selectedLabel?.index || null
          },
          image_analysis: {
            total_detections: imageData?.results?.length || 0,
            all_detections: allLabels.map(label => ({
              label: label.label,
              confidence: label.confidence,
              box: label.box,
              index: label.index,
              color: label.color
            }))
          },
          vessel_info: {
            selected_vessel: vesselData ? {
              name: vesselData.name || null,
              country_iso: vesselData.country_iso || null,
              type: vesselData.type || null,
              type_specific: vesselData.type_specific || null,
              departure_port: vesselData.dep_port || null,
              destination_port: vesselData.dest_port || null,
              latitude: vesselData.lat || null,
              longitude: vesselData.lon || null,
              current_draught: vesselData.current_draught || null,
              speed: vesselData.speed || null,
              course: vesselData.course || null
            } : null,
            port_statistics: maritimeData ? {
              total_vessels: maritimeData.length,
              vessel_types: countVesselTypes(maritimeData),
              avg_speed: calculateAverageSpeed(maritimeData),
              avg_draught: calculateAverageDraught(maritimeData)
            } : null
          }
        }
      };

      console.log('Sending request:', requestBody);

      const response = await fetch('http://liacpc3.epfl.ch:9178/analyze_image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received response:', data);

      // Parse the response using updated parseResponse
      const responseText = parseResponse(data);

      // Add messages to conversation
      const newMessages = [
        { role: 'user', content: query },
        { role: 'assistant', content: responseText }
      ];
      
      setConversation(prev => [...prev, ...newMessages]);

      // Handle UI updates if results are present
      if (data.result) {
        try {
          const parsedResult = JSON.parse(data.result.replace(/'/g, '"'));
          if (parsedResult.results && parsedResult.results.results) {
            const updatedBoxes = parsedResult.results.results.map((box, index) => ({
              ...box,
              color: getColor(index)
            }));

            // Trigger UI update with new boxes
            onResponse({ boxes: updatedBoxes });
          }
        } catch (error) {
          console.error('Error parsing results:', error);
        }
      }

      setQuery('');
    } catch (error) {
      console.error('Error in handleQuery:', error);
      setConversation(prev => [
        ...prev,
        { role: 'user', content: query },
        { 
          role: 'assistant', 
          content: 'Sorry, there was an error processing your request. Please try again.' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuery();
    }
  };

  return (
    <Paper elevation={3} sx={{ 
      p: 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      <Typography variant="h6" gutterBottom>
        Maritime Analysis Assistant
      </Typography>

      <Button 
        variant="contained"
        size="small"
        onClick={() => setShowCarousel(!showCarousel)}
        sx={{ alignSelf: 'flex-start', mb: 1 }}
      >
        {showCarousel ? 'Hide Image Gallery' : 'Show Image Gallery'}
      </Button>

      {showCarousel && (
        <div style={{ marginBottom: 16 }}>
          <ImageCarousel />
        </div>
      )}

      <Paper elevation={1} sx={{ 
        p: 2,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        bgcolor: 'background.default'
      }}>
        <VesselContext 
          selectedLabel={selectedLabel} 
          vesselData={vesselData}
        />
        
        <div style={{ flexGrow: 1, overflow: 'auto' }}>
          <ConversationMessages conversation={conversation} />
        </div>

        <ChatInput 
          query={query}
          suggestions={suggestions}
          loading={loading}
          selectedLabel={selectedLabel}
          vesselData={vesselData}
          onQueryChange={setQuery}
          onSubmit={handleQuery}
          onKeyPress={handleKeyPress}
        />
      </Paper>
    </Paper>
  );
};

export default ChatWithLLM;