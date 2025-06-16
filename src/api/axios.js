// src/utils/axios.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

console.log("API URL:", import.meta.env.VITE_API_URL);

const http = axios.create({
  baseURL: API_URL, // hoặc dùng process.env.REACT_APP_API_URL "http://localhost:3197"
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn token từ localStorage nếu có
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// (Tùy chọn) Xử lý lỗi toàn cục
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("401 Unauthorized - hãy kiểm tra đăng nhập");
    }
    return Promise.reject(error);
  }
);

export default http;
