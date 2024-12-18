import apiClient from "./apiClient";

export const fetchAccounts = async () => {
  try {
    const { data } = await apiClient.get("accounts/all");
    return data;
  } catch (error) {
    console.log(error);
    return error.response.data.error;
  }
};
