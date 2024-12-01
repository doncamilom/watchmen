// ConversationMessages.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const ConversationMessages = ({ conversation }) => (
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
          p: 1.5,
          backgroundColor: message.role === 'user' ? 'white' : '#f0f7ff',
          borderRadius: 2,
          maxWidth: '90%',
          ml: message.role === 'user' ? 'auto' : 0,
          mr: message.role === 'user' ? 0 : 'auto',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
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
);

export default ConversationMessages;