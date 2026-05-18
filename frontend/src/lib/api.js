import axios from "axios";

const getBackendUrl = () => {
  if (typeof window === "undefined") return "http://localhost:8000";
  
  // 1. Prioritize environment variable (e.g. set in Render Static Site environment variables)
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }
  
  const hostname = window.location.hostname;
  // 2. On Render (production unified) — same origin, no port needed
  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    return window.location.origin;
  }
  // 3. Local dev — backend on port 8000
  return `http://${hostname}:8000`;
};

const BACKEND_URL = getBackendUrl();
export const API = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // send/receive session_token cookie
});

// Request interceptor: attach token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("atlas_session");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: automatically save token if returned in response body
api.interceptors.response.use((response) => {
  if (response.data && response.data.token) {
    localStorage.setItem("atlas_session", response.data.token);
  }
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem("atlas_session");
  }
  return Promise.reject(error);
});

export default api;
