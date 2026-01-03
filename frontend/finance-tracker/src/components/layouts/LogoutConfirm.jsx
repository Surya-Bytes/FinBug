import React from 'react'

const LogoutConfirm = ({ onCancel, onLogout }) => {
  return (
    <div>
      <p className="text-sm">Are you sure you want to logout?</p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default LogoutConfirm
