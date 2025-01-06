import React from "react";
import { formatDate } from "../../utils/dateUtils";
import { Receipt, CreditCard, Package } from "lucide-react";

export function TransactionDetails({ transaction, accounts, onClose, onEdit }) {
  return (
    <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Receipt className="h-6 w-6 mr-2" />
          {transaction.title}
        </h2>
        <div className="space-x-2">
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Edit
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Transaction Details</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-500">Date</dt>
                <dd className="font-medium">
                  {formatDate(transaction.timestamp)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Category</dt>
                <dd className="font-medium">{transaction.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Type</dt>
                <dd className="font-medium">{transaction.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd className="font-medium">{transaction.status}</dd>
              </div>
              {transaction.tax > 0 && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Tax</dt>
                  <dd className="font-medium">
                    ₹{Number(transaction.tax).toFixed(2)}
                  </dd>
                </div>
              )}
              {transaction.tip > 0 && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Tip</dt>
                  <dd className="font-medium">
                    ₹{Number(transaction.tip).toFixed(2)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <dt className="text-gray-900 font-medium">Total Amount</dt>
                <dd className="text-lg font-bold">
                  ₹{Number(transaction.finalAmount).toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payments
            </h3>
            <div className="space-y-3">
              {transaction.payments.map((payment) => {
                const account = accounts.find(
                  (a) => a.id === payment.account_id
                );
                return (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center p-2 bg-white rounded"
                  >
                    <span className="text-gray-900">
                      {account?.name || "Unknown Account"}
                    </span>
                    <span className="font-medium">
                      ₹{Number(payment.amount).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Items
          </h3>
          <div className="space-y-3">
            {transaction.items.map((item) => (
              <div key={item.id} className="bg-white p-3 rounded">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-600">
                    {item.quantity} {item.unit} × ₹{Number(item.mrp).toFixed(2)}
                  </span>
                </div>
                {item.discountPercent > 0 && (
                  <div className="text-sm text-gray-500">
                    Discount: {item.discountPercent}%
                  </div>
                )}
                <div className="text-right font-medium mt-1">
                  ₹{Number(item.finalAmount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
