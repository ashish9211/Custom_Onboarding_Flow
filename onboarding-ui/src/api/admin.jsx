import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Fetch onboarding configuration
export const getConfig = () => axios.get(`${API_BASE}/api/config`);

// Save new configuration 
export const saveConfig = (pages) => axios.post(`${API_BASE}/api/config`, { pages });

// Legacy save fallback 
export const saveConfigLegacy = (page2Components = [], page3Components = []) =>
  axios.post(`${API_BASE}/api/config`, { page2Components, page3Components });
