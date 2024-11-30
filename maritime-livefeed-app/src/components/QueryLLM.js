// src/components/QueryLLM.js
import React, { useState } from 'react';
import { OpenAI } from 'openai';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';

const QueryLLM = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  const handleQuery = async () => {
    setLoading(true);
    try {
      const result = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: query },
        ],
      });
      setResponse(result.choices[0].message.content);
    } catch (error) {
      console.error('Error querying LLM:', error);
      setResponse('Failed to fetch response. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Box mt={4}>
      <TextField
        fullWidth
        label="Ask a question about the maritime data..."
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleQuery}
        disabled={loading || !query.trim()}
      >
        {loading ? <CircularProgress size={24} /> : 'Submit'}
      </Button>
      {response && (
        <Typography mt={3} variant="body1">
          Response: {response}
        </Typography>
      )}
    </Box>
  );
};

export default QueryLLM;
