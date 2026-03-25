import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { LocationOn } from '@mui/icons-material';

export default function StationSelector({ stations, selected, onSelect }) {
  return (
    <Box sx={{ mb: 2 }}>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="station-select-label">
          <LocationOn fontSize="small" sx={{ mr: 1 }} />
          Select Weather Station
        </InputLabel>
        <Select
          labelId="station-select-label"
          value={selected || ''}
          onChange={(e) => onSelect(e.target.value)}
          label="Select Weather Station"
        >
          {stations.map((station) => (
            <MenuItem key={station.id} value={station.id}>
              {station.name} - {station.location}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
