import { useRef, useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import ItemsForm from "./forms/ItemsForm";
import PaymentsForm from "./forms/PaymentsForm";
import TransactionAdvanceFields from "./forms/TransactionAdvanceFields";
import Modal from "../Modal";
import { useModal } from "../../hooks/useModal";
import { toLocalDatetimeInput } from "../../utils/dateUtils";
import {
  addTransaction,
  updateTransaction,
} from "../../api/transactionServices";
import {
  addTransaction as addTransactionToStore,
  updateTransaction as updateTransactionToStore,
} from "../../store/slices/transactionsSlice";
import { updateAccountBalanceFromPayments } from "../../store/slices/accountsSlice";

export function TransactionForm({ onClose, transaction }) {
  const dispatch = useDispatch();
  const {
    title,
    type,
    timestamp,
    items: transactionItems,
    payments: transactionPayments,
  } = transaction || {};

  const titleInputRef = useRef({ value: title || "" });
  const typeInputRef = useRef({ value: type || "debit" });
  const dateInputRef = useRef({
    value: toLocalDatetimeInput(timestamp || new Date().toISOString()),
  });

  const [items, setItems] = useState(transactionItems || []);
  const [payments, setPayments] = useState(
    transactionPayments || [
      { account_id: "", amount: 0, paymentMethod: "upi", app: "SamsungPay" },
    ]
  );

  let totalAmount = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + Number(item.finalAmount) || 0;
    }, 0);
  }, [items]);

  useEffect(() => {
    if (items.length > 0)
      setPayments((prevPayments) => {
        return prevPayments.map((payment, index) =>
          index === 0 ? { ...payment, amount: totalAmount } : payment
        );
      });
  }, [items, totalAmount, setPayments]);

  const {
    isOpen,
    type: ModalType,
    message,
    openModal,
    closeModal,
  } = useModal();

  const handleChange = (e, field, index, type, dataTypeFn) => {
    const value = dataTypeFn ? dataTypeFn(e.target.value) : e.target.value;
    if (type === "item") {
      // if( field == "mrp")
      setItems((prevData) => {
        const newData = prevData.map((item, i) => {
          if (i === index) {
            const updatedItem = { ...item, [field]: value };

            // Order of Priority:
            // If the user updates mrp or quantity, calculate finalAmount.
            // If the user updates discountPercent, adjust finalAmount.
            // If the user updates finalAmount, calculate mrp.
            // Extract current values
            const quantity = updatedItem.quantity || 1; // Default quantity to 1 if not specified
            const mrp = parseFloat(updatedItem.mrp) || 0;
            const discountPercent =
              parseFloat(updatedItem.discountPercent) || 0;
            const finalAmount = parseFloat(updatedItem.finalAmount) || 0;

            // Handle updates based on field
            if (field === "mrp" || field === "quantity") {
              const baseAmount = (quantity * mrp * 100) / 100;
              updatedItem.finalAmount =
                discountPercent > 0
                  ? baseAmount - (baseAmount * discountPercent) / 100
                  : baseAmount;
            } else if (field === "discountPercent") {
              const baseAmount = quantity * mrp;
              updatedItem.finalAmount =
                discountPercent > 0
                  ? baseAmount - (baseAmount * value) / 100
                  : baseAmount;
            } else if (field === "finalAmount") {
              const baseAmount = value / (1 - discountPercent / 100 || 1);
              updatedItem.mrp = baseAmount / quantity;
            }

            return updatedItem;
          } else {
            return item;
          }
        });
        return newData;
      });
    } else if (type === "payment") {
      setPayments((prevData) => {
        const newData = prevData.map((payment, i) =>
          i === index ? { ...payment, [field]: value } : payment
        );
        return newData;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    openModal("loading", "Saving the transaction..."); // Open modal with loading state

    if (items.length == 0)
      totalAmount = payments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0
      );

    const finalAmount = totalAmount;
    // +
    // Number(taxInputRef.current.value || 0) +
    // Number(tipInputRef.current.value || 0);

    const newTransaction = {
      title: titleInputRef.current.value,
      type: typeInputRef.current.value,
      timestamp: new Date(dateInputRef.current.value || null).toISOString(),
      discountPercentage: 0,
      couponCode: "",
      couponDiscount: 0,
      shipping: undefined,
      status: "Completed",
      orderNumber: undefined,
      notes: undefined,
      recipt: undefined,
      totalAmount,
      // tax: Number(taxInputRef.current.value) || 0,
      // tip: Number(tipInputRef.current.value) || 0,
      finalAmount,
      items,
      payments,
    };

    try {
      let res;
      // console.log(newTransaction);
      if (transaction) {
        res = await updateTransaction(transaction.id, newTransaction);
        dispatch(updateTransactionToStore(res.transaction));
      } else {
        res = await addTransaction(newTransaction);
        dispatch(addTransactionToStore(res.transaction));
      }
      dispatch(
        updateAccountBalanceFromPayments({
          transactionType: res.transaction.type,
          payments: res.transaction.payments,
        })
      );
    } catch (error) {
      openModal("error", error.message);
    }

    onClose();
    closeModal();
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
            ref={titleInputRef}
            defaultValue={titleInputRef.current.value}
            className="input-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="datetime-local"
            required
            ref={dateInputRef}
            defaultValue={toLocalDatetimeInput(dateInputRef.current.value)}
            className="input-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            ref={typeInputRef}
            defaultValue={typeInputRef.current.value}
            className="input-primary"
          >
            <option value="debit">Expense</option>
            <option value="credit">Income</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
      </div>

      <ItemsForm
        items={items}
        setItems={setItems}
        handleChange={handleChange}
      />

      <PaymentsForm
        payments={payments}
        setPayments={setPayments}
        handleChange={handleChange}
      />

      {/* <TransactionAdvanceFields transaction={transaction} /> */}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:text-red-500 hover:border-red-500"
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
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        message={message}
        type={ModalType}
      />
    </form>
  );
}
