import React, { useMemo } from "react";
import CustomBarChart from "../Charts/CustomBarChart";
import { addThousandsSeparator } from "../../utils/helper";

const COLORS = [
  "#875CF5",
  "#FA2C37",
  "#FF6900",
  "#4f39f6",
  "#a78bfa",
  "#c4b5fd",
];

const RecentIncomeWithChart = React.memo(({ data, totalIncome }) => {
  // Memoize chart data preparation for faster rendering
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data
      .filter((item) => item && item.source && item.amount)
      .map((item) => ({
        name: item.source,
        amount: Number(item.amount) || 0,
      }))
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10); // Limit to top 10 for better performance and readability
  }, [data]);

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-start justify-between mb-4 sm:mb-6 flex-shrink-0">
        <h5 className="text-base sm:text-lg font-bold text-gray-900 transition-colors duration-200 hover:text-purple-600">
          Last 60 Days Income
        </h5>
        {chartData.length > 0 && (
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-500 mb-1">Total Income</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              ₹{addThousandsSeparator(totalIncome)}
            </p>
          </div>
        )}
      </div>

      <div className="w-full -mx-2 flex-1 flex items-center">
        {chartData.length > 0 ? (
          <CustomBarChart
            data={chartData}
            colors={COLORS}
            isDateBased={false}
          />
        ) : (
          <div className="text-center py-12 sm:py-16 text-gray-400 w-full">
            <p className="text-xs sm:text-sm">No income data available</p>
            <p className="text-xs mt-1">Add income to see the chart</p>
          </div>
        )}
      </div>
    </div>
  );
});

RecentIncomeWithChart.displayName = "RecentIncomeWithChart";

export default RecentIncomeWithChart;
