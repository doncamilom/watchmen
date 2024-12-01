import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DescriptiveStats = ({ cityName }) => {
  const [cityVessels, setCityVessels] = useState([]);
  const [vesselTypeCounts, setVesselTypeCounts] = useState({});
  const [typeSpecificCounts, setTypeSpecificCounts] = useState({});
  const [destPortCounts, setDestPortCounts] = useState({});

  useEffect(() => {
    fetch('/maritime_data.json')
      .then((response) => response.json())
      .then((data) => {
        const filteredVessels = data.filter(
          (vessel) =>
            vessel.dep_port.toLowerCase() === cityName.toLowerCase() ||
            vessel.dest_port.toLowerCase() === cityName.toLowerCase()
        );
        setCityVessels(filteredVessels);

        const typeCounts = {};
        const specificCounts = {};
        const destCounts = {};

        filteredVessels.forEach((vessel) => {
          typeCounts[vessel.type] = (typeCounts[vessel.type] || 0) + 1;
          specificCounts[vessel.type_specific] = (specificCounts[vessel.type_specific] || 0) + 1;
          destCounts[vessel.dest_port] = (destCounts[vessel.dest_port] || 0) + 1;
        });

        setVesselTypeCounts(typeCounts);
        setTypeSpecificCounts(specificCounts);
        setDestPortCounts(destCounts);
      })
      .catch((error) => console.error('Error fetching vessel data:', error));
  }, [cityName]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Vessel Data in ${cityName}`,
      },
    },
  };

  const createChartData = (data, label, color) => ({
    labels: Object.keys(data),
    datasets: [
      {
        label,
        data: Object.values(data),
        backgroundColor: color,
      },
    ],
  });

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3, height: '400px' }}>
        <Typography variant="h6" gutterBottom>
          Vessel Type Specific Distribution
        </Typography>
        <Bar
          data={createChartData(
            typeSpecificCounts,
            'Number of Vessels (Type Specific)',
            'rgba(153, 102, 255, 0.6)'
          )}
          options={chartOptions}
        />
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3, height: '400px' }}>
        <Typography variant="h6" gutterBottom>
          Destination Port Distribution
        </Typography>
        <Bar
          data={createChartData(
            destPortCounts,
            'Number of Vessels by Destination Port',
            'rgba(255, 159, 64, 0.6)'
          )}
          options={chartOptions}
        />
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3, height: '400px' }}>
        <Typography variant="h6" gutterBottom>
          Vessel Type Distribution
        </Typography>
        <Bar
          data={createChartData(vesselTypeCounts, 'Number of Vessels', 'rgba(75, 192, 192, 0.6)')}
          options={chartOptions}
        />
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Vessel Details
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vessel Name</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Type Specific</TableCell>
                <TableCell>Departure Port</TableCell>
                <TableCell>Destination Port</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cityVessels.map((vessel, index) => (
                <TableRow key={index}>
                  <TableCell>{vessel.name}</TableCell>
                  <TableCell>{vessel.country_iso}</TableCell>
                  <TableCell>{vessel.type}</TableCell>
                  <TableCell>{vessel.type_specific}</TableCell>
                  <TableCell>{vessel.dep_port}</TableCell>
                  <TableCell>{vessel.dest_port}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DescriptiveStats;