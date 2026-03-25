import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { Warning, Error, CheckCircle, Info } from '@mui/icons-material';

const riskConfig = {
  low: {
    color: '#4caf50',
    icon: <CheckCircle />,
    title: 'LOW RISK',
    subtitle: 'WBGT below 31°C',
    description: 'Standard precautions apply',
    progress: 25
  },
  medium: {
    color: '#ff9800',
    icon: <Info />,
    title: 'MEDIUM RISK',
    subtitle: 'WBGT 31°C to <32°C',
    description: 'Enhanced monitoring required',
    progress: 50
  },
  'high-medium': {
    color: '#ff5722',
    icon: <Warning />,
    title: 'HIGH RISK (32°C+)',
    subtitle: 'WBGT 32°C to <33°C',
    description: 'Mandatory rest breaks enforced',
    progress: 75
  },
  high: {
    color: '#f44336',
    icon: <Error />,
    title: 'CRITICAL RISK',
    subtitle: 'WBGT 33°C and above',
    description: 'Immediate action required',
    progress: 100
  }
};

export default function RiskDisplay({ level, value }) {
  const config = riskConfig[level] || riskConfig.low;
  
  return (
    <Card sx={{ 
      mb: 3, 
      borderLeft: `6px solid ${config.color}`,
      background: `${config.color}10`,
      animation: level === 'high' ? 'pulse 2s infinite' : 'none',
      '@keyframes pulse': {
        '0%, 100%': { boxShadow: `0 0 0 ${config.color}40` },
        '50%': { boxShadow: `0 0 20px ${config.color}80` },
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ color: config.color, fontSize: 40 }}>
            {config.icon}
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: config.color, fontWeight: 'bold' }}>
              {config.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {config.subtitle}
            </Typography>
          </Box>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={config.progress} 
          sx={{ 
            height: 10, 
            borderRadius: 5,
            backgroundColor: `${config.color}30`,
            '& .MuiLinearProgress-bar': {
              backgroundColor: config.color,
            }
          }}
        />
        
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
          {config.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
