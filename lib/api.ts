import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - authentication handled via httpOnly cookies
// No need to add Authorization header from localStorage (XSS risk)
// Cookies are automatically sent with requests via withCredentials: true
api.interceptors.request.use(
  (config) => {
    // Authentication is handled via httpOnly cookies
    // Tokens are NOT stored in localStorage to prevent XSS attacks
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Only log errors that aren't expected (like 401, 400 with validation errors)
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;
      const url = error.config?.url || "";

      // Handle 401 Unauthorized - clear auth state
      if (status === 401) {
        // Don't clear on /auth/me or /auth/logout to avoid loops
        if (!url.includes("/auth/me") && !url.includes("/auth/logout")) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("user");
            // Note: auth_token is not stored in localStorage (uses httpOnly cookies)
            // Dispatch custom event for AuthContext to listen to
            window.dispatchEvent(new CustomEvent("auth:logout"));
          }
        }
        // Don't log 401 errors - they're expected
        return Promise.reject(error);
      }

      // Don't log validation errors or expected errors
      // Suppress errors for auth endpoints with 400 status (likely validation errors)
      if (status === 400) {
        // Check if it's an auth endpoint - these are often validation errors
        if (url.includes("/auth/") && (data?.errors || data?.message)) {
          // Validation error on auth endpoint - expected, don't log to console
          return Promise.reject(error);
        }
        if (data?.errors) {
          // Validation error - expected, don't log
          return Promise.reject(error);
        }
      }

      // Log unexpected errors
      if (status >= 500) {
        console.error("Server error:", error);
      }
    } else if (error.request) {
      // Request was made but no response received
      // Only log if it's not a network error (which might be expected)
      if (error.message && !error.message.includes("Network Error")) {
        console.error("Network error:", error.message);
      }
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
