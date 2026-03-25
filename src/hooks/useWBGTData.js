import { useState, useEffect } from 'react';

const STATIONS = [
  { id: 'S06', name: 'Paya Lebar', location: 'Paya Lebar Airport' },
  { id: 'S24', name: 'Upper Changi', location: 'Upper Changi Road North' },
  { id: 'S43', name: 'Kim Chuan', location: 'Kim Chuan Road' },
  { id: 'S44', name: 'Nanyang', location: 'Nanyang Avenue' },
  { id: 'S50', name: 'Clementi', location: 'Clementi Road' },
  { id: 'S60', name: 'Sentosa', location: 'Sentosa' },
  { id: 'S102', name: 'Semakau', location: 'Semakau Landfill' },
  { id: 'S106', name: 'Pulau Ubin', location: 'Pulau Ubin' },
  { id: 'S107', name: 'East Coast', location: 'East Coast Parkway' },
  { id: 'S109', name: 'Ang Mo Kio', location: 'Ang Mo Kio Avenue 5' },
  { id: 'S111', name: 'Scotts Road', location: 'Scotts Road' },
  { id: 'S115', name: 'Tuas South', location: 'Tuas South Avenue 3' },
  { id: 'S117', name: 'Banyan Road', location: 'Banyan Road' }
];

export function useWBGTData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState('S24'); // Default to Upper Changi

  const fetchWBGT = async () => {
    try {
      setLoading(true);
      
      // Fetch from data.gov.sg API (CORS-friendly)
      const response = await fetch(
        'https://api.data.gov.sg/v1/environment/air-temperature?date_time=' + new Date().toISOString()
      );
      
      if (!response.ok) throw new Error('Failed to fetch temperature data');
      
      const tempData = await response.json();
      
      // Fetch humidity data
      const humidityResponse = await fetch(
        'https://api.data.gov.sg/v1/environment/relative-humidity?date_time=' + new Date().toISOString()
      );
      
      if (!humidityResponse.ok) throw new Error('Failed to fetch humidity data');
      
      const humidityData = await humidityResponse.json();
      
      // Find latest readings for selected station
      const stationTemp = tempData.items[0].readings.find(r => r.station_id === selectedStation);
      const stationHumidity = humidityData.items[0].readings.find(r => r.station_id === selectedStation);
      
      if (!stationTemp || !stationHumidity) {
        throw new Error('Station data not available');
      }
      
      // Calculate estimated WBGT using formula: WBGT = 0.7*Twb + 0.2*Tg + 0.1*Td
      // Simplified estimation for demo (accurate calculation requires black globe sensor)
      const Td = stationTemp.value; // Dry bulb temperature
      const RH = stationHumidity.value; // Relative humidity
      
      // Estimate natural wet bulb temperature
      const Twb = Td * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) + 
                  Math.atan(Td + RH) - 
                  Math.atan(RH - 1.676331) + 
                  0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) - 
                  4.686035;
      
      // Estimate globe temperature (simplified for sunny conditions)
      const Tg = Td + 2; // Conservative estimate
      
      // Calculate WBGT
      const wbgt = (0.7 * Twb) + (0.2 * Tg) + (0.1 * Td);
      
      setData({
        station: STATIONS.find(s => s.id === selectedStation),
        temperature: Td,
        humidity: RH,
        wbgt: Math.round(wbgt * 10) / 10,
        timestamp: tempData.items[0].timestamp,
        allStations: STATIONS
      });
      
    } catch (err) {
      setError(err.message);
      // Fallback to simulated data if API fails
      setData({
        station: STATIONS.find(s => s.id === selectedStation),
        temperature: 29.5,
        humidity: 75,
        wbgt: 30.2,
        timestamp: new Date().toISOString(),
        allStations: STATIONS,
        simulated: true
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWBGT();
    
    // Auto-refresh every 15 minutes (NEA updates every 15 mins)
    const interval = setInterval(fetchWBGT, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [selectedStation]);

  return { data, loading, error, refetch: fetchWBGT, setSelectedStation };
}
