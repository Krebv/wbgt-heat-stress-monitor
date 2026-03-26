import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Tooltip
} from '@mui/material';
import { History, Refresh, Delete, Download } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// Risk level colors
const RISK_COLORS = {
  low: '#4caf50',
  medium: '#ff9800',
  'high-medium': '#ff5722',
  high: '#f44336'
};

export default function HistoricalLog({ currentWBGT, currentStation, riskLevel }) {
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wbgt-history');
    if (saved) {
      const parsed = JSON.parse(saved);
      setHistory(parsed);
      updateChartData(parsed);
    }
  }, []);

  // Save current reading when it changes
  useEffect(() => {
    if (currentWBGT && currentStation) {
      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        wbgt: currentWBGT,
        station: currentStation.name,
        stationId: currentStation.id,
        riskLevel: riskLevel,
        date: new Date().toLocaleDateString('en-SG'),
        time: new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })
      };

      setHistory(prev => {
        // Avoid duplicates (same minute)
        const lastEntry = prev[0];
        if (lastEntry && lastEntry.time === newEntry.time && lastEntry.station === newEntry.station) {
          return prev;
        }
        
        const updated = [newEntry, ...prev].slice(0, 50); // Keep last 50 entries
        localStorage.setItem('wbgt-history', JSON.stringify(updated));
        updateChartData(updated);
        return updated;
      });
    }
  }, [currentWBGT, currentStation, riskLevel]);

  const updateChartData = (data) => {
    // Reverse for chart (oldest first)
    const chart = [...data].reverse().map(entry => ({
      time: entry.time,
      wbgt: entry.wbgt,
      risk: entry.riskLevel
    }));
    setChartData(chart);
  };

  const clearHistory = () => {
    localStorage.removeItem('wbgt-history');
    setHistory([]);
    setChartData([]);
  };

  const exportData = () => {
    const csv = [
      ['Date', 'Time', 'Station', 'WBGT (°C)', 'Risk Level'].join(','),
      ...history.map(h => [h.date, h.time, h.station, h.wbgt, h.riskLevel].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wbgt-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getRiskColor = (level) => RISK_COLORS[level] || '#4caf50';

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
            <History /> Historical WBGT Log
          </Typography>
          <Box>
            <Tooltip title="Export to CSV">
              <IconButton onClick={exportData} color="primary">
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear History">
              <IconButton onClick={clearHistory} color="error">
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Chart */}
        {chartData.length > 1 && (
          <Box sx={{ height: 300, mb: 3 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#888" fontSize={12} />
                <YAxis domain={[25, 38]} stroke="#888" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                  labelStyle={{ color: '#fff' }}
                />
                <ReferenceLine y={31} stroke="#ff9800" strokeDasharray="3 3" label="Medium Risk" />
                <ReferenceLine y={32} stroke="#ff5722" strokeDasharray="3 3" label="High Risk" />
                <ReferenceLine y={33} stroke="#f44336" strokeDasharray="3 3" label="Critical" />
                <Line 
                  type="monotone" 
                  dataKey="wbgt" 
                  stroke="#4fc3f7" 
                  strokeWidth={2}
                  dot={{ fill: '#4fc3f7', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}

        {/* Stats Summary */}
        {history.length > 0 && (
          <Box display="flex" gap={2} mb={2} flexWrap="wrap">
            <Chip label={`${history.length} readings`} variant="outlined" />
            <Chip 
              label={`Max: ${Math.max(...history.map(h => h.wbgt)).toFixed(1)}°C`} 
              color="error" 
              variant="outlined" 
            />
            <Chip 
              label={`Min: ${Math.min(...history.map(h => h.wbgt)).toFixed(1)}°C`} 
              color="success" 
              variant="outlined" 
            />
            <Chip 
              label={`Avg: ${(history.reduce((a, b) => a + b.wbgt, 0) / history.length).toFixed(1)}°C`} 
              color="primary" 
              variant="outlined" 
            />
          </Box>
        )}

        {/* Table */}
        <TableContainer component={Paper} sx={{ maxHeight: 300, bgcolor: 'background.paper' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Time</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Station</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>WBGT</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Risk</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.slice(0, 20).map((entry) => (
                <TableRow key={entry.id} hover>
                  <TableCell sx={{ color: 'white' }}>{entry.date}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{entry.time}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{entry.station}</TableCell>
                  <TableCell sx={{ color: getRiskColor(entry.riskLevel), fontWeight: 'bold' }}>
                    {entry.wbgt.toFixed(1)}°C
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={entry.riskLevel.toUpperCase()} 
                      size="small"
                      sx={{ 
                        bgcolor: getRiskColor(entry.riskLevel),
                        color: 'white',
                        fontSize: '0.7rem'
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
