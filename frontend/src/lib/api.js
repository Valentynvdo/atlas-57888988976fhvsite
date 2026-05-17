import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // send/receive session_token cookie
});

export default api;
