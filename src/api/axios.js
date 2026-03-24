
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3197";
console.log("API_URL:", API_URL);

const http = axios.create({
  baseURL: API_URL,
  timeout: 30000, // tăng timeout để phòng backend sleep
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

    // DEBUG log chỉ khi dev
    if (import.meta.env.DEV) {
      const safeHeaders = { ...config.headers };
      if (safeHeaders.Authorization) safeHeaders.Authorization = "***";
      console.log("Axios Request:", config.url, config.method, safeHeaders);
    }

    return config;
  },
  (error) => {
    if (import.meta.env.DEV) console.error("Axios Request Error:", error);
    return Promise.reject(error);
  }
);

// RESPONSE interceptor
http.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log("Axios Response:", response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    const status = error?.response?.status;

    if (status) {
      if (import.meta.env.DEV)
        console.error("Axios Response Error:", status, error?.response?.data);
    } else {
      if (import.meta.env.DEV)
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