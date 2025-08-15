import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const signup = (email, password) => axios.post(`${BASE_URL}/api/users/signup`, { email, password });
export const login = (email, password) => axios.post(`${BASE_URL}/api/users/login`, { email, password });
export const getUser = (userId) => axios.get(`${BASE_URL}/api/users/${userId}`);
export const updateUser = (userId, data) => axios.patch(`${BASE_URL}/api/users/${userId}`, data);
export const getConfig = () => axios.get(`${BASE_URL}/api/config`);