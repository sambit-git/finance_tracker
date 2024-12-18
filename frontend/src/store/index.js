// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import accountsSlice from "./accountSlice";
import transactionsSlice from "./transactionsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsSlice,
    transactions: transactionsSlice,
  },
});

export default store;
