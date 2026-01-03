import React, { useEffect, useState, useCallback, useRef } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import DropdownModal from "../../components/layouts/DropdownModal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import { toast } from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import { useUserAuth } from "../../hooks/useUserAuth";
import CSVBulkUpload from "../../components/Inputs/CSVBulkUpload";
import { LuPlus, LuTrendingUp } from "react-icons/lu";

const Income = () => {
  useUserAuth();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef(false);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const addButtonRef = useRef(null);
  const submitHandlerRef = useRef(null);

  // Get All Income Details
  const fetchIncomeDetails = useCallback(async () => {
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);

      if (response.data) {
        setIncomeData(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  // Handle Add Income
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    // Validation Checks
    if (!source.trim()) {
      toast.error("Income source is required");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be greater than 0");
      return;
    }

    if (!date) {
      toast.error("Date is required");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      });

      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error adding income:",
        error.response?.data?.message || error.message,
      );
    }
  };

  // Delete Income
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      toast.success("Income details deleted successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error deleting income:",
        error.response?.data?.message || error.message,
      );
      toast.error("Failed to delete income");
    }
  };

  // handle download income details
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType: "blob",
        },
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Income details:", error);
      toast.error("Failed to download Income details. Please try again later.");
    }
  };

  useEffect(() => {
    fetchIncomeDetails();

    return () => { };
  }, [fetchIncomeDetails]);

  const addIncomeFooter = (
    <button
      type="button"
      className="w-full group flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-120 hover:scale-105 active:scale-95"
      onClick={() => submitHandlerRef.current && submitHandlerRef.current()}
    >
      <LuPlus className="text-base sm:text-lg group-hover:rotate-90 transition-transform duration-120" />
      <span>Add Income</span>
      <LuTrendingUp className="text-sm sm:text-base opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-120" />
    </button>
  );

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-4 sm:my-6 mx-auto transition-page">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                Income
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-500">
                Track and manage your income sources
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <CSVBulkUpload
                type="income"
                apiPath={API_PATHS.INCOME.BULK_UPLOAD_INCOME}
                onUploadComplete={fetchIncomeDetails}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div className="animate-scale-in" style={{ animationDelay: "80ms" }}>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
              addButtonRef={addButtonRef}
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "160ms" }}>
            <IncomeList
              transactions={incomeData}
              onDelete={deleteIncome}
              onDownload={handleDownloadIncomeDetails}
            />
          </div>
        </div>

        <DropdownModal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
          triggerRef={addButtonRef}
          footer={addIncomeFooter}
        >
          <AddIncomeForm
            onAddIncome={handleAddIncome}
            submitHandlerRef={submitHandlerRef}
          />
        </DropdownModal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
