import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatWithLLM = ({ onResponse, selectedLabel, imageData }) => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      // Add context about selected label and image data to the query
      const contextData = {
        query,
        selectedObject: selectedLabel,
        allDetections: imageData?.results || [],
        timestamp: new Date().toISOString(),
      };

      const response = await fetch('http://localhost:5000/api/llm-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contextData),
      });
      
      const data = await response.json();

      // Add to conversation
      const newMessages = [
        { role: 'user', content: query },
        { role: 'assistant', content: data.response }
      ];
      
      setConversation(prev => [...prev, ...newMessages]);

      // Pass response to parent for potential image updates
      if (data.updates) {
        onResponse(data.updates);
      }

      setQuery('');
    } catch (error) {
      console.error('Error fetching LLM response:', error);
      setConversation(prev => [
        ...prev,
        { role: 'user', content: query },
        { role: 'assistant', content: 'Sorry, there was an error processing your request.' }
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
      flexDirection: 'column'
    }}>
      <Typography variant="h6" gutterBottom>
        Maritime Analysis Assistant
      </Typography>

      {/* Context Information */}
      {selectedLabel && (
        <Box sx={{ mb: 2, p: 1, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Currently analyzing: {selectedLabel.label} (Confidence: {(selectedLabel.confidence * 100).toFixed(1)}%)
          </Typography>
        </Box>
      )}

      {/* Conversation History */}
      <Box sx={{ 
        flexGrow: 1,
        overflowY: 'auto',
        mb: 2,
        p: 2,
        border: '1px solid #eee',
        borderRadius: '4px',
        backgroundColor: '#fafafa'
      }}>
        {conversation.map((message, index) => (
          <Box 
            key={index} 
            sx={{ 
              mb: 1,
              p: 1,
              backgroundColor: message.role === 'user' ? 'white' : '#f0f7ff',
              borderRadius: 1,
              maxWidth: '90%',
              ml: message.role === 'user' ? 'auto' : 0,
              mr: message.role === 'user' ? 0 : 'auto',
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {message.content}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Query Input */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Ask about the maritime analysis..."
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white'
            }
          }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleQuery} 
          disabled={!query.trim() || loading}
          sx={{ minWidth: '56px', height: '56px' }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatWithLLM;