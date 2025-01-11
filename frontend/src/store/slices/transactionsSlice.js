// src/store/transactionsSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Helper function to group transactions by date and calculate totals
const groupTransactionsByDate = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Initialize the group if it doesn't exist
    if (!groups[date]) {
      groups[date] = {
        transactions: [], // Store the transactions in this group
        totalCredit: 0, // Initialize total credit for the day
        totalDebit: 0, // Initialize total debit for the day
      };
    }

    // Add the transaction to the group
    groups[date].transactions.push(transaction);

    // Update the totalCredit or totalDebit based on transaction type
    if (transaction.totalAmount) {
      const amount = parseFloat(transaction.totalAmount);
      if (transaction.type === "credit") {
        groups[date].totalCredit += amount;
      } else if (transaction.type === "debit") {
        groups[date].totalDebit += amount;
      }
    }

    return groups;
  }, {});
};

const initialState = {
  transactions: [], // Raw transactions
  groupedTransactions: {}, // Transactions grouped by date
  filters: {
    search: "",
    dateRange: {
      start: null,
      end: null,
    },
    categories: [],
  },
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions(state, action) {
      state.transactions = action.payload;
      state.groupedTransactions = groupTransactionsByDate(action.payload);
    },
    addTransaction(state, action) {
      state.transactions.unshift(action.payload);
      state.transactions.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      state.groupedTransactions = groupTransactionsByDate(state.transactions);
    },
    updateTransaction(state, action) {
      const index = state.transactions.findIndex(
        (transaction) => transaction.id === action.payload.id
      );
      if (index !== -1) {
        state.transactions[index] = action.payload;
        state.transactions.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        state.groupedTransactions = groupTransactionsByDate(state.transactions);
      }
    },
    deleteTransaction(state, action) {
      state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== action.payload
      );
      state.groupedTransactions = groupTransactionsByDate(state.transactions);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const {
  setTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setFilters,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
