import React, { useState, useEffect, useRef } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../layouts/EmojiPickerPopup";
import {
  LuPlus,
  LuTrendingUp,
  LuUpload,
  LuX,
  LuImage,
  LuScan,
} from "react-icons/lu";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const AddIncomeForm = ({ onAddIncome, submitHandlerRef }) => {
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
    icon: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const incomeRef = useRef(income);

  // Keep ref in sync with state
  useEffect(() => {
    incomeRef.current = income;
  }, [income]);

  const handleChange = (key, value) => setIncome({ ...income, [key]: value });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIncome({ ...income, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const scanBillImage = async () => {
    if (!income.image) {
      toast.error("Please upload a receipt image first");
      return;
    }

    setScanning(true);
    try {
      const formData = new FormData();
      formData.append("bill", income.image);

      const response = await axiosInstance.post(API_PATHS.BILL.SCAN, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.data) {
        const { amount, category, date } = response.data.data;

        setIncome((prev) => ({
          ...prev,
          amount: amount != null ? String(amount) : "",
          source: category || "",
          date: date || "",
        }));

        toast.success("Receipt scanned successfully!");
      }
    } catch (error) {
      console.error("Error scanning receipt:", error);
      toast.error(error.response?.data?.message || "Failed to scan receipt");
    } finally {
      setScanning(false);
    }
  };

  const removeImage = () => {
    setIncome({ ...income, image: null });
    setImagePreview(null);
  };

  useEffect(() => {
    if (submitHandlerRef) {
      submitHandlerRef.current = () => {
        onAddIncome(incomeRef.current);
        // Reset form after submission
        setIncome({
          source: "",
          amount: "",
          date: "",
          icon: "",
          image: null,
        });
        setImagePreview(null);
      };
    }
  }, [submitHandlerRef, onAddIncome]);

  return (
    <div className="animate-fade-in">
      {/* Icon Picker Section */}
      <div className="mb-3 sm:mb-4 animate-scale-in" style={{ animationDelay: "30ms" }}>
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
          Choose Icon
        </label>
        <EmojiPickerPopup
          icon={income.icon}
          onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
        />
      </div>

      {/* Form Fields */}
      <div className="space-y-3 sm:space-y-4">
        {" "}
        <div
          className="animate-slide-in-left"
          style={{ animationDelay: "60ms" }}
        >
          <Input
            value={income.source}
            onChange={({ target }) => handleChange("source", target.value)}
            label="Income Source"
            placeholder="e.g., Freelance, Salary, Bonus"
            type="text"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="animate-slide-in-left"
            style={{ animationDelay: "90ms" }}
          >
            <Input
              value={income.amount}
              onChange={({ target }) => handleChange("amount", target.value)}
              label="Amount (₹)"
              placeholder="Enter amount"
              type="number"
            />
          </div>

          <div
            className="animate-slide-in-right"
            style={{ animationDelay: "120ms" }}
          >
            <Input
              value={income.date}
              onChange={({ target }) => handleChange("date", target.value)}
              label="Date"
              placeholder=""
              type="date"
            />
          </div>
        </div>
        {/* Image Upload Section */}
        <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            Upload Receipt/Image (Optional)
          </label>

          {!imagePreview ? (
            <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-150 hover:border-purple-400">
              <div className="flex flex-col items-center justify-center pt-3 pb-3 sm:pt-4 sm:pb-4">
                {" "}
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
              <div className="relative w-full h-36 sm:h-40 border-2 border-gray-200 rounded-xl overflow-hidden group will-change-transform">
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
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-100 opacity-0 group-hover:opacity-100 will-change-opacity"
                >
                  <LuX className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-100 will-change-opacity">
                  <p className="text-white text-sm flex items-center gap-2">
                    <LuImage className="w-4 h-4" />
                    {income.image?.name}
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
                  {scanning ? "Scanning..." : "Scan Receipt with AI"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddIncomeForm;
