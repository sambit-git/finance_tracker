import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccounts } from "../store/slices/accountsSlice";
import { setUser } from "../store/slices/authSlice";
import { fetchAccounts } from "../api/accountService";
import { fetchTransactions } from "../api/transactionServices";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal";
import { setTransactions } from "../store/slices/transactionsSlice";
import { AccountForm } from "./AccountForm";
import { TransactionList } from "./TransactionList";
// import { TransactionFilters } from "./transactions/TransactionFilters";
import { CreditCard, ArrowRightLeft, LogOut } from "lucide-react";

export function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { accounts } = useSelector((state) => state.accounts);
  const { transactions, filters } = useSelector((state) => state.transactions);
  const [showAccountForm, setShowAccountForm] = useState(false);

  const { isOpen, type, message, openModal, closeModal } = useModal();

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          openModal("loading", "Loading data..."); // Open modal with loading state

          const [userAccounts, userTransactions] = await Promise.all([
            fetchAccounts(),
            fetchTransactions(),
          ]);

          setShowAccountForm(!userAccounts.accounts);
          if (userAccounts.accounts)
            dispatch(setAccounts(userAccounts.accounts));

          dispatch(setTransactions(userTransactions));
          closeModal();
        } catch (error) {
          openModal("error", error.message);
        }
      })();
    }
  }, [user, dispatch]);

  // Filter transactions based on search, date range, and categories
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = filters.search
      ? transaction.title.toLowerCase().includes(filters.search.toLowerCase())
      : true;

    const matchesDateRange =
      filters.dateRange.start && filters.dateRange.end
        ? new Date(transaction.date) >= new Date(filters.dateRange.start) &&
          new Date(transaction.date) <= new Date(filters.dateRange.end)
        : true;

    const matchesCategories =
      filters.categories.length > 0
        ? filters.categories.includes(transaction.category)
        : true;

    return matchesSearch && matchesDateRange && matchesCategories;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold">
                Finance Tracker
              </span>
            </div>
            <button
              onClick={() => dispatch(setUser(null))}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAccountForm ? (
          <div className="max-w-md mx-auto">
            <AccountForm onAccountAdded={() => setShowAccountForm(false)} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {account.name}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                      {account.type}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{account.balance.toFixed(2)}
                  </p>
                </div>
              ))}
              <button
                onClick={() => setShowAccountForm(true)}
                className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <span className="flex items-center text-gray-600 hover:text-gray-900">
                  <ArrowRightLeft className="h-5 w-5 mr-2" />
                  Add New Account
                </span>
              </button>
            </div>

            {/* <TransactionFilters />*/}

            <TransactionList
              transactions={filteredTransactions}
              accounts={accounts}
            />
          </div>
        )}
      </main>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        message={message}
        type={type}
      />
    </div>
  );
}

export default Dashboard;
