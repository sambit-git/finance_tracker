import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTransaction,
  updateTransaction,
} from "../../store/slices/transactionsSlice";
import { updateAccountBalance } from "../../store/slices/accountsSlice";
import { Plus, Minus, DollarSign } from "lucide-react";

const CATEGORIES = [
  "FOOD",
  "TRANSPORT",
  "SHOPPING",
  "ENTERTAINMENT",
  "BILLS",
  "HEALTH",
  "EDUCATION",
  "OTHER",
];

export function TransactionForm({ onClose, editTransaction }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { accounts } = useSelector((state) => state.accounts);

  console.log(editTransaction);

  const [title, setTitle] = useState(editTransaction?.title || "");
  const [type, setType] = useState(editTransaction?.type || "EXPENSE");
  const [category, setCategory] = useState(
    editTransaction?.category || "OTHER"
  );
  const [date, setDate] = useState(
    editTransaction?.timestamp.split("T")[0] ||
      new Date().toISOString().split("T")[0]
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tax, setTax] = useState(editTransaction?.tax || "");
  const [tip, setTip] = useState(editTransaction?.tip || "");

  const [items, setItems] = useState(editTransaction?.items || []);
  const [payments, setPayments] = useState(
    editTransaction?.payments || [{ accountId: "", amount: 0 }]
  );

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        name: "",
        quantity: 1,
        unit: "pcs",
        mrp: 0,
        discountPercentage: 0,
        taxPercent: 0,
      },
    ]);
  };

  const handleAddPayment = () => {
    setPayments([...payments, { accountId: "", amount: 0 }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return;

    const totalAmount = items.reduce((sum, item) => {
      const amount = (item.mrp || 0) * (item.quantity || 1);
      const discount = amount * ((item.discountPercentage || 0) / 100);
      return sum + amount - discount;
    }, 0);

    const finalAmount = totalAmount + Number(tax || 0) + Number(tip || 0);

    const newTransaction = {
      id: crypto.randomUUID(),
      userId: user.id,
      title,
      type,
      category,
      date,
      totalAmount,
      tax: Number(tax) || 0,
      tip: Number(tip) || 0,
      discountPercentage: 0,
      couponDiscount: 0,
      finalAmount,
      timestamp: new Date().toISOString(),
      status: "COMPLETED",
      shipping: 0,
      orderNumber: crypto.randomUUID().split("-")[0],
      items: items.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
        transactionId: "",
        finalAmount:
          (item.mrp || 0) *
          (item.quantity || 1) *
          (1 - (item.discountPercentage || 0) / 100),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      payments: payments.map((payment) => ({
        ...payment,
        id: crypto.randomUUID(),
        paymentMethod: "DIRECT",
        app: "SYSTEM",
        status: "COMPLETED",
        balance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addTransaction(newTransaction));

    // Update account balances
    payments.forEach((payment) => {
      if (payment.accountId && payment.amount) {
        dispatch(
          updateAccountBalance({
            id: payment.accountId,
            amount: type === "INCOME" ? payment.amount : -payment.amount,
          })
        );
      }
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
            <option value="TRANSFER">Transfer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Items</h3>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </button>
        </div>

        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-md"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={item.name || ""}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index] = { ...item, name: e.target.value };
                  setItems(newItems);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                value={item.quantity || ""}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index] = {
                    ...item,
                    quantity: Number(e.target.value),
                  };
                  setItems(newItems);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unit Price
              </label>
              <input
                type="number"
                step="0.01"
                value={item.mrp || ""}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index] = { ...item, mrp: Number(e.target.value) };
                  setItems(newItems);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discount %
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={item.discountPercentage || ""}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index] = {
                    ...item,
                    discountPercentage: Number(e.target.value),
                  };
                  setItems(newItems);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Payments</h3>
          <button
            type="button"
            onClick={handleAddPayment}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Payment
          </button>
        </div>

        {payments.map((payment, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account
              </label>
              <select
                required
                value={payment.accountId}
                onChange={(e) => {
                  const newPayments = [...payments];
                  newPayments[index] = {
                    ...payment,
                    accountId: e.target.value,
                  };
                  setPayments(newPayments);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select an account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} (₹{Number(account.balance).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={payment.amount || ""}
                onChange={(e) => {
                  const newPayments = [...payments];
                  newPayments[index] = {
                    ...payment,
                    amount: Number(e.target.value),
                  };
                  setPayments(newPayments);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        ))}
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {showAdvanced ? (
            <Minus className="inline h-4 w-4 mr-1" />
          ) : (
            <Plus className="inline h-4 w-4 mr-1" />
          )}
          {showAdvanced ? "Hide" : "Show"} Additional Fields
        </button>

        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tip
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={tip}
                  onChange={(e) => setTip(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Save Transaction
        </button>
      </div>
    </form>
  );
}
