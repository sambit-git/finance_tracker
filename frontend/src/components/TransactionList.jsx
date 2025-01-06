import { useState } from "react";
import { Receipt, Calendar, Plus } from "lucide-react";
import { TransactionForm } from "./transactions/TransactionForm";
import { TransactionDetails } from "./transactions/TransactionDetails";
import { formatDate } from "../utils/dateUtils";

export function TransactionList({ transactions, accounts }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-1" />
          Add Transaction
        </button>
      </div>

      {(showForm || isEditing) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <TransactionForm
              onClose={() => {
                setShowForm(false);
                setIsEditing(false);
                setSelectedTransaction(null);
              }}
              transaction={isEditing ? selectedTransaction : undefined}
            />
          </div>
        </div>
      )}

      {selectedTransaction && !isEditing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <TransactionDetails
            transaction={selectedTransaction}
            accounts={accounts}
            onClose={() => setSelectedTransaction(null)}
            onEdit={() => handleEdit(selectedTransaction)}
          />
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {transactions.map((transaction) => {
            const paymentAccounts = transaction.payments
              .map(
                (payment) =>
                  accounts.find((a) => a.id === payment.account_id)?.name
              )
              .filter(Boolean);

            return (
              <li
                key={transaction.id}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedTransaction(transaction)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Receipt className="h-5 w-5 text-gray-400" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.title}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(transaction.timestamp)}
                      </div>
                      {paymentAccounts.length > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          Via: {paymentAccounts.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="px-2 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                      {transaction.category}
                    </span>
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        transaction.type === "credit"
                          ? "bg-green-100 text-green-800"
                          : transaction.type === "debit"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {transaction.type}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      ₹{Number(transaction.finalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
