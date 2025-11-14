import Plot from 'react-plotly.js';
import './Charts.css';

const PlotlyWidget = ({ cityData }) => {
  if (!cityData) {
    return (
      <div className="plotly-widget">
        <h2 className="chart-title">📈 Plot Visualizations</h2>
        <p style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>
          Loading data...
        </p>
      </div>
    );
  }

  // Traffic flow 3D surface - based on actual traffic data
  const baseSpeed = cityData.traffic?.avgSpeed || 30;
  const trafficSurfaceData = [{
    z: [
      [baseSpeed * 0.6, baseSpeed * 0.7, baseSpeed * 0.8, baseSpeed * 0.9, baseSpeed, baseSpeed * 1.1],
      [baseSpeed * 0.7, baseSpeed * 0.8, baseSpeed * 0.9, baseSpeed, baseSpeed * 1.1, baseSpeed * 1.2],
      [baseSpeed * 0.8, baseSpeed * 0.9, baseSpeed, baseSpeed * 1.1, baseSpeed * 1.2, baseSpeed * 1.3],
      [baseSpeed * 0.9, baseSpeed, baseSpeed * 1.1, baseSpeed * 1.2, baseSpeed * 1.3, baseSpeed * 1.4],
      [baseSpeed, baseSpeed * 1.1, baseSpeed * 1.2, baseSpeed * 1.3, baseSpeed * 1.4, baseSpeed * 1.5]
    ],
    type: 'surface',
    colorscale: 'Viridis',
    showscale: true
  }];

  // Waste management timeline
  const wasteTimelineData = [{
    x: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    y: [
      cityData?.waste?.collected * 0.8,
      cityData?.waste?.collected * 0.9,
      cityData?.waste?.collected * 1.1,
      cityData?.waste?.collected
    ],
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Collected',
    line: { color: '#10b981', width: 3 },
    marker: { size: 10 }
  }, {
    x: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    y: [
      cityData?.waste?.collected * 0.25,
      cityData?.waste?.collected * 0.27,
      cityData?.waste?.collected * 0.29,
      cityData?.waste?.collected * 0.30
    ],
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Recycled',
    line: { color: '#3b82f6', width: 3 },
    marker: { size: 10 }
  }];

  // Energy usage heatmap
  const energyHeatmapData = [{
    z: [
      [cityData?.energy?.usage * 0.7, cityData?.energy?.usage * 0.8, cityData?.energy?.usage * 0.9, cityData?.energy?.usage],
      [cityData?.energy?.usage * 0.6, cityData?.energy?.usage * 0.75, cityData?.energy?.usage * 0.85, cityData?.energy?.usage * 0.95],
      [cityData?.energy?.usage * 0.65, cityData?.energy?.usage * 0.78, cityData?.energy?.usage * 0.88, cityData?.energy?.usage * 0.98],
      [cityData?.energy?.usage * 0.72, cityData?.energy?.usage * 0.82, cityData?.energy?.usage * 0.92, cityData?.energy?.peak]
    ],
    x: ['6 AM', '12 PM', '6 PM', '12 AM'],
    y: ['Mon', 'Tue', 'Wed', 'Thu'],
    type: 'heatmap',
    colorscale: 'Hot'
  }];

  const layout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#fff', size: 12 },
    margin: { t: 50, b: 50, l: 60, r: 40 },
    autosize: true
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
  };

  return (
    <div className="plotly-widget">
      <h2 className="chart-title">📈 Plot Visualizations</h2>
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Traffic Flow 3D Surface</h3>
          <div style={{ width: '100%', height: '350px' }}>
            <Plot
              data={trafficSurfaceData}
              layout={{
                ...layout,
                title: { text: 'Speed (km/h) by Location & Time', font: { color: '#fff' } },
                scene: {
                  xaxis: { title: 'Location', gridcolor: '#444' },
                  yaxis: { title: 'Time', gridcolor: '#444' },
                  zaxis: { title: 'Speed (km/h)', gridcolor: '#444' }
                }
              }}
              config={config}
              style={{ width: '100%', height: '100%' }}
              useResizeHandler={true}
            />
          </div>
        </div>
        <div className="chart-container">
          <h3>Waste Management Timeline</h3>
          <div style={{ width: '100%', height: '350px' }}>
            <Plot
              data={wasteTimelineData}
              layout={{
                ...layout,
                title: { text: 'Weekly Waste Collection (tons)', font: { color: '#fff' } },
                xaxis: { title: 'Week', gridcolor: '#444' },
                yaxis: { title: 'Tons', gridcolor: '#444' },
                showlegend: true,
                legend: { font: { color: '#fff' } }
              }}
              config={config}
              style={{ width: '100%', height: '100%' }}
              useResizeHandler={true}
            />
          </div>
        </div>
        <div className="chart-container">
          <h3>Energy Usage Heatmap</h3>
          <div style={{ width: '100%', height: '350px' }}>
            <Plot
              data={energyHeatmapData}
              layout={{
                ...layout,
                title: { text: 'Hourly Energy Consumption (MW)', font: { color: '#fff' } },
                xaxis: { title: 'Time of Day', gridcolor: '#444' },
                yaxis: { title: 'Day', gridcolor: '#444' }
              }}
              config={config}
              style={{ width: '100%', height: '100%' }}
              useResizeHandler={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlotlyWidget;
