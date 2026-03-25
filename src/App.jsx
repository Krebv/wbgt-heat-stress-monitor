import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import WBGTMonitor from './components/WBGTMonitor';
import RiskDisplay from './components/RiskDisplay';
import MeasuresPanel from './components/MeasuresPanel';
import AlertBanner from './components/AlertBanner';

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
  const [currentWBGT, setCurrentWBGT] = useState(29.5);
  const [riskLevel, setRiskLevel] = useState('low');

  const updateWBGT = (value) => {
    setCurrentWBGT(value);
    if (value < 31) setRiskLevel('low');
    else if (value < 32) setRiskLevel('medium');
    else if (value < 33) setRiskLevel('high-medium');
    else setRiskLevel('high');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <AlertBanner riskLevel={riskLevel} wbgt={currentWBGT} />
        
        <WBGTMonitor 
          currentValue={currentWBGT} 
          onUpdate={updateWBGT} 
        />
        
        <RiskDisplay level={riskLevel} value={currentWBGT} />
        
        <MeasuresPanel riskLevel={riskLevel} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
