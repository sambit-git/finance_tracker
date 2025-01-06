// src/api/authService.js
import apiClient from "./apiClient";

export const login = async (credentials) => {
  try {
    const { data } = await apiClient.post("auth/login", credentials);
    return data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const { data } = await apiClient.post("auth/register", userData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchUserProfile = async () => {
  try {
    const { data } = await apiClient.get("auth/me");
    return data;
  } catch (error) {
    return error.response.data.error;
  }
};
