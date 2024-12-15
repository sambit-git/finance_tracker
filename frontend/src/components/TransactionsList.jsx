import { useState } from "react";

const TransactionsList = ({ transactions }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [expandedDate, setExpandedDate] = useState(null);

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleDate = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  // Calculate total amount for each date
  const totalsByDate = Object.keys(groupedTransactions).reduce((totals, date) => {
    totals[date] = groupedTransactions[date].reduce((sum, transaction) => sum + parseFloat(transaction.finalAmount), 0);
    return totals;
  }, {});

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto"> {/* Removed any sidebar styling */}
      {Object.keys(groupedTransactions).map((date) => (
        <div key={date} className="mb-6">
          {/* Date Header with Total Expense */}
          <div
            onClick={() => toggleDate(date)}
            className="flex justify-between items-center bg-gray-200 p-4 rounded-md shadow cursor-pointer hover:bg-gray-300 transition"
          >
            <h3 className="font-bold text-gray-700">{date.substring(0, 6)}</h3>
            <p className="font-semibold text-lg text-gray-800">₹{totalsByDate[date]}</p>
          </div>

          {/* Transactions for the Date */}
          {expandedDate === date && (
            <div className="mt-4 space-y-4 pl-6 border-l-4 border-gray-300">
              {groupedTransactions[date].map((transaction) => (
                <div
                  key={transaction.id}
                  onClick={() => toggleDetails(transaction.id)}
                  className="bg-gray-50 shadow rounded-lg p-4 cursor-pointer transition transform hover:scale-105 hover:shadow-md border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">{transaction.title}</h2>
                      <p className="text-gray-500 text-sm">
                        {new Date(transaction.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₹{transaction.finalAmount}</p>
                      <p
                        className={`text-sm font-medium ${
                          transaction.status === "Completed"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                  {expandedId === transaction.id && (
                    <div className="mt-4 space-y-4">
                      {/* Items Section */}
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {transaction.items.map((item) => (
                            <div
                              key={item.id}
                              className="bg-white border rounded-lg shadow-sm p-3 flex justify-between items-center"
                            >
                              <div>
                                <p className="font-semibold text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-600">
                                  {item.quantity} {item.unit}
                                </p>
                              </div>
                              <p
                                className={`text-lg font-bold ${
                                  item.type === "credit"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                ₹{item.finalAmount}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payments Section */}
                      <div>
                        <p className="font-semibold text-gray-700 mb-2">Payments:</p>
                        <ul className="ml-4 list-disc text-sm text-gray-600">
                          {transaction.payments.map((payment) => (
                            <li key={payment.id}>
                              ₹{payment.amount} - {payment.type} via {payment.paymentMethod || "N/A"}
                              {payment.app && ` (${payment.app})`}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Notes Section */}
                      {transaction.notes && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Notes:</span> {transaction.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TransactionsList;
