import axios from "axios";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return "/api"; 
  }
  
  // Server-side: ensure we use an absolute URL. Ignore relative env vars like "/api"
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envUrl && envUrl.startsWith("http")) {
    return envUrl;
  }
  
  return "http://127.0.0.1:4006/api";
};

export const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  timeout: 30000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Check sessionStorage first, then fallback to localStorage keys
      const token =
        sessionStorage.getItem("laef_admin_token") ||
        localStorage.getItem("laef_admin_token") ||
        localStorage.getItem("token");

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expired or unauthorized - Logging out...");
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("laef_admin_token");
        sessionStorage.removeItem("laef_admin_user");
        localStorage.removeItem("laef_admin_token");
        localStorage.removeItem("laef_admin_user");
        localStorage.removeItem("token");
        
        // Force hard redirect so application state resets completely
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);