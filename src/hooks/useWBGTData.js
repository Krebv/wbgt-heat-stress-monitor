import { useState, useEffect } from 'react';

// Fallback stations with Woodlands (used if API fails)
const FALLBACK_STATIONS = [
  { id: 'S124', name: 'Upper Changi Road North', location: 'Changi Meteorological Station', wbgt: 26.8, heatStress: 'Low' },
  { id: 'S125', name: 'Woodlands Street 13', location: 'Woodlands Stadium', wbgt: 27.2, heatStress: 'Low' },
  { id: 'S126', name: 'Old Chua Chu Kang Road', location: 'Old Choa Chu Kang Road', wbgt: 27.9, heatStress: 'Low' },
  { id: 'S127', name: 'Stadium Road', location: 'Kallang Practice Track', wbgt: 26.6, heatStress: 'Low' },
  { id: 'S128', name: 'Bishan Street', location: 'Bishan Stadium', wbgt: 26.4, heatStress: 'Low' },
  { id: 'S129', name: 'Bedok North Street 2', location: 'Bedok Stadium', wbgt: 26.6, heatStress: 'Low' },
  { id: 'S130', name: 'West Coast Road', location: 'Clementi Stadium', wbgt: 27.7, heatStress: 'Low' },
  { id: 'S132', name: 'Jurong West Street 93', location: 'Jurong West Stadium', wbgt: 28.3, heatStress: 'Low' },
  { id: 'S137', name: 'Sakra Road', location: 'Sakra Road (Jurong Island)', wbgt: 28.6, heatStress: 'Low' },
  { id: 'S139', name: 'Tuas Terminal Gateway', location: 'Tuas Terminal Gateway', wbgt: 27.1, heatStress: 'Low' },
  { id: 'S140', name: 'Choa Chu Kang Stadium', location: 'Choa Chu Kang Stadium', wbgt: 27.5, heatStress: 'Low' },
  { id: 'S141', name: 'Yio Chu Kang Stadium', location: 'Yio Chu Kang Stadium', wbgt: 27.0, heatStress: 'Low' },
  { id: 'S142', name: 'Sentosa Palawan Green', location: 'Palawan Green (Sentosa)', wbgt: 27.5, heatStress: 'Low' },
  { id: 'S143', name: 'Punggol North', location: 'Punggol North', wbgt: 26.3, heatStress: 'Low' },
  { id: 'S144', name: 'Upper Pickering Street', location: 'Hong Lim Park', wbgt: 26.2, heatStress: 'Low' },
  { id: 'S149', name: 'Tampines Walk', location: 'Tampines Central Park', wbgt: 26.3, heatStress: 'Low' },
  { id: 'S150', name: 'Evans Road', location: 'MOE (Evans) Stadium', wbgt: 26.5, heatStress: 'Low' },
  { id: 'S153', name: 'Bukit Batok Street 22', location: 'Bukit Batok Swimming Complex', wbgt: 27.4, heatStress: 'Low' },
  { id: 'S184', name: 'Sengkang East Avenue', location: 'Sengkang East Avenue', wbgt: 27.4, heatStress: 'Low' },
  { id: 'S187', name: 'Bukit Timah (West)', location: 'Coronation Road', wbgt: 26.2, heatStress: 'Low' }
];

export function useWBGTData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState('S125');
  const [allStations, setAllStations] = useState(FALLBACK_STATIONS);
  const [usingLiveData, setUsingLiveData] = useState(false);

  const fetchWBGT = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(
        'https://api-open.data.gov.sg/v2/real-time/api/weather?api=wbgt',
        { 
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        }
      );
      
      if (!response.ok) throw new Error('API request failed');
      
      const result = await response.json();
      
      if (result.code !== 0 || !result.data?.records?.[0]?.item?.readings) {
        throw new Error('Invalid API response');
      }
      
      const readings = result.data.records[0].item.readings;
      const timestamp = result.data.records[0].updatedTimestamp;
      
      const stations = readings.map(r => ({
        id: r.station.id,
        name: r.station.name,
        location: r.station.townCenter,
        wbgt: parseFloat(r.wbgt),
        heatStress: r.heatStress
      }));
      
      setAllStations(stations);
      setUsingLiveData(true);
      setError(null);
      
      const station = stations.find(s => s.id === selectedStation) || stations[0];
      
      setData({
        station: station,
        wbgt: station.wbgt,
        heatStress: station.heatStress,
        timestamp: timestamp,
        allStations: stations,
        live: true
      });
      
    } catch (err) {
      console.error('Live API failed:', err);
      setUsingLiveData(false);
      setError('Using cached data - Live API unavailable');
      
      const station = FALLBACK_STATIONS.find(s => s.id === selectedStation) || FALLBACK_STATIONS[0];
      setData({
        station: station,
        wbgt: station.wbgt,
        heatStress: station.heatStress,
        timestamp: new Date().toISOString(),
        allStations: FALLBACK_STATIONS,
        live: false
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWBGT();
    const interval = setInterval(fetchWBGT, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedStation]);

  const setManualValue = (value) => {
    if (data) {
      setData({
        ...data,
        wbgt: value,
        manual: true,
        heatStress: value < 31 ? 'Low' : value < 32 ? 'Medium' : value < 33 ? 'High' : 'Critical'
      });
    }
  };

  return { 
    data, 
    loading, 
    error, 
    usingLiveData,
    setSelectedStation, 
    setManualValue,
    refetch: fetchWBGT
  };
}
