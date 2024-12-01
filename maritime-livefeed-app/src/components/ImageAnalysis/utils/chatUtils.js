// utils/chatUtils.js
export const generateSuggestions = (selectedLabel, imageData) => {
  if (selectedLabel) {
    return [
      `What is the purpose of this ${selectedLabel.label}?`,
      `What are the typical dimensions of a ${selectedLabel.label}?`,
      `What safety features are common on ${selectedLabel.label}s?`,
      "Can you describe the current status of this vessel?",
      "What are the visible identifying features?",
      `Is this ${selectedLabel.label} properly positioned?`,
      "Are there any potential hazards or concerns?",
      "What maritime regulations apply to this vessel?"
    ];
  } 
  
  if (imageData?.results?.length > 0) {
    return [
      `How many boats/ships are visible in this image?`,
      "What types of maritime activities are occurring?",
      "Are there any safety concerns in this scene?",
      "What are the weather and visibility conditions?",
      "Can you identify any port infrastructure?",
      "What maritime traffic patterns are visible?",
      "What kinds of wildlife (e.g, birds) can be observed in the image?"
    ];
  }

  return [];
};

export const parseResponse = (responseData) => {
  try {
    // If responseData has a result property, return it directly
    if (responseData && responseData.result) {
      return responseData.result;
    }
    
    // Fallback for other response formats
    return responseData.message || responseData.response || 'Unexpected response format';
  } catch (error) {
    console.error('Error parsing response:', error);
    return 'Error processing the response';
  }
};