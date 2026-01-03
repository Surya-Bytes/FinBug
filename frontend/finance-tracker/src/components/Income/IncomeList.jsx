import moment from 'moment'
import React, { useMemo, useCallback, useState, useRef } from 'react'
import { LuDownload } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import DeleteConfirmPopover from '../layouts/DeleteConfirmPopover'


const IncomeList = React.memo(({ transactions, onDelete, onDownload }) => {
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
        <h5 className="text-base sm:text-lg font-semibold transition-colors duration-200 hover:text-purple-600">Income Source</h5>

        <button className="card-btn flex-shrink-0" onClick={handleDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      {transactions && transactions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transactions.map((income, index) => {
            if (!deleteButtonRefs.current[income._id]) {
              deleteButtonRefs.current[income._id] = React.createRef();
            }
            return (
              <div
                key={income._id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <TransactionInfoCard
                  title={income.source}
                  icon={income.icon}
                  date={moment(income.date).format("DD MMM YYYY")}
                  amount={income.amount}
                  type="income"
                  onDelete={() => handleDeleteClick(income._id)}
                  deleteButtonRef={deleteButtonRefs.current[income._id]}
                />
                <DeleteConfirmPopover
                  isOpen={deleteConfirmId === income._id}
                  onClose={handleDeleteCancel}
                  onConfirm={handleDeleteConfirm}
                  triggerRef={deleteButtonRefs.current[income._id]}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 text-gray-400">
          <p className="text-base sm:text-lg mb-2">No income records yet</p>
          <p className="text-xs sm:text-sm">Add your first income entry to get started!</p>
        </div>
      )}
    </div>
  )
});

IncomeList.displayName = 'IncomeList';

export default IncomeList