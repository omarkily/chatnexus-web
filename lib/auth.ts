import axios from "axios";
import Cookies from "js-cookie";

export interface LoginPayload {
  email: string;
  password: string;
  expire?: number;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Authentication API client
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set token in cookies and localStorage
export const setToken = (token: string, remember: boolean = false) => {
  const expiryDays = remember ? 14 : 1; // 14 days if remember is true, otherwise 1 day
  Cookies.set("token", token, {
    expires: expiryDays,
    path: "/",
  });
  localStorage.setItem("token", token);
};

// Get token from localStorage or cookies
export const getToken = (): string | undefined => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      return token;
    }
  }
  return Cookies.get("token");
};

// Remove token from cookies
export const removeToken = () => {
  Cookies.remove("token", { path: "/" });
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Login user
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await authApi.post("/api/auth/login", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = () => {
  removeToken();
};

// Add authorization header to requests if token exists
authApi.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default authApi;
