# 🌆 Smart City Data Dashboard

A futuristic, interactive Smart City Data Dashboard featuring real-time monitoring of weather, traffic, air quality, energy consumption, and waste management with beautiful 3D animations and glassmorphism design.

## 🚀 Live Demo

**Deployed Application:** [https://open-source-eval.vercel.app/](https://open-source-eval.vercel.app/)

## ✨ Features

### 🎯 Core Features
- **Real-Time Weather Data** - Live weather updates using OpenWeatherMap API
- **Traffic Monitoring** - Real-time traffic flow and congestion data from TomTom API
- **Air Quality Tracking** - Live AQI monitoring using Open-Meteo API
- **Energy Consumption** - State-wise energy data from CEA (Central Electricity Authority)
- **Waste Management** - Smart time-based waste collection tracking
- **Multi-City Support** - Search and monitor any city worldwide

### 🎨 UI/UX Features
- **Landing Page** - Stunning hero section with 3D floating spheres
- **Authentication System** - Beautiful login/signup pages with animated backgrounds
- **3D Interactive Elements** - Smooth animations and transitions
- **Animated Glassmorphism Widgets** - Real-time KPIs with flowing effects
- **Data Visualization** - Interactive charts using Recharts, Plotly, and D3.js
- **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- **Motion Transitions** - Framer Motion powered animations

## 🎨 Design Theme

- **Colors**: Blue (#6366f1), Purple (#a855f7), Pink (#ec4899), Light Blue (#60a5fa), Black
- **Style**: Smooth 3D flowing animations with rounded corners (30px border-radius)
- **Effects**: Glassmorphism with 30px blur, floating geometric shapes, particle effects
- **Typography**: Orbitron (headings) + Rajdhani (body)

## 🚀 Tech Stack

### Frontend
- **React 18.2** - Modern React with hooks
- **React Router DOM 6.20** - Client-side routing
- **Vite 5.0** - Lightning-fast build tool
- **Framer Motion 10.16** - Smooth animations and transitions

### 3D & Visualization
- **Three.js 0.159** - 3D rendering
- **React Three Fiber 8.15** - React renderer for Three.js
- **React Three Drei 9.92** - Useful helpers for R3F
- **Recharts 2.10** - Responsive charts
- **Plotly.js** - Interactive data visualization
- **D3.js** - Advanced data visualization

### State Management
- **Redux 4.2** - State management
- **React Redux 8.1** - React bindings for Redux
- **Redux Saga 1.2** - Side effects management

### APIs Integrated
- **OpenWeatherMap API** - Real-time weather data
- **TomTom Traffic API** - Live traffic flow and incidents
- **Open-Meteo API** - Air quality data (no API key required)
- **CEA API** - Energy consumption data (India)

### Styling
- **CSS3** - Glassmorphism, gradients, custom animations
- **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
Open-Source-Eval/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Dashboard/           # Main dashboard component
│   │   ├── Landing/             # Landing page
│   │   ├── Auth/                # Authentication pages
│   │   ├── WeatherWidget/       # Weather display widget
│   │   ├── TrafficWidget/       # Traffic display widget
│   │   ├── AirQualityWidget/    # AQI display widget
│   │   ├── EnergyWidget/        # Energy consumption widget
│   │   ├── WasteWidget/         # Waste management widget
│   │   ├── Charts/              # Chart components (Plotly, D3)
│   │   └── FeatureCard/         # Feature showcase cards
│   ├── services/                # API integration layer
│   │   ├── weatherAPI.js        # OpenWeatherMap integration
│   │   ├── trafficAPI.js        # TomTom Traffic integration
│   │   ├── wasteAPI.js          # Waste management logic
│   │   ├── api.js               # AQI & Energy API exports
│   │   ├── api.services.js      # API service implementations
│   │   ├── api.config.js        # API configuration
│   │   └── api.utils.js         # API utilities
│   ├── App.jsx                  # Main app component
│   ├── App.css                  # Global styles
│   └── index.js                 # Entry point
├── public/                      # Static assets
├── .env                         # Environment variables (API keys)
├── .env.example                 # Environment template
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── vite.config.js               # Vite configuration
└── README.md                    # This file
```

## 🚀 User Flow

1. **Landing Page** (`/`) - Hero section with 3D animations and "Get Started" button
2. **Auth Page** (`/auth`) - Login or Sign Up with smooth tab transitions
3. **Dashboard** (`/dashboard`) - Full smart city monitoring interface

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone https://github.com/Aryan-SINGH-GIT/Open-Source-Eval.git
cd Open-Source-Eval
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory:

```env
# OpenWeatherMap API Key (Required)
VITE_WEATHER_API_KEY=your_openweathermap_api_key
VITE_WEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5

# TomTom Traffic API Key (Required)
VITE_TRAFFIC_API_KEY=your_tomtom_api_key
VITE_TRAFFIC_API_BASE_URL=https://api.tomtom.com/traffic/services/4

# Air Quality & Energy APIs (No keys required - public APIs)
```

**Get API Keys:**
- OpenWeatherMap: [https://openweathermap.org/api](https://openweathermap.org/api)
- TomTom Traffic: [https://developer.tomtom.com/](https://developer.tomtom.com/)

### Step 4: Start Development Server
```bash
npm run dev
```

The app will run at `http://localhost:5173/` (or `http://localhost:3000/`)

### Step 5: Build for Production
```bash
npm run build
npm run preview
```

## 🎨 Design Features

- **Volumetric Lighting** - Depth and atmosphere with radial gradients
- **Neon Accents** - Cyan, blue, and purple color scheme
- **Glassmorphism** - Frosted glass effect with backdrop blur
- **Animated Borders** - Glowing, sliding border effects
- **3D Icons** - Floating, rotating navigation icons
- **Responsive Typography** - Orbitron and Rajdhani fonts

## 📊 Dashboard Features

### 1. Weather Monitoring 🌤️
- **Real-time data** from OpenWeatherMap API
- Temperature, humidity, wind speed, pressure
- Weather conditions and "feels like" temperature
- Weather icons for visual representation
- **Cities supported:** Global coverage

### 2. Traffic Congestion 🚦
- **Live traffic flow** from TomTom API
- Current speed vs free-flow speed
- Congestion level calculation (0-100%)
- Traffic incidents count
- Delay estimation in minutes
- **Cities supported:** Mumbai, Delhi, Bangalore, Kolkata, London, Chennai, Hyderabad, Pune, and more

### 3. Air Quality Index 🌿
- **Real-time AQI** from Open-Meteo API
- PM2.5 and PM10 levels
- AQI status (Good, Moderate, Unhealthy, etc.)
- Color-coded indicators
- **No API key required**

### 4. Energy Consumption ⚡
- **State-wise data** from CEA (Central Electricity Authority)
- Total consumption in MW
- Renewable energy percentage
- Peak load estimation
- Per capita consumption
- **Cities supported:** Major Indian cities

### 5. Waste Management ♻️
- **Smart time-based simulation**
- Daily waste collection (tons)
- Recycling rate percentage
- Bin fill levels
- Next collection schedule
- **Dynamic data** based on current time and day

## 🎯 API Integration Details

| Feature | API Provider | Type | Rate Limit |
|---------|-------------|------|------------|
| Weather | OpenWeatherMap | Real-time | 1000 calls/day (free) |
| Traffic | TomTom | Real-time | 2500 calls/day (free) |
| Air Quality | Open-Meteo | Real-time | Unlimited (no key) |
| Energy | CEA India | Real-time | Public API |
| Waste | Custom Algorithm | Simulated | N/A |

## 🔧 Key Technical Implementations

### Weather API (`weatherAPI.js`)
- Fetches current weather by city name
- Supports weather forecast (5-day)
- Weather by coordinates (GPS support)
- Error handling with retry logic

### Traffic API (`trafficAPI.js`)
- Real-time traffic flow data
- Traffic incidents tracking
- Fallback data for unsupported cities
- Congestion calculation algorithm

### Waste Management (`wasteAPI.js`)
- Time-based waste collection simulation
- Uses real city population data
- Weekend adjustments (15% more waste)
- Hourly collection progress tracking

### Air Quality & Energy (`api.js`, `api.services.js`)
- Geocoding for city coordinates
- Parallel API calls for performance
- Automatic fallback on CORS errors
- City population database for calculations

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 👥 Team Contributions

### API Integrations
- **Weather API** - Real-time weather data from OpenWeatherMap
- **Traffic API** - Live traffic monitoring from TomTom
- **Waste Management** - Smart time-based simulation algorithm

### Frontend Development
- **Air Quality API** - Open-Meteo integration
- **Energy API** - CEA data integration with city-level calculations
- **Dashboard UI** - Main dashboard component and routing

### UI/UX Design
- **Landing Page** - 3D hero section with animations
- **Authentication** - Login/signup pages
- **Widget Components** - Weather, Traffic, AQI, Energy, Waste widgets

### Data Visualization
- **Charts Integration** - Plotly and D3.js implementations
- **Responsive Design** - Mobile-first approach
- **Animations** - Framer Motion integration

## 🎓 Project Purpose

This project was developed for a **14-hour hackathon** focused on:
- Open-source contribution
- API integration skills
- Real-time data visualization
- Smart city solutions
- Team collaboration

## 🔮 Future Enhancements

- [ ] Historical data tracking and trends
- [ ] Predictive analytics using ML
- [ ] Real-time notifications and alerts
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Export data as PDF/CSV
- [ ] Mobile app (React Native)
- [ ] Admin dashboard for data management

## 🐛 Known Issues

- CEA Energy API may have CORS issues (fallback data used)
- Some cities may not have traffic data (fallback provided)
- Waste management uses simulated data (no public API available)

## 📝 License

MIT License - feel free to use for your projects!

## 🤝 Contributing

Contributions welcome! Feel free to submit issues and pull requests.

### How to Contribute
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

## 🙏 Acknowledgments

- OpenWeatherMap for weather data
- TomTom for traffic data
- Open-Meteo for air quality data
- CEA India for energy data
- All open-source libraries used in this project

---

**Made with ❤️ for Smart Cities**
