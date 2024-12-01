// ChatInput.js
import React from 'react';
import { Box, Button, CircularProgress, Autocomplete, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatInput = ({ 
  query,
  suggestions,
  loading,
  selectedLabel,
  onQueryChange,
  onSubmit,
  onKeyPress 
}) => (
  <Box sx={{ display: 'flex', gap: 1 }}>
    <Autocomplete
      freeSolo
      fullWidth
      options={suggestions}
      value={query}
      onChange={(event, newValue) => onQueryChange(newValue || '')}
      onInputChange={(event, newInputValue) => onQueryChange(newInputValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          multiline
          maxRows={4}
          placeholder={selectedLabel 
            ? `Ask about this ${selectedLabel.label}...` 
            : "Ask about the maritime scene..."}
          variant="outlined"
          onKeyPress={onKeyPress}
          disabled={loading}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white'
            }
          }}
        />
      )}
    />
    <Button 
      variant="contained" 
      color="primary" 
      onClick={onSubmit} 
      disabled={!query.trim() || loading}
      sx={{ minWidth: '56px', height: '56px' }}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
    </Button>
  </Box>
);

export default ChatInput;