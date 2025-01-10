// src/api/authService.js
import apiClient from "./apiClient";

export const fetchTransactions = async () => {
  try {
    const { data } = await apiClient.get("transactions/all");
    return data;
  } catch (error) {
    throw error;
  }
};

export const addTransaction = async (transactionData) => {
  try {
    const { data } = await apiClient.post(
      "transactions/create",
      transactionData
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateTransaction = async (id, transactionData) => {
  try {
    const { data } = await apiClient.patch(
      `transactions/update/${id}`,
      transactionData
    );
    return data;
  } catch (error) {
    throw error;
  }
};
