import React, { useMemo } from "react";
import moment from "moment";
import CustomBarChart from "../Charts/CustomBarChart";

const Last30DaysExpenses = React.memo(({ data }) => {
  // Memoize chart data preparation for faster rendering - no useEffect needed
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Prepare data for bar chart with name and amount
    const sortedData = [...data].sort((a, b) => {
      const dateA = a?.date ? new Date(a.date).getTime() : 0;
      const dateB = b?.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    });

    return sortedData.map((item) => ({
      name: item?.date || "",
      amount: Number(item?.amount) || 0,
      category: item?.category || "",
    }));
  }, [data]);
  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-start justify-between mb-4 sm:mb-6 flex-shrink-0">
        <h5 className="text-base sm:text-lg font-bold text-gray-900 transition-colors duration-200 hover:text-purple-600">
          Last 30 Days Expenses
        </h5>
      </div>

      <div className="w-full -mx-2 flex-1 flex items-center">
        {chartData.length > 0 ? (
          <CustomBarChart data={chartData} />
        ) : (
          <div className="text-center py-12 sm:py-16 text-gray-400 w-full">
            <p className="text-xs sm:text-sm">No expense data available</p>
          </div>
        )}
      </div>
    </div>
  );
});

Last30DaysExpenses.displayName = "Last30DaysExpenses";

export default Last30DaysExpenses;
