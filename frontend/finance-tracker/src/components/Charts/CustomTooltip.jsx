import React from 'react'
import { addThousandsSeparator } from '../../utils/helper';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const value = Number(payload[0].value) || 0;
    return (
        <div className="bg-white shadow-md rounded-lg p-3 border border-gray-200">
            <p className="text-sm font-semibold text-gray-900 mb-1">{payload[0].name}</p>
            <p className="text-sm text-gray-600">
                Amount: <span className="text-sm font-medium text-gray-900">₹{addThousandsSeparator(value)}</span>
            </p>
        </div>
    );
  }

  return null;
}

export default CustomTooltip