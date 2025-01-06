import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setFilters } from "../../store/slices/transactionsSlice";
import { TransactionCategory } from "../../types";
import { Search, Calendar } from "lucide-react";

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

export function TransactionFilters() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.transactions.filters);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="text-gray-400 h-5 w-5" />
          <input
            type="date"
            value={filters.dateRange.start || ""}
            onChange={(e) =>
              dispatch(
                setFilters({
                  dateRange: { ...filters.dateRange, start: e.target.value },
                })
              )
            }
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span>to</span>
          <input
            type="date"
            value={filters.dateRange.end || ""}
            onChange={(e) =>
              dispatch(
                setFilters({
                  dateRange: { ...filters.dateRange, end: e.target.value },
                })
              )
            }
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => {
              const categories = filters.categories.includes(category)
                ? filters.categories.filter((c) => c !== category)
                : [...filters.categories, category];
              dispatch(setFilters({ categories }));
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filters.categories.includes(category)
                ? "bg-indigo-100 text-indigo-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
