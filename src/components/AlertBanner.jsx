import React from 'react';
import { Alert, AlertTitle, Collapse, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

export default function AlertBanner({ riskLevel, wbgt }) {
  const getAlertSeverity = () => {
    if (riskLevel === 'high') return 'error';
    if (riskLevel === 'high-medium') return 'warning';
    if (riskLevel === 'medium') return 'info';
    return 'success';
  };

  const getAlertText = () => {
    if (riskLevel === 'high') 
      return 'CRITICAL: Immediate action required. Redeploy vulnerable workers now.';
    if (riskLevel === 'high-medium') 
      return 'WARNING: Mandatory 10-minute hourly rest breaks for heavy work.';
    if (riskLevel === 'medium') 
      return 'CAUTION: Enhanced monitoring and hourly hydration required.';
    return 'NORMAL: Standard heat precautions apply.';
  };

  return (
    <Collapse in={riskLevel !== 'low'}>
      <Alert 
        severity={getAlertSeverity()}
        sx={{ mb: 2 }}
        action={
          <IconButton color="inherit" size="small">
            <Close fontSize="inherit" />
          </IconButton>
        }
      >
        <AlertTitle>WBGT Alert - {wbgt.toFixed(1)}°C</AlertTitle>
        {getAlertText()}
      </Alert>
    </Collapse>
  );
}
