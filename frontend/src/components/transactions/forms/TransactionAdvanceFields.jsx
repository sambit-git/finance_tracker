import { useRef, useState } from "react";
import { Plus, Minus, IndianRupeeIcon } from "lucide-react";

const TransactionAdvanceFields = ({ transaction }) => {
  const tipInputRef = useRef({ value: transaction?.tip || "" });
  const taxInputRef = useRef({ value: transaction?.tax || "" });
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
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
                <IndianRupeeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.01"
                ref={taxInputRef}
                defaultValue={taxInputRef.current.value}
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
                <IndianRupeeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.01"
                ref={tipInputRef}
                defaultValue={tipInputRef.current.value}
                onChange={(e) => setTip(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionAdvanceFields;
