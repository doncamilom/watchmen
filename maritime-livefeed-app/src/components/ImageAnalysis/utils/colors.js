export const getColor = (index) => {
  const colors = [
    '#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF', 
    '#FFD700', '#FF4500', '#9400D3', '#32CD32'
  ];
  return colors[index % colors.length];
};