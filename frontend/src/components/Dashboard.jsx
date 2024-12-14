// src/components/Dashboard.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../api/transactionServices";
import { useErrorContext } from "../context/ErrorContext";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { handleError } = useErrorContext();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const transactions = await fetchTransactions();
        console.log(transactions);
      } catch (error) {
        handleError("Failed to fetch user profile");
      }
    };

    loadUserProfile();
  }, [dispatch, handleError]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome, {user ? user.name : "Guest"}
      </h1>
      <p className="mt-4 text-gray-700">
        Here is your dashboard with all the insights you need.
      </p>
      {/* You can add more dashboard content here */}
    </div>
  );
};

export default Dashboard;
