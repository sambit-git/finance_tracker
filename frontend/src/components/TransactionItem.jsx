import { useState } from "react";

const TransactionItem = ({ transaction }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div
      onClick={() => toggleDetails(transaction.id)}
      className="bg-gray-50 shadow rounded-lg p-4 cursor-pointer transition transform hover:scale-105 hover:shadow-md border border-gray-200"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {transaction.title}
          </h2>
          <p className="text-gray-500 text-sm">
            {new Date(transaction.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="text-right">
          <p
            className={`text-lg font-bold ${
              transaction.type == "debit" ? "text-red-400" : "text-green-700"
            }`}
          >
            ₹{Intl.NumberFormat("en-IN").format(transaction.finalAmount)}
          </p>
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
                      item.type === "credit" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    ₹{Intl.NumberFormat("en-IN").format(item.finalAmount)}
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
                  ₹{Intl.NumberFormat("en-IN").format(payment.amount)} -{" "}
                  {payment.type} via {payment.paymentMethod || "N/A"}
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
  );
};

export default TransactionItem;
