import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Slider, Box, 
  TextField, Button, Chip, Grid 
} from '@mui/material';
import { Thermostat, AccessTime, Opacity } from '@mui/icons-material';

export default function WBGTMonitor({ currentValue, onUpdate }) {
  const [wbgt, setWbgt] = useState(currentValue);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [history, setHistory] = useState([]);

  // Auto-monitor every hour simulation (for demo)
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute for demo
    return () => clearInterval(interval);
  }, []);

  const handleSliderChange = (e, newValue) => {
    setWbgt(newValue);
    onUpdate(newValue);
  };

  const getRiskColor = (val) => {
    if (val < 31) return '#4caf50';
    if (val < 32) return '#ff9800';
    if (val < 33) return '#ff5722';
    return '#f44336';
  };

  return (
    <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Thermostat /> WBGT Monitor
        </Typography>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h1" sx={{ 
                color: getRiskColor(wbgt),
                fontWeight: 'bold',
                textShadow: `0 0 20px ${getRiskColor(wbgt)}40`
              }}>
                {wbgt.toFixed(1)}°C
              </Typography>
              <Chip 
                icon={<AccessTime />} 
                label={`Last updated: ${lastUpdated.toLocaleTimeString()}`}
                variant="outlined" 
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Adjust WBGT Reading</Typography>
            <Slider
              value={wbgt}
              onChange={handleSliderChange}
              min={25}
              max={38}
              step={0.1}
              marks={[
                { value: 31, label: '31°C' },
                { value: 32, label: '32°C' },
                { value: 33, label: '33°C' },
              ]}
              sx={{
                '& .MuiSlider-thumb': {
                  boxShadow: `0 0 10px ${getRiskColor(wbgt)}`,
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Manual Entry (°C)"
              type="number"
              value={wbgt}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setWbgt(val);
                onUpdate(val);
              }}
              sx={{ mt: 2 }}
              InputProps={{
                endAdornment: <Opacity color="action" />,
              }}
            />
            
            <Button 
              variant="contained" 
              fullWidth 
              sx={{ mt: 2 }}
              onClick={() => setLastUpdated(new Date())}
            >
              Record Hourly Reading
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
