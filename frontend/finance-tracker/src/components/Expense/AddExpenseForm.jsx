import React, { useState, useEffect, useRef } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../layouts/EmojiPickerPopup";
import {
  LuPlus,
  LuTrendingDown,
  LuUpload,
  LuX,
  LuImage,
  LuScan,
} from "react-icons/lu";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const AddExpenseForm = ({ openAddExpense, submitHandlerRef }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const expenseRef = useRef(expense);

  // Keep ref in sync with state
  useEffect(() => {
    expenseRef.current = expense;
  }, [expense]);

  const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setExpense({ ...expense, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const scanBillImage = async () => {
    if (!expense.image) {
      toast.error("Please upload a bill image first");
      return;
    }

    setScanning(true);
    try {
      const formData = new FormData();
      formData.append("bill", expense.image);

      const response = await axiosInstance.post(API_PATHS.BILL.SCAN, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.data) {
        const { amount, category, date } = response.data.data;

        setExpense((prev) => ({
          ...prev,
          amount: amount != null ? String(amount) : "",
          category: category || "",
          date: date || "",
        }));

        toast.success("Bill scanned successfully!");
      } else {
        toast.error("No data extracted from bill");
      }
    } catch (error) {
      console.error("Error scanning bill:", error);
      toast.error(error.response?.data?.message || "Failed to scan bill");
    } finally {
      setScanning(false);
    }
  };

  const removeImage = () => {
    setExpense({ ...expense, image: null });
    setImagePreview(null);
  };

  useEffect(() => {
    if (submitHandlerRef) {
      submitHandlerRef.current = () => {
        openAddExpense(expenseRef.current);
        // Reset form after submission
        setExpense({
          category: "",
          amount: "",
          date: "",
          icon: "",
          image: null,
        });
        setImagePreview(null);
      };
    }
  }, [submitHandlerRef, openAddExpense]);

  return (
    <div className="animate-fade-in">
      {/* Icon Picker Section */}
      <div className="mb-3 sm:mb-4 animate-scale-in" style={{ animationDelay: "50ms" }}>
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
          Choose Icon
        </label>
        <EmojiPickerPopup
          icon={expense.icon}
          onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
        />
      </div>

      {/* Form Fields */}
      <div className="space-y-3 sm:space-y-4">
        <div
          className="animate-slide-in-left"
          style={{ animationDelay: "100ms" }}
        >
          <Input
            value={expense.category}
            onChange={({ target }) => handleChange("category", target.value)}
            label="Expense Category"
            placeholder="e.g., Rent, Groceries, Transport"
            type="text"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="animate-slide-in-left"
            style={{ animationDelay: "150ms" }}
          >
            <Input
              value={expense.amount}
              onChange={({ target }) => handleChange("amount", target.value)}
              label="Amount (₹)"
              placeholder="Enter amount"
              type="number"
            />
          </div>

          <div
            className="animate-slide-in-right"
            style={{ animationDelay: "200ms" }}
          >
            <Input
              value={expense.date}
              onChange={({ target }) => handleChange("date", target.value)}
              label="Date"
              placeholder=""
              type="date"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="animate-fade-in" style={{ animationDelay: "250ms" }}>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            Upload Receipt/Image (Optional)
          </label>

          {!imagePreview ? (
            <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-150 hover:border-red-400">
              <div className="flex flex-col items-center justify-center pt-3 pb-3 sm:pt-5 sm:pb-6">
                <LuUpload className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 text-gray-400" />
                <p className="mb-1 text-xs sm:text-sm text-gray-500 text-center px-2">
                  <span className="font-semibold">Click to upload</span>
                  <span className="hidden sm:inline"> or drag and drop</span>
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, JPEG (MAX. 5MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              <div className="relative w-full h-36 sm:h-48 border-2 border-gray-200 rounded-xl overflow-hidden group will-change-transform">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover will-change-transform"
                  loading="lazy"
                  decoding="async"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 sm:p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-100 opacity-0 group-hover:opacity-100 will-change-opacity"
                >
                  <LuX className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-100 will-change-opacity">
                  <p className="text-white text-sm flex items-center gap-2">
                    <LuImage className="w-4 h-4" />
                    {expense.image?.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={scanBillImage}
                disabled={scanning}
                className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm sm:text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-100 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 will-change-transform"
              >
                <LuScan
                  className={`w-4 h-4 ${scanning ? "animate-pulse" : ""}`}
                />
                <span>
                  {scanning ? "Scanning..." : "Scan Bill with AI"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddExpenseForm;
