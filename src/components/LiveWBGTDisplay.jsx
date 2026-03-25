import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, Box, Chip, 
  IconButton, Tooltip, Grid, LinearProgress, 
  TextField, Button, Slider 
} from '@mui/material';
import { Refresh, Thermostat, AccessTime, LocationOn, Warning, Edit } from '@mui/icons-material';

export default function LiveWBGTDisplay({ data, onRefresh, onManualSet }) {
  const [editMode, setEditMode] = useState(false);
  const [manualValue, setManualValue] = useState(data?.wbgt || 30);

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

  const handleManualSet = () => {
    onManualSet(manualValue);
    setEditMode(false);
  };

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
          <Box>
            <Tooltip title="Manual Input">
              <IconButton onClick={() => setEditMode(!editMode)} color={editMode ? "primary" : "default"}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh Data">
              <IconButton onClick={onRefresh} color="primary">
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {editMode ? (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>Manual WBGT Input</Typography>
            <Slider
              value={manualValue}
              onChange={(e, val) => setManualValue(val)}
              min={25}
              max={38}
              step={0.1}
              marks={[
                { value: 31, label: '31°C' },
                { value: 32, label: '32°C' },
                { value: 33, label: '33°C' },
              ]}
              sx={{ mb: 2 }}
            />
            <Box display="flex" gap={2}>
              <TextField
                type="number"
                value={manualValue}
                onChange={(e) => setManualValue(parseFloat(e.target.value))}
                label="WBGT Value"
                sx={{ flex: 1 }}
              />
              <Button variant="contained" onClick={handleManualSet} sx={{ mt: 1 }}>
                Set Value
              </Button>
            </Box>
          </Box>
        ) : (
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
                
                {data.manual && (
                  <Chip label="MANUAL INPUT" color="warning" size="small" sx={{ mt: 1, ml: 1 }} />
                )}
                
                {data.live && (
                  <Chip label="LIVE DATA" color="success" size="small" sx={{ mt: 1, ml: 1 }} />
                )}
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

                <Box display="flex" alignItems="center" gap={1}>
                  <AccessTime fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Updated: {updateTime} (Auto-refreshes every 15 min)
                  </Typography>
                </Box>

                {data.heatStress && (
                  <Chip 
                    label={`Heat Stress: ${data.heatStress}`}
                    color={data.heatStress === 'Low' ? 'success' : data.heatStress === 'Medium' ? 'warning' : 'error'}
                    variant="outlined"
                    size="small"
                  />
                )}

                {data.wbgt >= 32 && (
                  <Box sx={{ p: 1, bgcolor: 'error.main', color: 'error.contrastText', borderRadius: 1 }}>
                    <Warning fontSize="small" sx={{ mr: 1 }} />
                    Mandatory rest breaks required for heavy physical work
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        )}

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
