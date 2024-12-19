import { useState } from "react";
import TransactionItem from "./TransactionItem";
import { useSelector } from "react-redux";

const TransactionsList = ({}) => {
  const groupedTransactions = useSelector(
    (store) => store.transactions.groupedTransactions
  );
  const [expandedDate, setExpandedDate] = useState(null);

  const toggleDate = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {Object.keys(groupedTransactions).map((date) => {
        const totalCredit = groupedTransactions[date]?.totalCredit;
        const totalDebit = groupedTransactions[date]?.totalDebit;
        return (
          <div key={date} className="mb-6">
            {/* Date Header with Total Expense */}
            <div
              onClick={() => toggleDate(date)}
              className="flex justify-between items-center bg-indigo-100 p-4 rounded-md shadow cursor-pointer hover:bg-indigo-300 transition"
            >
              <h3 className="font-bold text-gray-700">
                {date.substring(0, 6)}
              </h3>
              <div className="flex flex-col text-right flex-1">
                {totalCredit > 0 && (
                  <p className="font-semibold text-lg text-lime-600">
                    ₹{Intl.NumberFormat("en-IN").format(totalCredit)}
                  </p>
                )}
                {totalDebit > 0 && (
                  <p className="font-semibold text-lg text-salmon">
                    ₹{Intl.NumberFormat("en-IN").format(totalDebit)}
                  </p>
                )}
              </div>
            </div>

            {/* Transactions for the Date */}
            {expandedDate === date && (
              <div className="mt-4 space-y-4 pl-6">
                {groupedTransactions[date]?.transactions?.map((transaction) => (
                  <TransactionItem
                    transaction={transaction}
                    key={transaction.id}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TransactionsList;
