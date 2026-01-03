import React, { useMemo } from 'react'
import { LuPlus } from "react-icons/lu";
import { prepareExpenseLineChartData } from '../../utils/helper';
import CustomLineChart from '../Charts/CustomLineChart';

const ExpenseOverview = React.memo(({ transactions, onAddExpense, addButtonRef }) => {
    // Memoize chart data preparation for faster rendering - no useEffect needed
    const chartData = useMemo(() => {
        if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
            return [];
        }
        return prepareExpenseLineChartData(transactions);
    }, [transactions]);

    return <div className="card">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 min-w-0">
                <h5 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 transition-colors duration-200 hover:text-purple-600">Expense Overview</h5>
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                    Track your spending trends over time and analyze your expenses.
                </p>
            </div>

            <button ref={addButtonRef} className="add-btn add-btn-fill whitespace-nowrap flex-shrink-0 w-full sm:w-auto" onClick={onAddExpense}>
                <LuPlus className='text-base sm:text-lg' />
                <span className="hidden sm:inline">Add Expense</span>
                <span className="sm:hidden">Add Expense</span>
            </button>
        </div>

        <div className="mt-4 sm:mt-6">
            <CustomLineChart data={chartData} />
        </div>
    </div>
});

ExpenseOverview.displayName = 'ExpenseOverview';

export default ExpenseOverview