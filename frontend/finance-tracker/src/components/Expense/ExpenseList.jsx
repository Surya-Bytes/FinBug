import moment from 'moment'
import React, { useMemo, useCallback, useState, useRef } from 'react'
import { LuDownload } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import DeleteConfirmPopover from '../layouts/DeleteConfirmPopover'


const ExpenseList = React.memo(({ transactions, onDelete, onDownload }) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const deleteButtonRefs = useRef({});

  // Memoize callbacks to prevent unnecessary re-renders
  const handleDownload = useCallback(() => {
    onDownload?.();
  }, [onDownload]);

  const handleDeleteClick = useCallback((id) => {
    setDeleteConfirmId(id);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirmId) {
      onDelete?.(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  }, [deleteConfirmId, onDelete]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteConfirmId(null);
  }, []);
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h5 className="text-base sm:text-lg font-semibold transition-colors duration-200 hover:text-purple-600">All Expenses</h5>

        <button className="card-btn flex-shrink-0" onClick={handleDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      {transactions && transactions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transactions.map((expense, index) => {
            if (!deleteButtonRefs.current[expense._id]) {
              deleteButtonRefs.current[expense._id] = React.createRef();
            }
            return (
              <div
                key={expense._id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <TransactionInfoCard
                  title={expense.category}
                  icon={expense.icon}
                  date={moment(expense.date).format("DD MMM YYYY")}
                  amount={expense.amount}
                  type="expense"
                  onDelete={() => handleDeleteClick(expense._id)}
                  deleteButtonRef={deleteButtonRefs.current[expense._id]}
                />
                <DeleteConfirmPopover
                  isOpen={deleteConfirmId === expense._id}
                  onClose={handleDeleteCancel}
                  onConfirm={handleDeleteConfirm}
                  triggerRef={deleteButtonRefs.current[expense._id]}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 text-gray-400">
          <p className="text-base sm:text-lg mb-2">No expense records yet</p>
          <p className="text-xs sm:text-sm">Add your first expense entry to start tracking!</p>
        </div>
      )}
    </div>
  )
});

ExpenseList.displayName = 'ExpenseList';

export default ExpenseList