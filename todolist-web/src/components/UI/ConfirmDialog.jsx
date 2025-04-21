import React from 'react'

const ConfirmDialog = ({ title, message, handleConfirm, handleCancel, modal = true }) => {
  return (
    <div className={`${modal ? 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm': 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50'}`}>
      <div className="flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-2xl max-w-[600px]">

          {/* Tiêu đề */}
          {title && (
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {title}
            </h2>
          )}

          {/* Nội dung */}
          <p className="mb-8 text-gray-700 text-base leading-relaxed">
            {message}
          </p>

          {/* Nút hành động */}
          <div className="flex justify-end gap-4">
            <button
              onClick={handleCancel}
              className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 active:scale-95 transition"
            >
              Hủy
            </button>

            <button
              onClick={handleConfirm}
              className="px-5 py-2 rounded-md bg-sky-500 text-white hover:bg-sky-600 active:scale-95 transition"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
