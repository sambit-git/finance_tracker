// src/api/authService.js
import apiClient from "./apiClient";

export const login = async (credentials) => {
  try {
    const { data } = await apiClient.post("auth/login", credentials);
    return data;
  } catch (error) {
    throw error; // propagate error to be handled globally
  }
};

export const fetchUserProfile = async () => {
  try {
    const { data } = await apiClient.get("/profile");
    return data;
  } catch (error) {
    throw error;
  }
};
