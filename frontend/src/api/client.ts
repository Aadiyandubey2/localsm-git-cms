import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "/api"
    : "http://localhost:5000/api");

console.log("✅ API Base URL:", API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `➡️ ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.data);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error);
    return Promise.reject(error);
  }
);