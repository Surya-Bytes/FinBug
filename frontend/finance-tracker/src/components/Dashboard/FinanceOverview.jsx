import React, { useMemo } from "react";
import CustomBarChart from "../Charts/CustomBarChart";
import { addThousandsSeparator } from "../../utils/helper";

// Colors: Purple for Balance, Orange for Income, Red for Expenses
const COLORS = ["#875cf5", "#FF6900", "#FA2C37"];

const FinanceOverview = React.memo(
  ({ totalBalance, totalIncome, totalExpenses }) => {
    // Memoize data preparation for faster rendering
    const { financeData, hasData, balance } = useMemo(() => {
      const bal = Number(totalBalance) || 0;
      const inc = Number(totalIncome) || 0;
      const exp = Number(totalExpenses) || 0;

      const data = [
        { name: "Balance", amount: Math.max(Math.abs(bal), 0) },
        { name: "Income", amount: Math.max(Math.abs(inc), 0) },
        { name: "Expenses", amount: Math.max(Math.abs(exp), 0) },
      ].filter((item) => item.amount > 0);

      return {
        financeData: data,
        hasData: data.length > 0,
        balance: bal,
      };
    }, [totalBalance, totalIncome, totalExpenses]);

    return (
      <div className="card h-full flex flex-col">
        <div className="flex items-start justify-between mb-4 sm:mb-6 flex-shrink-0">
          <h5 className="text-base sm:text-lg font-bold text-gray-900 transition-colors duration-200 hover:text-purple-600">
            Financial Overview
          </h5>
          {hasData && (
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-500 mb-1">Total Balance</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                ₹{addThousandsSeparator(balance)}
              </p>
            </div>
          )}
        </div>

        <div className="w-full -mx-2 flex-1 flex items-center">
          {hasData ? (
            <CustomBarChart data={financeData} colors={COLORS} />
          ) : (
            <div className="text-center py-12 sm:py-16 text-gray-400 w-full">
              <p className="text-xs sm:text-sm">No financial data available</p>
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default FinanceOverview;
