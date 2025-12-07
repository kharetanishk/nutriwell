"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  phone: string;
  role?: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  loggingOut: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  loggingOut: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // ---------------- LOGIN ----------------
  const login = (user: User) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    toast.success("Logged in");
  };

  // ---------------- LOGOUT ----------------
  const logout = useCallback(async () => {
    setLoggingOut(true);

    // Small delay for animation
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }

    // Clear all auth-related localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("login_otp_expiry");
    localStorage.removeItem("bookingForm");

    setUser(null);

    // Show success toast
    toast.success("Logged out successfully", {
      icon: "👋",
      duration: 2000,
    });

    // Reset logging out state after animation
    setTimeout(() => {
      setLoggingOut(false);
    }, 500);
  }, []);

  // ---------------- FETCH USER FROM /me ----------------
  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get<{ success: boolean; user: User }>("/auth/me");
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        // If API returns success:false, clear user state
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const errorMessage = err?.response?.data?.message || err?.message;

      // Handle 401 specifically - user is not authenticated
      if (status === 401) {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
        if (process.env.NODE_ENV === "development") {
          console.log("[Auth] User not authenticated (401)");
        }
      } else if (status === 400) {
        // Handle 400 - Bad request (invalid token, invalid role, etc.)
        console.error("[Auth] Bad request (400):", errorMessage);
        // Clear potentially invalid auth data
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
      } else {
        // For other errors (404, 500, etc.), try to use stored user as fallback
        if (process.env.NODE_ENV === "development") {
          console.error("[Auth] Failed to fetch user:", {
            status,
            message: errorMessage,
            error: err,
          });
        }
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            // Invalid stored user, clear it
            localStorage.removeItem("user");
          }
        } else {
          // No stored user, clear auth state
          setUser(null);
          localStorage.removeItem("auth_token");
        }
      }
    }
  }, []);

  // ---------------- INITIAL APP HYDRATION ----------------
  useEffect(() => {
    const loadAuth = async () => {
      try {
        // First, try to fetch from backend
        await fetchUser();
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("[Auth] Load error:", err);
        }
      }
      setLoading(false);
    };

    loadAuth();

    // Listen for logout events from Axios interceptor
    const handleLogout = () => {
      setUser(null);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth:logout", handleLogout);
      return () => {
        window.removeEventListener("auth:logout", handleLogout);
      };
    }
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loggingOut,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
