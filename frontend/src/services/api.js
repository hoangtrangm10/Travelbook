import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Travel search
export const searchTravel = async (searchData) => {
  try {
    console.log('Searching with data:', searchData);
    const response = await api.post('/search/', {
      origin: searchData.origin || '',
      destination: searchData.destination,
      check_in: searchData.checkIn,
      check_out: searchData.checkOut,
      people: parseInt(searchData.people) || 1,
      rooms: parseInt(searchData.rooms) || 1,
      budget: searchData.budget ? parseInt(searchData.budget) : null,
    });
    console.log('Search response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Search API error:', error.response?.data || error.message);
    throw error;
  }
};

// Destinations
export const getDestinations = async (params = {}) => {
  const response = await api.get('/destinations/', { params });
  return response.data;
};

export const getPopularDestinations = async () => {
  const response = await api.get('/destinations/popular/');
  return response.data;
};

// Hotels
export const getHotels = async (params = {}) => {
  const response = await api.get('/hotels/', { params });
  return response.data;
};

// Transport
export const getTransports = async (params = {}) => {
  const response = await api.get('/transports/', { params });
  return response.data;
};

// Attractions
export const getAttractions = async (params = {}) => {
  const response = await api.get('/attractions/', { params });
  return response.data;
};

// Packages
export const getPackages = async (params = {}) => {
  const response = await api.get('/packages/', { params });
  return response.data;
};

export const getFeaturedPackages = async () => {
  const response = await api.get('/packages/featured/');
  return response.data;
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health/');
  return response.data;
};

// AI Travel Planner
export const getAIPlannerQuestions = async () => {
  const response = await api.get('/ai-planner/');
  return response.data;
};

export const generateAITravelPlan = async (planData) => {
  try {
    console.log('Generating AI travel plan:', planData);
    const response = await api.post('/ai-planner/', planData);
    console.log('AI plan response:', response.data);
    return response.data;
  } catch (error) {
    console.error('AI Planner error:', error.response?.data || error.message);
    throw error;
  }
};

export const checkAIPlannerStatus = async () => {
  const response = await api.get('/ai-planner/status/');
  return response.data;
};

export default api;
