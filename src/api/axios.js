import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3197";

console.log("API_URL:", API_URL);

const http = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    console.error("AXIOS ERROR:", error?.response);

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