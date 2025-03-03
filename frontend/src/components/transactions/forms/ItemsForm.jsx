import { Plus, X } from "lucide-react";
import EmbeddedUnitInput from "./EmbeddedUnitInput";

const ItemsForm = ({ items, setItems, handleChange }) => {
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        name: "",
        quantity: 1,
        unit: "pcs",
        mrp: 0,
        discountPercent: 0,
        taxPercent: 0,
        finalAmount: 0,
      },
    ]);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Items</h3>
      </div>
      {items.map((item, index) => (
        <div
          key={index}
          className="form-section grid grid-cols-3 gap-4 relative"
        >
          {/* Remove Button */}
          <button
            type="button"
            className="absolute top-2 right-5 text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center text-sm"
            aria-label="Remove item"
            onClick={() => handleDeleteItem(index)}
          >
            <X className="h-4 w-4 mr-1" /> Remove Item
          </button>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              required
              value={item.name || ""}
              onChange={(e) => handleChange(e, "name", index, "item")}
              className="input-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              required
              step="0.01"
              value={item.quantity || ""}
              onChange={(e) =>
                handleChange(e, "quantity", index, "item", Number)
              }
              className="input-secondary no-spinner"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <select
              required
              value={item.unit || "nos"}
              onChange={(e) => handleChange(e, "unit", index, "item")}
              className="input-secondary no-spinner"
            >
              <option value="pcs">pieces</option>
              <option value="kg">kg</option>
              <option value="litres">litres</option>
              <option value="minutes">minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unit Price
            </label>
            <input
              type="number"
              required
              step="0.01"
              value={item.mrp || ""}
              onChange={(e) => handleChange(e, "mrp", index, "item", Number)}
              className="input-secondary no-spinner"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Discount
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              max="100"
              value={item.discountPercent || ""}
              onChange={(e) =>
                handleChange(e, "discountPercent", index, "item", Number)
              }
              className="input-secondary no-spinner"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount Paid
            </label>
            <input
              type="number"
              min="0"
              required
              step="0.01"
              value={item.finalAmount || ""}
              onChange={(e) =>
                handleChange(e, "finalAmount", index, "item", Number)
              }
              className="input-secondary no-spinner"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddItem}
        className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Item
      </button>
    </div>
  );
};

export default ItemsForm;
