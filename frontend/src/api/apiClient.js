// src/api/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Dynamically read the API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to inject the token into request headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Customize error handling, logging, and redirecting
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.resolve(error.response);
  }
);

export default apiClient;
