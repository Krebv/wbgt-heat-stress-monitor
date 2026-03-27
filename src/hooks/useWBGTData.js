import { useState, useEffect } from 'react';

export function useWBGTData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState('S24');
  const [allStations, setAllStations] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching from /api/weather...');
      
      const response = await fetch('/api/weather', {
        cache: 'no-store'
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API result:', result);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Check if data exists
      if (!result.wbgt || !result.wbgt.items || result.wbgt.items.length === 0) {
        throw new Error('No WBGT data available');
      }

      if (!result.temperature || !result.temperature.items || result.temperature.items.length === 0) {
        throw new Error('No temperature data available');
      }
      
      const wbgtReadings = result.wbgt.items[0].readings;
      const tempReadings = result.temperature.items[0].readings;
      const timestamp = result.wbgt.items[0].timestamp;
      const stationMetadata = result.wbgt.metadata?.stations || [];
      
      console.log('WBGT readings count:', wbgtReadings?.length);
      console.log('Temp readings count:', tempReadings?.length);
      
      if (!wbgtReadings || wbgtReadings.length === 0) {
        throw new Error('No station readings available');
      }
      
      const stations = wbgtReadings.map(wbgt => {
        const stationMeta = stationMetadata.find(s => s.id === wbgt.station_id);
        const temp = tempReadings?.find(t => t.station_id === wbgt.station_id);
        
        return {
          id: wbgt.station_id,
          name: stationMeta?.name || wbgt.station_id,
          location: stationMeta?.name || wbgt.station_id,
          latitude: stationMeta?.location?.latitude,
          longitude: stationMeta?.location?.longitude,
          wbgt: parseFloat(wbgt.value),
          heatStress: wbgt.heat_stress_level,
          temperature: temp ? parseFloat(temp.value) : null
        };
      });
      
      console.log('Processed stations:', stations.length);
      
      setAllStations(stations);
      
      // Find selected station or default to first available
      let station = stations.find(s => s.id === selectedStation);
      if (!station) {
        station = stations[0];
        console.log('Selected station not found, using:', station.id);
      }
      
      setData({
        station: station,
        wbgt: station.wbgt,
        temperature: station.temperature,
        heatStress: station.heatStress,
        timestamp: timestamp,
        allStations: stations
      });
      
      setError(null);
      
    } catch (err) {
      console.error('useWBGTData error:', err);
      setError(err.message);
      setData(null);
      setAllStations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh every 15 minutes
    const interval = setInterval(fetchData, 15 * 60 * 1000);
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
    setSelectedStation, 
    setManualValue,
    refetch: fetchData
  };
}
