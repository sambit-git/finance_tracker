import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import accountsReducer from "./slices/accountsSlice";
import transactionsReducer from "./slices/transactionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
    transactions: transactionsReducer,
  },
});
