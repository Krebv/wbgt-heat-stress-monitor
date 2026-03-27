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
      
      // Correct API endpoints for Singapore NEA
      const wbgtResponse = await fetch(
        'https://api.data.gov.sg/v1/environment/wet-bulb-globe-temperature',
        { 
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        }
      );
      
      const tempResponse = await fetch(
        'https://api.data.gov.sg/v1/environment/air-temperature',
        { 
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        }
      );
      
      if (!wbgtResponse.ok || !tempResponse.ok) {
        throw new Error(`API request failed: WBGT ${wbgtResponse.status}, Temp ${tempResponse.status}`);
      }
      
      const wbgtResult = await wbgtResponse.json();
      const tempResult = await tempResponse.json();
      
      // Get latest readings
      const latestWBGT = wbgtResult.items[0];
      const latestTemp = tempResult.items[0];
      const timestamp = latestWBGT.timestamp;
      
      // Create station map from metadata
      const stationMetadata = wbgtResult.metadata.stations;
      
      const stations = latestWBGT.readings.map(wbgt => {
        const stationMeta = stationMetadata.find(s => s.id === wbgt.station_id);
        const temp = latestTemp.readings.find(t => t.station_id === wbgt.station_id);
        
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
      console.error('Live API failed:', err);
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
