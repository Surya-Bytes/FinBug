import React from 'react'

const InfoCard = ({ icon, label, value, color, index = 0 }) => {
  return (
    <div
      className='bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex gap-3 sm:gap-4 items-center transition-all duration-200 hover:shadow-lg hover:border-purple-200 hover:-translate-y-1 cursor-pointer'
      style={{
        animation: `fadeInUp 350ms cubic-bezier(0.4, 0, 0.2, 1) both`,
        animationDelay: `${index * 80}ms`,
        willChange: 'transform'
      }}
    >
      <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl text-white ${color} rounded-xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}>
        {icon}
      </div>
      <div className="min-w-0">
        <h6 className="text-xs sm:text-sm text-gray-500 mb-1 font-medium transition-colors duration-200">{label}</h6>
        <span className="text-lg sm:text-2xl font-bold text-gray-900 truncate block">₹{value}</span>
      </div>
    </div>
  )
}

export default InfoCard