import React, { useEffect, useState, useCallback, useRef } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import DropdownModal from "../../components/layouts/DropdownModal";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import { toast } from "react-hot-toast";
import ExpenseList from "../../components/Expense/ExpenseList";
import { useUserAuth } from "../../hooks/useUserAuth";
import CSVBulkUpload from "../../components/Inputs/CSVBulkUpload";
import { LuPlus, LuTrendingDown } from "react-icons/lu";

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef(false);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const addButtonRef = useRef(null);
  const submitHandlerRef = useRef(null);

  // Get All Expense Details
  const fetchExpenseDetails = useCallback(async () => {
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.GET_ALL_EXPENSE,
      );

      if (response.data) {
        setExpenseData(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  // Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    // Validation Checks
    if (!category.trim()) {
      toast.error("Expense category is required");
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
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error adding Expense:",
        error.response?.data?.message || error.message,
      );
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error deleting Expense:",
        error.response?.data?.message || error.message,
      );
      toast.error("Failed to delete expense");
    }
  };

  // handle download Expense details
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType: "blob",
        },
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error(
        "Failed to download expense details. Please try again later.",
      );
    }
  };

  useEffect(() => {
    fetchExpenseDetails();

    return () => { };
  }, [fetchExpenseDetails]);

  const addExpenseFooter = (
    <button
      type="button"
      className="w-full group flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-120 hover:scale-105 active:scale-95"
      onClick={() => submitHandlerRef.current && submitHandlerRef.current()}
    >
      <LuPlus className="text-base sm:text-lg group-hover:rotate-90 transition-transform duration-120" />
      <span>Add Expense</span>
      <LuTrendingDown className="text-sm sm:text-base opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-120" />
    </button>
  );

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-4 sm:my-6 mx-auto transition-page">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                Expenses
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-500">
                Monitor and control your spending
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <CSVBulkUpload
                type="expense"
                apiPath={API_PATHS.EXPENSE.BULK_UPLOAD_EXPENSE}
                onUploadComplete={fetchExpenseDetails}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div className="animate-scale-in" style={{ animationDelay: "80ms" }}>
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
              addButtonRef={addButtonRef}
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "160ms" }}>
            <ExpenseList
              transactions={expenseData}
              onDelete={deleteExpense}
              onDownload={handleDownloadExpenseDetails}
            />
          </div>
        </div>

        <DropdownModal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
          triggerRef={addButtonRef}
          footer={addExpenseFooter}
        >
          <AddExpenseForm
            openAddExpense={handleAddExpense}
            submitHandlerRef={submitHandlerRef}
          />
        </DropdownModal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
