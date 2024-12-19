// src/components/Dashboard.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../api/transactionServices";
import { useErrorContext } from "../context/ErrorContext";
import TransactionsList from "../components/TransactionsList";
import CreateTransaction from "../components/CreateTransaction";
import { fetchAccounts } from "../api/accountService";
import { setAccounts } from "../store/accountSlice";
import { setTransactions } from "../store/transactionsSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { handleError } = useErrorContext();
  const user = useSelector((state) => state.auth.user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // fetchTransactions & Accounts
        const transactions = await fetchTransactions();
        dispatch(setTransactions(transactions));

        const accounts = await fetchAccounts();
        dispatch(setAccounts(accounts.accounts));
      } catch (error) {
        handleError(error.message);
      }
    };

    loadUserData();
  }, [dispatch, handleError]);

  const accounts = useSelector((store) => store.accounts.accounts);

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      <TransactionsList />
      <button
        onClick={openModal}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md fixed bottom-4 right-4"
      >
        +
      </button>

      <CreateTransaction
        isOpen={isModalOpen}
        closeModal={closeModal}
        accounts={accounts}
      />
    </div>
  );
};

export default Dashboard;
