import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, Box, Chip, 
  IconButton, Tooltip, Grid, LinearProgress, 
  TextField, Button, Slider 
} from '@mui/material';
import { Refresh, Thermostat, Opacity, AccessTime, LocationOn, Warning, Edit } from '@mui/icons-material';

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

  const wbgtColor = getWBGTColor(data.wbgt);
  const updateTime = new Date(data.timestamp).toLocaleTimeString('en-SG');

  const handleManualSet = () => {
    onManualSet(manualValue);
    setEditMode(false);
  };

  return (
    <Card sx={{ 
      mb: 3, 
      background: `linear-gradient(135deg, ${wbgtColor}20 0%, #1e293b 100%)`,
      border: `2px solid ${wbgtColor}`,
      boxShadow: `0 0 20px ${wbgtColor}40`
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Thermostat sx={{ color: wbgtColor }} /> Live WBGT Monitor
          </Typography>
          <Box>
            
