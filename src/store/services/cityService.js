export const fetchCityData = async () => {
  // Simulate API call with mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        kpis: {
          population: 2847000 + Math.floor(Math.random() * 1000),
          energyUsage: 1247 + Math.floor(Math.random() * 100),
          trafficFlow: 85 + Math.floor(Math.random() * 15),
          airQuality: 90 + Math.floor(Math.random() * 10)
        },
        traffic: generateTrafficData(),
        weather: {
          temp: 20 + Math.floor(Math.random() * 10),
          condition: ['Clear', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
          humidity: 60 + Math.floor(Math.random() * 20)
        },
        airQuality: {
          aqi: 30 + Math.floor(Math.random() * 50),
          status: 'Good'
        }
      });
    }, 300);
  });
};

const generateTrafficData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    flow: 40 + Math.random() * 60
  }));
};
