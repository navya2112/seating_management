import axios from 'axios';

const API_BASE = 'https://your-api-url.com';

export const login = (data) => axios.post(`${API_BASE}/login`, data);
export const getLocations = () => axios.get(`${API_BASE}/locations`);
// Add more as needed
