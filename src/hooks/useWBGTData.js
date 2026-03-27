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
      
      // Call your own API route (no CORS issues)
      const response = await fetch('/api/weather');
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const result = await response.json();
      
      const wbgtReadings = result.wbgt.items[0].readings;
      const tempReadings = result.temperature.items[0].readings;
      const timestamp = result.wbgt.items[0].timestamp;
      const stationMetadata = result.wbgt.metadata.stations;
      
      const stations = wbgtReadings.map(wbgt => {
        const stationMeta = stationMetadata.find(s => s.id === wbgt.station_id);
        const temp = tempReadings.find(t => t.station_id === wbgt.station_id);
        
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
      
      setAllStations(stations);
      setError(null);
      
      const station = stations.find(s => s.id === selectedStation) || stations[0];
      
      setData({
        station: station,
        wbgt: station.wbgt,
        temperature: station.temperature,
        heatStress: station.heatStress,
        timestamp: timestamp,
        allStations: stations
      });
      
    } catch (err) {
      console.error('API failed:', err);
      setError(err.message);
      setData(null);
      setAllStations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
