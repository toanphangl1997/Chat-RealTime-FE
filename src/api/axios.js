// src/utils/axios.js
import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3197", // hoặc dùng process.env.REACT_APP_API_URL
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
