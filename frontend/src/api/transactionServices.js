// src/api/authService.js
import apiClient from "./apiClient";

export const fetchTransactions = async () => {
  try {
    const { data } = await apiClient.get("transactions/all");
    return data;
  } catch (error) {
    throw error; // propagate error to be handled globally
  }
};
