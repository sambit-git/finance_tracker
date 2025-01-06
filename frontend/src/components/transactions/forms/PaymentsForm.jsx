import { useState } from "react";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";

const PaymentsForm = ({ payments, setPayments, handleChange }) => {
  const { accounts } = useSelector((state) => state.accounts);

  const handleAddPayment = () => {
    setPayments([
      ...payments,
      { account_id: "", amount: 0, paymentMethod: "upi", app: "SamsungPay" },
    ]);
  };

  return (
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
        <div key={index} className="form-section">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account
            </label>
            <select
              required
              value={payment.account_id}
              onChange={(e) => handleChange(e, "account_id", index, "payment")}
              className="input-secondary"
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
              onChange={(e) =>
                handleChange(e, "amount", index, "payment", Number)
              }
              className="input-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              required
              value={payment.paymentMethod}
              onChange={(e) =>
                handleChange(e, "paymentMethod", index, "payment")
              }
              className="input-secondary"
            >
              <option value="upi">UPI</option>
              <option value="debit card">Debit Card</option>
              <option value="Internet Banking">Internet Banking</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Medium
            </label>
            <select
              required
              value={payment.app}
              onChange={(e) => handleChange(e, "app", index, "payment")}
              className="input-secondary"
            >
              <option value="SamsungPay">SamsungPay</option>
              <option value="PhonePe">PhonePe</option>
              <option value="GooglePay">GooglePay</option>
              <option value="PayTm">PayTm</option>
              <option value="BanksApp">Bank's Mobile App</option>
              <option value="Internet Banking">Internet Banking</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentsForm;
