import { useState, useEffect } from 'react';

export function useWBGTData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState('S125');
  const [allStations, setAllStations] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const wbgtResponse = await fetch(
        'https://api-open.data.gov.sg/v2/real-time/api/weather?api=wbgt',
        { 
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        }
      );
      
      const tempResponse = await fetch(
        'https://api-open.data.gov.sg/v2/real-time/api/weather?api=air-temperature',
        { 
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        }
      );
      
      if (!wbgtResponse.ok || !tempResponse.ok) {
        throw new Error('API request failed');
      }
      
      const wbgtResult = await wbgtResponse.json();
      const tempResult = await tempResponse.json();
      
      if (wbgtResult.code !== 0 || tempResult.code !== 0) {
        throw new Error('Invalid API response');
      }
      
      const wbgtReadings = wbgtResult.data.records[0].item.readings;
      const tempReadings = tempResult.data.records[0].item.readings;
      const timestamp = wbgtResult.data.records[0].updatedTimestamp;
      
      const stations = wbgtReadings.map(wbgt => {
        const temp = tempReadings.find(t => t.station.id === wbgt.station.id);
        return {
          id: wbgt.station.id,
          name: wbgt.station.name,
          location: wbgt.station.townCenter || wbgt.station.name,
          wbgt: parseFloat(wbgt.wbgt),
          heatStress: wbgt.heatStress,
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
