import React from 'react';
import { 
  Card, CardContent, Typography, Box, Chip, 
  IconButton, Tooltip, Grid, LinearProgress 
} from '@mui/material';
import { 
  Refresh, Thermostat, Opacity, AccessTime, 
  LocationOn, Warning 
} from '@mui/icons-material';

export default function LiveWBGTDisplay({ data, onRefresh }) {
  if (!data) return null;

  const getWBGTColor = (wbgt) => {
    if (wbgt < 31) return '#4caf50';
    if (wbgt < 32) return '#ff9800';
    if (wbgt < 33) return '#ff5722';
    return '#f44336';
  };

  const getRiskLabel = (wbgt) => {
    if (wbgt < 31) return 'LOW RISK';
    if (wbgt < 32) return 'MEDIUM RISK';
    if (wbgt < 33) return 'HIGH RISK';
    return 'CRITICAL RISK';
  };

  const color = getWBGTColor(data.wbgt);
  const updateTime = new Date(data.timestamp).toLocaleTimeString('en-SG');

  return (
    <Card sx={{ 
      mb: 3, 
      background: `linear-gradient(135deg, ${color}20 0%, #1e293b 100%)`,
      border: `2px solid ${color}`,
      boxShadow: `0 0 20px ${color}40`
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Thermostat sx={{ color }} /> Live WBGT Monitor
          </Typography>
          <Tooltip title="Refresh Data">
            <IconButton onClick={onRefresh} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography 
                variant="h1" 
                sx={{ 
                  color,
                  fontWeight: 'bold',
                  fontSize: '5rem',
                  textShadow: `0 0 30px ${color}80`
                }}
              >
                {data.wbgt.toFixed(1)}°C
              </Typography>
              
              <Chip 
                label={getRiskLabel(data.wbgt)}
                sx={{ 
                  backgroundColor: color,
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  py: 2,
                  px: 1,
                  mt: 1
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOn color="primary" />
                <Typography variant="h6">
                  {data.station.name}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                {data.station.location}
              </Typography>

              <Box display="flex" alignItems="center" gap={2}>
                <Chip 
                  icon={<Thermostat />} 
                  label={`${data.temperature}°C Air Temp`}
                  variant="outlined"
                />
                <Chip 
                  icon={<Opacity />} 
                  label={`${data.humidity}% Humidity`}
                  variant="outlined"
                />
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  Updated: {updateTime} (Auto-refreshes every 15 min)
                </Typography>
              </Box>

              {data.wbgt >= 32 && (
                <Alert severity="error" icon={<Warning />}>
                  Mandatory rest breaks required for heavy physical work
                </Alert>
              )}
            </Box>
          </Grid>
        </Grid>

        <LinearProgress 
          variant="determinate" 
          value={Math.min((data.wbgt / 38) * 100, 100)}
          sx={{ 
            mt: 3,
            height: 8,
            borderRadius: 4,
            backgroundColor: `${color}30`,
            '& .MuiLinearProgress-bar': {
              backgroundColor: color,
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
