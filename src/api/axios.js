import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3197";

const http = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST =================
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    // FIX FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ================= RESPONSE =================
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "Something went wrong";

    const isLoginPage = window.location.pathname.includes("/login");

    // ================= 401 =================
    if (status === 401) {
      // Login sai password
      if (isLoginPage) {
        toast.error(message, {
          toastId: "login-error",
        });
        return Promise.reject(error);
      }

      // Token hết hạn
      toast.error("Session expired. Please login again.", {
        toastId: "session-expired",
      });

      localStorage.removeItem("token");
      sessionStorage.clear();

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);

      return Promise.reject(error);
    }

    // ================= OTHER ERROR =================
    toast.error(message, {
      toastId: "global-error",
    });

    return Promise.reject(error);
  },
);

export default http;
