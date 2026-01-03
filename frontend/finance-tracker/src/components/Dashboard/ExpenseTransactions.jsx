import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import moment from 'moment'

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-start justify-between mb-4 sm:mb-6 flex-shrink-0">
        <h5 className="text-base sm:text-lg font-bold text-gray-900 transition-colors duration-200 hover:text-purple-600">Expenses</h5>

        <button
          className="text-xs sm:text-sm text-gray-600 hover:text-purple-600 font-medium flex items-center gap-1 transition-all duration-200 hover:gap-2 flex-shrink-0"
          onClick={onSeeMore}
        >
          <span className="hidden xs:inline">See All</span>
          <span className="xs:hidden">All</span>
          <LuArrowRight className='text-sm sm:text-base' />
        </button>
      </div>

      <div className="space-y-2 sm:space-y-3 flex-1">
        {transactions?.slice(0, 5)?.map((expense, index) => (
          <div
            key={expense._id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <TransactionInfoCard
              title={expense.category}
              icon={expense.icon}
              date={moment(expense.date).format("Do MMM YYYY")}
              amount={expense.amount}
              type="expense"
              hideDeleteBtn
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExpenseTransactions