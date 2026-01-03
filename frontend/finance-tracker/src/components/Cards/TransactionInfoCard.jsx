import React from 'react'
import {
    LuUtensils,
    LuTrendingUp,
    LuTrendingDown,
    LuTrash2,
} from "react-icons/lu";

const TransactionInfoCard = ({ title, icon, date, amount, type, hideDeleteBtn, onDelete, deleteButtonRef }) => {
    const getAmountStyles = () =>
        type === 'income' ? 'text-green-500' : 'text-red-500';

    const handleDelete = (e) => {
        e.stopPropagation();
        if (typeof onDelete === 'function') onDelete();
    };

    return (
        <div className='flex items-center gap-3 sm:gap-4 py-3 px-2 -mx-2 rounded-lg transition-all duration-200 hover:bg-gray-50 cursor-pointer'>
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-base sm:text-lg text-gray-800 bg-gray-100 rounded-lg flex-shrink-0 transition-all duration-200 hover:scale-105">
                {icon ? (
                    icon.startsWith('http') || icon.startsWith('/') ? (
                        <img src={icon} alt={title} className='w-4 h-4 sm:w-5 sm:h-5' />
                    ) : (
                        <span className="text-xl sm:text-2xl">{icon}</span>
                    )
                ) : (
                    <LuUtensils />
                )}
            </div>

            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-w-0">
                <div className="min-w-0">
                    <p className='text-sm text-gray-900 font-medium truncate'>{title}</p>
                    <p className="text-xs text-gray-500">{date}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    {!hideDeleteBtn && (
                        <button 
                            ref={deleteButtonRef}
                            className='text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-200 cursor-pointer' 
                            onClick={handleDelete}
                        >
                            <LuTrash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                    )}

                    <div className={`flex items-center gap-1 ${getAmountStyles()}`}>
                        <h6 className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                            {type === "income" ? "+" : "-"} ₹{amount}
                        </h6>
                        {type === "income" ? (
                            <LuTrendingUp className="text-xs sm:text-sm" />
                        ) : (
                            <LuTrendingDown className="text-xs sm:text-sm" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionInfoCard