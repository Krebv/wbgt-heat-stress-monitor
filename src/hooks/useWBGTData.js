import { useState, useEffect } from 'react';

const FALLBACK_STATIONS = [
  { id: 'S124', name: 'Upper Changi Road North', location: 'Changi Meteorological Station', wbgt: 29.3, temperature: 31.2 },
  { id: 'S125', name: 'Woodlands Street 13', location: 'Woodlands Stadium', wbgt: 28.9, temperature: 30.8 },
  { id: 'S126', name: 'Old Chua Chu Kang Road', location: 'Old Choa Chu Kang Road', wbgt: 28.9, temperature: 30.5 },
  { id: 'S127', name: 'Stadium Road', location: 'Kallang Practice Track', wbgt: 29.5, temperature: 31.5 },
  { id: 'S128', name: 'Bishan Street', location: 'Bishan Stadium', wbgt: 28.7, temperature: 30.2 },
  { id: 'S129', name: 'Bedok North Street 2', location: 'Bedok Stadium', wbgt: 28.9, temperature: 30.4 },
  { id: 'S130', name: 'West Coast Road', location: 'Clementi Stadium', wbgt: 29.7, temperature: 31.8 },
  { id: 'S132', name: 'Jurong West Street 93', location: 'Jurong West Stadium', wbgt: 30.1, temperature: 32.2 },
  { id: 'S137', name: 'Sakra Road', location: 'Sakra Road (Jurong Island)', wbgt: 28.6, temperature: 30.1 },
  { id: 'S139', name: 'Tuas Terminal Gateway', location: 'Tuas Terminal Gateway', wbgt: 28.5, temperature: 30.0 },
  { id: 'S140', name: 'Choa Chu Kang Stadium', location: 'Choa Chu Kang Stadium', wbgt: 29.6, temperature: 31.6 },
  { id: 'S141', name: 'Yio Chu Kang Stadium', location: 'Yio Chu Kang Stadium', wbgt: 29.1, temperature: 31.1 },
  { id: 'S142', name: 'Sentosa Palawan Green', location: 'Palawan Green (Sentosa)', wbgt: 27.9, temperature: 29.8 },
  { id: 'S143', name: 'Punggol North', location: 'Punggol North', wbgt: 28.8, temperature: 30.6 },
  { id: 'S144', name: 'Upper Pickering Street', location: 'Hong Lim Park', wbgt: 29.8, temperature: 31.8 },
  { id: 'S149', name: 'Tampines Walk', location: 'Tampines Central Park', wbgt: 29.3, temperature: 31.3 },
  { id: 'S150', name: 'Evans Road', location: 'MOE (Evans) Stadium', wbgt: 29.7, temperature: 31.7 },
  { id: 'S153', name: 'Bukit Batok Street 22', location: 'Bukit Batok Swimming Complex', wbgt: 29.8, temperature: 31.8 },
  { id: 'S184', name: 'Sengkang East Avenue', location: 'Sengkang East Avenue', wbgt: 30.1, temperature: 32.2 },
  { id: 'S187', name: 'Bukit Timah (West)', location: 'Coronation Road', wbgt: 29.4, temperature: 31.2 }
];

export function useWBGTData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState('S125');
  const [allStations, setAllStations] = useState(FALLBACK_STATIONS);
  const [usingLiveData, setUsingLiveData] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Try CORS proxy first
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const wbgtApi = 'https://api-open.data.gov.sg/v2/real-time/api/weather?api=wbgt';
      const tempApi = 'https://api-open.data.gov.sg/v2/real-time/api/weather?api=air-temperature';
      
      const [wbgtResponse, tempResponse] = await Promise.all([
        fetch(proxyUrl + encodeURIComponent(wbgtApi)).catch(() => null),
        fetch(proxyUrl + encodeURIComponent(tempApi)).catch(() => null)
      ]);
      
      if (!wbgtResponse?.ok) {
        throw new Error('Proxy failed');
      }
      
      const wbgtResult = await wbgtResponse.json();
      const tempResult = tempResponse?.ok ? await tempResponse.json() : null;
      
      if (wbgtResult.code !== 0) {
        throw new Error('Invalid API response');
      }
      
      const wbgtReadings = wbgtResult.data.records[0].item.readings;
      const tempReadings = tempResult?.data?.records?.[0]?.item?.readings || [];
      const timestamp = wbgtResult.data.records[0].updatedTimestamp;
      
      const stations = wbgtReadings.map(wbgt => {
        const temp = tempReadings.find(t => t.station.id === wbgt.station.id);
        return {
          id: wbgt.station.id,
          name: wbgt.station.name,
          location: wbgt.station.townCenter || wbgt.station.name,
          wbgt: parseFloat(wbgt.wbgt),
          heatStress: wbgt.heatStress,
          temperature: temp ? parseFloat(temp.value) : (parseFloat(wbgt.wbgt) + 2) // estimate if no temp data
        };
      });
      
      setAllStations(stations);
      setUsingLiveData(true);
      setError(null);
      
      const station = stations.find(s => s.id === selectedStation) || stations[0];
      
      setData({
        station: station,
        wbgt: station.wbgt,
        temperature: station.temperature,
        heatStress: station.heatStress,
        timestamp: timestamp,
        allStations: stations,
        live: true
      });
      
    } catch (err) {
      console.log('Using fallback data:', err.message);
      setUsingLiveData(false);
      setError('Using cached data - Live API unavailable');
      
      const station = FALLBACK_STATIONS.find(s => s.id === selectedStation) || FALLBACK_STATIONS[0];
      setData({
        station: station,
        wbgt: station.wbgt,
        temperature: station.temperature,
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
    usingLiveData,
    setSelectedStation, 
    setManualValue,
    refetch: fetchData
  };
}
