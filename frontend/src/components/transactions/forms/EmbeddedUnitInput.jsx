import { useState } from "react";

const EmbeddedUnitInput = ({ value, index, handleChange }) => {
  const [discountType, setDiscountType] = useState("₹");

  const handleDiscountTypeChange = (type) => {
    if (discountType !== type) {
      if (type === "₹") setDiscountType("₹");
      else setDiscountType("%");
    }
  };

  const inputField =
    discountType === "%" ? (
      <input
        type="number"
        min="0"
        max="100"
        value={value}
        onChange={(e) =>
          handleChange(
            e,
            discountType === "%" ? "discountPercent" : "discount",
            index,
            "item",
            Number
          )
        }
        className="input-secondary no-spinner pl-10 pr-10"
      />
    ) : (
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) =>
          handleChange(
            e,
            discountType === "%" ? "discountPercent" : "discount",
            index,
            "item",
            Number
          )
        }
        className="input-secondary no-spinner pl-7"
      />
    );

  return (
    <div className="relative">
      {/* Currency Symbol */}
      <span
        className={`${
          discountType === "₹"
            ? "selected-discount-type"
            : "deselected-discount-type"
        } left-0 `}
        onClick={() => handleDiscountTypeChange("₹")}
      >
        ₹
      </span>

      {/* Input Field */}
      {inputField}
      {/* Percentage Symbol */}
      <span
        className={`${
          discountType === "%"
            ? "selected-discount-type"
            : "deselected-discount-type"
        } right-0 `}
        onClick={() => handleDiscountTypeChange("%")}
      >
        %
      </span>
    </div>
  );
};

export default EmbeddedUnitInput;
