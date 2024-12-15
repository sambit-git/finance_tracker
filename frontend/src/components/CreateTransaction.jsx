import React, { useState } from 'react';

const CreateTransaction = ({ isOpen, closeModal }) => {
  const [transactionData, setTransactionData] = useState({
    title: '',
    items: [{ name: '', quantity: 1, unit: '', finalAmount: 0 }],
    payments: [{ amount: 0, paymentMethod: '', app: '', type: '' }],
  });

  const handleChange = (e, field, index, type) => {
    const value = e.target.value;
    setTransactionData((prevData) => {
      const newData = { ...prevData };
      if (type === 'item') {
        newData.items[index][field] = value;
      } else if (type === 'payment') {
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
      items: [...prevData.items, { name: '', quantity: 1, unit: '', finalAmount: 0 }],
    }));
  };

  const handleAddPayment = () => {
    setTransactionData((prevData) => ({
      ...prevData,
      payments: [...prevData.payments, { amount: 0, paymentMethod: '', app: '', type: '' }],
    }));
  };

  const handleDeleteItem = (index) => {
    const updatedItems = transactionData.items.filter((_, i) => i !== index);
    setTransactionData((prevData) => ({ ...prevData, items: updatedItems }));
  };

  const handleDeletePayment = (index) => {
    const updatedPayments = transactionData.payments.filter((_, i) => i !== index);
    setTransactionData((prevData) => ({ ...prevData, payments: updatedPayments }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the transaction data here
    console.log('Transaction Data:', transactionData);
    closeModal(); // Close modal after submission
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[80vh]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Create Transaction</h2>
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
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Transaction Title
              </label>
              <input
                type="text"
                id="title"
                value={transactionData.title}
                onChange={(e) => handleChange(e, 'title')}
                className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Items</label>
              {transactionData.items.map((item, index) => (
                <div key={index} className="mt-4 bg-gray-100 p-4 rounded-md relative">
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
                    <label className="block text-sm font-medium text-gray-700">Item Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleChange(e, 'name', index, 'item')}
                      className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleChange(e, 'quantity', index, 'item')}
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Unit</label>
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleChange(e, 'unit', index, 'item')}
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount</label>
                      <input
                        type="number"
                        value={item.finalAmount}
                        onChange={(e) => handleChange(e, 'finalAmount', index, 'item')}
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
              <label className="block text-sm font-medium text-gray-700">Payments</label>
              {transactionData.payments.map((payment, index) => (
                <div key={index} className="mt-4 bg-gray-100 p-4 rounded-md relative">
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
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount</label>
                      <input
                        type="number"
                        value={payment.amount}
                        onChange={(e) => handleChange(e, 'amount', index, 'payment')}
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                      <input
                        type="text"
                        value={payment.paymentMethod}
                        onChange={(e) => handleChange(e, 'paymentMethod', index, 'payment')}
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">App</label>
                      <input
                        type="text"
                        value={payment.app}
                        onChange={(e) => handleChange(e, 'app', index, 'payment')}
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                      <input
                        type="text"
                        value={payment.type}
                        onChange={(e) => handleChange(e, 'type', index, 'payment')}
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                      />
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
