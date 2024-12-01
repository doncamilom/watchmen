import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
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
  PointElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const DescriptiveStats = ({ cityName }) => {
  const [cityVessels, setCityVessels] = useState([]);
  const [vesselTypeCounts, setVesselTypeCounts] = useState({});
  const [typeSpecificCounts, setTypeSpecificCounts] = useState({});
  const [destPortCounts, setDestPortCounts] = useState({});
  const [navigationStats, setNavigationStats] = useState({
    speedRanges: {},
    draughtRanges: {},
    courseRanges: {},
  });

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
        const speedRanges = {};
        const draughtRanges = {};
        const courseRanges = {};

        filteredVessels.forEach((vessel) => {
          typeCounts[vessel.type] = (typeCounts[vessel.type] || 0) + 1;
          specificCounts[vessel.type_specific] = (specificCounts[vessel.type_specific] || 0) + 1;
          destCounts[vessel.dest_port] = (destCounts[vessel.dest_port] || 0) + 1;

          if (vessel.speed != null) {
            const speedRange = `${Math.floor(vessel.speed / 5) * 5}-${Math.floor(vessel.speed / 5) * 5 + 5}`;
            speedRanges[speedRange] = (speedRanges[speedRange] || 0) + 1;
          }

          if (vessel.current_draught != null) {
            const draughtRange = `${Math.floor(vessel.current_draught / 2) * 2}-${Math.floor(vessel.current_draught / 2) * 2 + 2}`;
            draughtRanges[draughtRange] = (draughtRanges[draughtRange] || 0) + 1;
          }

          if (vessel.course != null) {
            const courseRange = `${Math.floor(vessel.course / 45) * 45}-${Math.floor(vessel.course / 45) * 45 + 45}`;
            courseRanges[courseRange] = (courseRanges[courseRange] || 0) + 1;
          }
        });

        setVesselTypeCounts(typeCounts);
        setTypeSpecificCounts(specificCounts);
        setDestPortCounts(destCounts);
        setNavigationStats({ speedRanges, draughtRanges, courseRanges });
      })
      .catch((error) => console.error('Error fetching vessel data:', error));
  }, [cityName]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 0,
        bottom: 20
      }
    },
    plugins: {
      legend: {
        position: 'top',
        padding: 20
      },
      title: {
        display: true,
        text: `Vessel Data in ${cityName}`,
        padding: {
          top: 10,
          bottom: 10
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          padding: 10
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false
        }
      }
    }
  };

  const createChartData = (data, label, color) => ({
    labels: Object.keys(data),
    datasets: [
      {
        label,
        data: Object.values(data),
        backgroundColor: color,
        borderRadius: 5,
      },
    ],
  });

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Grid container spacing={3}>
        {/* Vessel Type Charts - First Row */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              height: '450px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Vessel Type Distribution
            </Typography>
            <Box sx={{ flex: 1, position: 'relative' }}>
              <Bar
                data={createChartData(vesselTypeCounts, 'Number of Vessels', 'rgba(75, 192, 192, 0.6)')}
                options={chartOptions}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              height: '450px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Vessel Type Specific Distribution
            </Typography>
            <Box sx={{ flex: 1, position: 'relative' }}>
              <Bar
                data={createChartData(
                  typeSpecificCounts,
                  'Number of Vessels (Type Specific)',
                  'rgba(153, 102, 255, 0.6)'
                )}
                options={chartOptions}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Port and Speed Distribution - Second Row */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              height: '450px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Destination Port Distribution
            </Typography>
            <Box sx={{ flex: 1, position: 'relative' }}>
              <Bar
                data={createChartData(
                  destPortCounts,
                  'Number of Vessels by Destination Port',
                  'rgba(255, 159, 64, 0.6)'
                )}
                options={chartOptions}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              height: '450px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Speed Distribution
            </Typography>
            <Box sx={{ flex: 1, position: 'relative' }}>
              <Bar
                data={createChartData(
                  navigationStats.speedRanges,
                  'Number of Vessels by Speed Range (knots)',
                  'rgba(255, 99, 132, 0.6)'
                )}
                options={chartOptions}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Draught and Course - Third Row */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              height: '450px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Draught Distribution
            </Typography>
            <Box sx={{ flex: 1, position: 'relative' }}>
              <Bar
                data={createChartData(
                  navigationStats.draughtRanges,
                  'Number of Vessels by Draught Range (meters)',
                  'rgba(54, 162, 235, 0.6)'
                )}
                options={chartOptions}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              height: '450px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Course Distribution
            </Typography>
            <Box sx={{ flex: 1, position: 'relative' }}>
              <Bar
                data={createChartData(
                  navigationStats.courseRanges,
                  'Number of Vessels by Course Range (degrees)',
                  'rgba(75, 192, 192, 0.6)'
                )}
                options={chartOptions}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Vessel Details Table */}
      <Box sx={{ mt: 3 }}>
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
                  <TableCell>Speed (knots)</TableCell>
                  <TableCell>Draught (m)</TableCell>
                  <TableCell>Course (°)</TableCell>
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
                    <TableCell>{vessel.speed?.toFixed(1) || 'N/A'}</TableCell>
                    <TableCell>{vessel.current_draught?.toFixed(1) || 'N/A'}</TableCell>
                    <TableCell>{vessel.course?.toFixed(1) || 'N/A'}</TableCell>
                    <TableCell>{vessel.dep_port}</TableCell>
                    <TableCell>{vessel.dest_port}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default DescriptiveStats;