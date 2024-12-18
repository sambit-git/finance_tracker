import React, { useState } from "react";

const CreateTransaction = ({ isOpen, closeModal, accounts }) => {
  const [transactionData, setTransactionData] = useState({
    title: "",
    items: [{ name: "", quantity: 1, unit: "", finalAmount: 0 }],
    payments: [
      { accountId: "", amount: 0, paymentMethod: "", app: "", type: "" },
    ],
    type: "debit",
  });

  const handleChange = (e, field, index, type) => {
    const value = e.target.value;
    setTransactionData((prevData) => {
      const newData = { ...prevData };
      if (type === "item") {
        newData.items[index][field] = value;
      } else if (type === "payment") {
        newData.payments[index][field] = value;
      } else {
        newData[field] = value;
      }
      return newData;
    });
  };

  const handleAddItem = () => {
    setTransactionData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        { name: "", quantity: 1, unit: "", finalAmount: 0 },
      ],
    }));
  };

  const handleAddPayment = () => {
    setTransactionData((prevData) => ({
      ...prevData,
      payments: [
        ...prevData.payments,
        { accountId: "", amount: 0, paymentMethod: "", app: "", type: "" },
      ],
    }));
  };

  const handleDeleteItem = (index) => {
    const updatedItems = transactionData.items.filter((_, i) => i !== index);
    setTransactionData((prevData) => ({ ...prevData, items: updatedItems }));
  };

  const handleDeletePayment = (index) => {
    const updatedPayments = transactionData.payments.filter(
      (_, i) => i !== index
    );
    setTransactionData((prevData) => ({
      ...prevData,
      payments: updatedPayments,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Transaction Data:", transactionData);
    closeModal();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[80vh]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Create Transaction
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-800 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Transaction Title
              </label>
              <input
                type="text"
                id="title"
                value={transactionData.title}
                onChange={(e) => handleChange(e, "title")}
                className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Transaction Type: Credit/Debit */}
            <div className="mt-4">
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="debit"
                    checked={transactionData.type === "debit"}
                    onChange={(e) => handleChange(e, "type")}
                    className="hidden"
                  />
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full border-2 cursor-pointer ${
                      transactionData.type === "debit"
                        ? "border-red-600"
                        : "border-gray-300"
                    }`}
                  >
                    {transactionData.type === "debit" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="ml-2 text-sm text-red-600">Debit</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="credit"
                    checked={transactionData.type === "credit"}
                    onChange={(e) => handleChange(e, "type")}
                    className="hidden"
                  />
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full border-2 cursor-pointer ${
                      transactionData.type === "credit"
                        ? "border-green-600"
                        : "border-gray-300"
                    }`}
                  >
                    {transactionData.type === "credit" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="ml-2 text-sm text-green-600">Credit</span>
                </label>
              </div>
            </div>

            {/* Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Items
              </label>
              {transactionData.items.map((item, index) => (
                <div
                  key={index}
                  className="mt-4 bg-gray-100 p-4 rounded-md relative"
                >
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="gray"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleChange(e, "name", index, "item")}
                      className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleChange(e, "quantity", index, "item")
                        }
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Unit
                      </label>
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleChange(e, "unit", index, "item")}
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={item.finalAmount}
                        onChange={(e) =>
                          handleChange(e, "finalAmount", index, "item")
                        }
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="w-full mt-4 text-sm text-indigo-600 bg-indigo-100 p-3 rounded-md"
              >
                Add Item
              </button>
            </div>

            {/* Payments */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payments
              </label>
              {transactionData.payments.map((payment, index) => (
                <div
                  key={index}
                  className="mt-4 bg-gray-100 p-4 rounded-md relative"
                >
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={() => handleDeletePayment(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="gray"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Account Select */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Account
                      </label>
                      <select
                        value={payment.accountId}
                        onChange={(e) =>
                          handleChange(e, "accountId", index, "payment")
                        }
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select Account</option>
                        {accounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.name} (₹{account.balance})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={payment.amount}
                        onChange={(e) =>
                          handleChange(e, "amount", index, "payment")
                        }
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Payment Method
                      </label>
                      <select
                        value={payment.paymentMethod}
                        onChange={(e) =>
                          handleChange(e, "paymentMethod", index, "payment")
                        }
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                      >
                        <option value="upi">UPI</option>
                        <option value="cash">Cash</option>
                        <option value="debit card">Debit Card</option>
                        <option value="net banking">Net Banking</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        App
                      </label>
                      <select
                        value={payment.app}
                        onChange={(e) =>
                          handleChange(e, "app", index, "payment")
                        }
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                      >
                        <option value="">Select Payment App</option>
                        <option value="PhonePe">Phone Pe</option>
                        <option value="GooglePay">Google Pay</option>
                        <option value="SamsungPay">Samsung Pay</option>
                        <option value="BankingSite">banking site</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddPayment}
                className="w-full mt-4 text-sm text-indigo-600 bg-indigo-100 p-3 rounded-md"
              >
                Add Payment
              </button>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700"
              >
                Create Transaction
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default CreateTransaction;
