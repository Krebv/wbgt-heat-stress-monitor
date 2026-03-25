import { useState, useEffect } from 'react';

const STATIONS = [
  { id: 'S24', name: 'Upper Changi', location: 'Upper Changi Road North', temp: 31.2, humidity: 78 },
  { id: 'S43', name: 'Kim Chuan', location: 'Kim Chuan Road', temp: 30.5, humidity: 76 },
  { id: 'S44', name: 'Nanyang', location: 'Nanyang Avenue', temp: 30.8, humidity: 75 },
  { id: 'S50', name: 'Clementi', location: 'Clementi Road', temp: 31.5, humidity: 80 },
  { id: 'S60', name: 'Sentosa', location: 'Sentosa', temp: 29.9, humidity: 82 },
  { id: 'S100', name: 'Woodlands Road', location: 'Woodlands Road', temp: 30.5, humidity: 77 },
  { id: 'S104', name: 'Woodlands Avenue 9', location: 'Woodlands Avenue 9', temp: 30.2, humidity: 79 },
  { id: 'S106', name: 'Pulau Ubin', location: 'Pulau Ubin', temp: 30.0, humidity: 81 },
  { id: 'S107', name: 'East Coast', location: 'East Coast Parkway', temp: 30.5, humidity: 79 },
  { id: 'S109', name: 'Ang Mo Kio', location: 'Ang Mo Kio Avenue 5', temp: 30.8, humidity: 76 },
  { id: 'S111', name: 'Scotts Road', location: 'Scotts Road', temp: 32.1, humidity: 74 },
  { id: 'S115', name: 'Tuas South', location: 'Tuas South Avenue 3', temp: 31.8, humidity: 76 },
  { id: 'S116', name: 'West Coast', location: 'West Coast Highway', temp: 30.2, humidity: 81 },
  { id: 'S117', name: 'Banyan Road', location: 'Banyan Road', temp: 30.8, humidity: 75 }
];

// Calculate WBGT from temperature and humidity
const calculateWBGT = (temp, humidity) => {
  // Simplified formula for estimation
  const twb = temp * Math.atan(0.151977 * Math.sqrt(humidity + 8.313659)) + 
              Math.atan(temp + humidity) - 
              Math.atan(humidity - 1.676331) + 
              0.00391838 * Math.pow(humidity, 1.5) * Math.atan(0.023101 * humidity) - 
              4.686035;
  const tg = temp + 2; // Globe temp estimate
  return (0.7 * twb) + (0.2 * tg) + (0.1 * temp);
};

export function useWBGTData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState('S104'); // Default to Woodlands Avenue 9
  const [manualWBGT, setManualWBGT] = useState(null);

  useEffect(() => {
    // Simulate API fetch with realistic data
    const fetchData = () => {
      setLoading(true);
      
      // Simulate network delay
      setTimeout(() => {
        const station = STATIONS.find(s => s.id === selectedStation) || STATIONS[0];
        const wbgt = calculateWBGT(station.temp, station.humidity);
        
        setData({
          station: station,
          temperature: station.temp,
          humidity: station.humidity,
          wbgt: Math.round(wbgt * 10) / 10,
          timestamp: new Date().toISOString(),
          allStations: STATIONS,
          simulated: true
        });
        
        setError('Using simulated data - API access restricted from GitHub Pages');
        setLoading(false);
      }, 500);
    };

    fetchData();
    
    // Update every 15 minutes
    const interval = setInterval(fetchData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedStation]);

  // Allow manual WBGT override
  const setManualValue = (value) => {
    setManualWBGT(value);
    if (data) {
      setData({
        ...data,
        wbgt: value,
        manual: true
      });
    }
  };

  return { 
    data, 
    loading, 
    error, 
    setSelectedStation, 
    setManualValue,
    manualWBGT 
  };
}
