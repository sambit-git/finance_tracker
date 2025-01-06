import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accounts: [],
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    setAccounts: (state, action) => {
      state.accounts = action.payload;
    },
    addAccount: (state, action) => {
      state.accounts.push(action.payload);
    },
    updateAccountBalanceFromPayments: (state, action) => {
      const payments = action.payload.payments;
      const transactionType = action.payload.transactionType;
      payments.forEach((payment) => {
        const account = state.accounts.find(
          (acc) => acc.id === payment.account_id
        );
        if (account) {
          if (transactionType === "debit")
            account.balance -= Number(payment.amount);
          else if (transactionType === "credit")
            account.balance += Number(payment.amount);
        }
      });
    },
  },
});

export const { setAccounts, addAccount, updateAccountBalanceFromPayments } =
  accountsSlice.actions;
export default accountsSlice.reducer;
