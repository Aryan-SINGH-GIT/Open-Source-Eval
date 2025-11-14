import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './Charts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartJsWidget = ({ cityData }) => {
  // Temperature trend data
  const temperatureData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [
          cityData?.weather?.temp - 3,
          cityData?.weather?.temp - 1,
          cityData?.weather?.temp,
          cityData?.weather?.temp + 2,
          cityData?.weather?.temp + 1,
          cityData?.weather?.temp - 2,
          cityData?.weather?.temp
        ],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Energy consumption data
  const energyData = {
    labels: ['Solar', 'Wind', 'Hydro', 'Coal', 'Gas', 'Nuclear'],
    datasets: [
      {
        label: 'Energy Sources (MW)',
        data: [
          cityData?.energy?.usage * 0.15,
          cityData?.energy?.usage * 0.12,
          cityData?.energy?.usage * 0.08,
          cityData?.energy?.usage * 0.35,
          cityData?.energy?.usage * 0.20,
          cityData?.energy?.usage * 0.10
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(201, 203, 207, 0.8)'
        ]
      }
    ]
  };

  // Air quality comparison
  const airQualityData = {
    labels: ['PM2.5', 'PM10', 'AQI'],
    datasets: [
      {
        label: 'Current Levels',
        data: [cityData?.airQuality?.pm25 || 0, cityData?.airQuality?.pm10 || 0, cityData?.airQuality?.aqi || 0],
        backgroundColor: 'rgba(255, 99, 132, 0.8)'
      },
      {
        label: 'Safe Limits',
        data: [25, 50, 50],
        backgroundColor: 'rgba(75, 192, 192, 0.8)'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#fff' }
      }
    },
    scales: {
      y: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  return (
    <div className="chartjs-widget">
      <h2 className="chart-title">📊 Simple Chart Visualizations</h2>
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Temperature Trend</h3>
          <div className="chart-wrapper">
            <Line data={temperatureData} options={options} />
          </div>
        </div>
        <div className="chart-container">
          <h3>Energy Sources Distribution</h3>
          <div className="chart-wrapper">
            <Doughnut data={energyData} options={{ ...options, scales: undefined }} />
          </div>
        </div>
        <div className="chart-container">
          <h3>Air Quality Comparison</h3>
          <div className="chart-wrapper">
            <Bar data={airQualityData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartJsWidget;
