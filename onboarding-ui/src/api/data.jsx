import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch all users
export const getUsers = () => axios.get(`${BASE_URL}/api/users`);