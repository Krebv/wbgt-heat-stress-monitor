import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useWBGTData } from './hooks/useWBGTData';
import LiveWBGTDisplay from './components/LiveWBGTDisplay';
import StationSelector from './components/StationSelector';
import RiskDisplay from './components/RiskDisplay';
import MeasuresPanel from './components/MeasuresPanel';
import AlertBanner from './components/AlertBanner';
import { CircularProgress, Alert } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4fc3f7' },
    secondary: { main: '#ff9800' },
    error: { main: '#f44336' },
    warning: { main: '#ff9800' },
    success: { main: '#4caf50' },
    background: {
      default: '#0a1929',
      paper: '#1e293b',
    },
  },
});

function App() {
  const { data, loading, error, refetch, setSelectedStation } = useWBGTData();

  const getRiskLevel = (wbgt) => {
    if (wbgt < 31) return 'low';
    if (wbgt < 32) return 'medium';
    if (wbgt < 33) return 'high-medium';
    return 'high';
  };

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  const riskLevel = data ? getRiskLevel(data.wbgt) : 'low';

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Using simulated data - {error}
          </Alert>
        )}
        
        {data?.simulated && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Demo Mode: Using estimated WBGT values
          </Alert>
        )}
        
        <AlertBanner riskLevel={riskLevel} wbgt={data?.wbgt || 29} />
        
        <StationSelector 
          stations={data?.allStations || []}
          selected={data?.station?.id}
          onSelect={setSelectedStation}
        />
        
        <LiveWBGTDisplay 
          data={data}
          onRefresh={refetch}
        />
        
        <RiskDisplay level={riskLevel} value={data?.wbgt || 29} />
        
        <MeasuresPanel riskLevel={riskLevel} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
