"use client";
import React, { useReducer, ChangeEvent } from "react";

interface HandleQuantityProps {
  bidAmount: number;
  setBidAmount: (number) => void;
  stepPrice: number;
}

const HandleQuantity: React.FC<HandleQuantityProps> = ({ bidAmount, setBidAmount, stepPrice }) => {

  const handleInputChange = (value: string) => {
    const numberValue = parseInt(value, 10);

    // Only update state if the value is a positive number
    if (!isNaN(numberValue) && numberValue > 0) {
      setBidAmount(numberValue);
    } else if (value === "") {
      // Allow clearing the input
      setBidAmount(0);
    }
  };

  return (
    <div className="quantity-counter" style={{ width: "500px" }}>
      <a
        className="quantity__minus"
        style={{ cursor: "pointer" }}
        onClick={() => handleInputChange(bidAmount - stepPrice + "")}
      >
        <i className="bx bx-minus" />
      </a>
      <input
        name="quantity"
        type="number"
        min="1"
        value={bidAmount}
        onChange={(e) => handleInputChange(e.target.value)}
        className="quantity__input"
        placeholder="Enter a number greater than 0"
      />
      <a
        className="quantity__plus"
        style={{ cursor: "pointer" }}
        onClick={() => handleInputChange(bidAmount + stepPrice + "")}
      >
        <i className="bx bx-plus" />
      </a>
    </div>
  );
}

export default HandleQuantity;
