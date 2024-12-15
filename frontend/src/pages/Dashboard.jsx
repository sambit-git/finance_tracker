// src/components/Dashboard.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../api/transactionServices";
import { useErrorContext } from "../context/ErrorContext";
import TransactionsList from "../components/TransactionsList";
import CreateTransaction from "../components/CreateTransaction";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { handleError } = useErrorContext();
  const user = useSelector((state) => state.auth.user);

  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const transactions = await fetchTransactions();
        console.log(transactions);
        setTransactions(transactions);
      } catch (error) {
        handleError("Failed to fetch user profile");
      }
    };

    loadUserProfile();
  }, [dispatch, handleError]);

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
        <TransactionsList transactions={transactions} />
      <button
        onClick={openModal}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md absolute bottom-4 right-4"
      >
        +
      </button>

      <CreateTransaction isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default Dashboard;
