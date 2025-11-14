const initialState = {
  kpis: {
    population: 2847000,
    energyUsage: 1247,
    trafficFlow: 87,
    airQuality: 92
  },
  traffic: [],
  weather: { temp: 22, condition: 'Clear', humidity: 65 },
  airQuality: { aqi: 42, status: 'Good' },
  loading: false,
  error: null
};

const cityDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_CITY_DATA_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_CITY_DATA_SUCCESS':
      return { ...state, loading: false, ...action.payload };
    case 'FETCH_CITY_DATA_FAILURE':
      return { ...state, loading: false, error: action.error };
    case 'UPDATE_KPI':
      return { ...state, kpis: { ...state.kpis, ...action.payload } };
    default:
      return state;
  }
};

export default cityDataReducer;
