import moment from 'moment';
import React, { useMemo, useCallback } from 'react'
import { LuArrowRight } from 'react-icons/lu';
import TransactionInfoCard from '../Cards/TransactionInfoCard';


const RecentTransactions = React.memo(({ transactions, onSeeMore }) => {
  // Memoize recent transactions to prevent unnecessary re-renders
  const recentTransactions = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) return [];
    return transactions.slice(0, 5);
  }, [transactions]);

  const handleSeeMore = useCallback(() => {
    onSeeMore?.();
  }, [onSeeMore]);
  return (
    <div className='card h-full flex flex-col'>
      <div className="flex items-start justify-between mb-4 sm:mb-6 flex-shrink-0">
        <h5 className="text-base sm:text-lg font-bold text-gray-900 transition-colors duration-200 hover:text-purple-600">Recent Transactions</h5>
        <button
          className="text-xs sm:text-sm text-gray-600 hover:text-purple-600 font-medium flex items-center gap-1 transition-all duration-200 hover:gap-2 flex-shrink-0"
          onClick={handleSeeMore}
        >
          <span className="hidden xs:inline">See All</span>
          <span className="xs:hidden">All</span>
          <LuArrowRight className="text-sm sm:text-base" />
        </button>
      </div>

      <div className="space-y-2 sm:space-y-3 flex-1">
        {recentTransactions.map((item, index) => (
          <div
            key={item._id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <TransactionInfoCard
              title={item.type === 'expense' ? item.category : item.source}
              icon={item.icon}
              date={moment(item.date).format('Do MMM YYYY')}
              amount={item.amount}
              type={item.type}
              hideDeleteBtn
            />
          </div>
        ))}
      </div>
    </div>
  );
});

RecentTransactions.displayName = 'RecentTransactions';

export default RecentTransactions