// src/api/axios.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3197";

console.log("API_URL:", API_URL);

const http = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST interceptor
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    console.log("Axios Request:", config.url, config.method, config.headers);
    return config;
  },
  (error) => {
    console.error("Axios Request Error:", error);
    return Promise.reject(error);
  }
);

// RESPONSE interceptor
http.interceptors.response.use(
  (response) => {
    console.log("Axios Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    const status = error?.response?.status;

    if (status) {
      console.error("Axios Response Error:", status, error?.response?.data);
    } else {
      console.error("Axios Timeout or Network Error:", error.message);
    }

    if (status === 401) {
      localStorage.removeItem("token");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default http;