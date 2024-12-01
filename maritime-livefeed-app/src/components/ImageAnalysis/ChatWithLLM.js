import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
import ConversationMessages from './ConversationMessages';
import ChatInput from './ChatInput';
import VesselContext from './VesselContext';
import { generateSuggestions, parseResponse } from './utils/chatUtils';

const ChatWithLLM = ({ onResponse, selectedLabel, imageData, vesselData, maritimeData }) => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setSuggestions(generateSuggestions(selectedLabel, imageData, vesselData));
  }, [selectedLabel, imageData, vesselData]);

  const handleQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      // Extract box coordinates and vessel information
      const box = selectedLabel?.box || null;

      // Create request body with validated data including vessel information
      const requestBody = {
        query: query,
        box: box,
        confidence: selectedLabel?.confidence || null,
        vessel_type: selectedLabel?.label || null,
        total_vessels: imageData?.results?.length || 0,
        vessel_index: selectedLabel?.index || null,
        // Add vessel-specific information
        vessel_details: vesselData ? {
          name: vesselData.name || null,
          type: vesselData.type || null,
          type_specific: vesselData.type_specific || null,
          isotype: vesselData.isotype || null,
          departure_port: vesselData.dep_port || null,
          destination_port: vesselData.dest_port || null,
          latitude: vesselData.lat || null,
          longitude: vesselData.lon || null
        } : null,
        // Add summary of all vessels in the port
        port_statistics: maritimeData ? {
          total_vessels_in_port: maritimeData.length,
          vessel_types: countVesselTypes(maritimeData),
        } : null
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
      
      const responseText = parseResponse(data);
      console.log('Parsed response:', responseText);
      
      const newMessages = [
        { role: 'user', content: query },
        { role: 'assistant', content: responseText }
      ];
      
      setConversation(prev => [...prev, ...newMessages]);
      setQuery('');
      
      if (onResponse) {
        onResponse(responseText);
      }
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

  // Helper function to count vessel types in the maritime data
  const countVesselTypes = (data) => {
    if (!Array.isArray(data)) return {};
    
    return data.reduce((acc, vessel) => {
      const type = vessel.type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
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
      flexDirection: 'column'
    }}>
      <Typography variant="h6" gutterBottom>
        Maritime Analysis Assistant
      </Typography>

      <VesselContext 
        selectedLabel={selectedLabel} 
        vesselData={vesselData}
      />
      <ConversationMessages conversation={conversation} />
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
  );
};

export default ChatWithLLM;