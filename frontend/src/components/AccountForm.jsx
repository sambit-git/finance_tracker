import { useRef, useState } from "react";
import { PlusCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

export function AccountForm({ onAccountAdded }) {
  const { user } = useSelector((state) => state.accounts);
  const nameInputRef = useRef();
  const typeInputRef = useRef();
  const balanceInputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return;

    const newAccount = {
      name: nameInputRef.current.value,
      type: typeInputRef.current.value,
      balance: parseFloat(balanceInputRef.current.value),
    };

    const { accounts } = useSelector((state) => state.accounts);
    storage.setAccounts([...accounts, newAccount]);

    nameInputRef.current.value = "";
    typeInputRef.current.value = "SAVINGS";
    balanceInputRef.current.value = "";
    onAccountAdded();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="h-5 w-5 text-indigo-600" />
        <h2 className="text-xl font-semibold">Add New Account</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Account Name
          </label>
          <input
            id="name"
            type="text"
            required
            ref={nameInputRef}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Account Type
          </label>
          <select
            id="type"
            ref={typeInputRef}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="SAVINGS">Savings</option>
            <option value="CHECKING">Checking</option>
            <option value="CREDIT">Credit</option>
            <option value="INVESTMENT">Investment</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="balance"
            className="block text-sm font-medium text-gray-700"
          >
            Initial Balance
          </label>
          <input
            id="balance"
            type="number"
            step="0.01"
            required
            ref={balanceInputRef}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Account
        </button>
      </form>
    </div>
  );
}
