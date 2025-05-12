import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

const ConfirmDialog = ({
  title,
  message,
  handleConfirm,
  handleCancel,
  modal = true,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmColor = 'sky',
  size = 'md',
  isLoading = false
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        handleCancel()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [handleCancel])

  const sizeClasses = {
    sm: 'max-w-[400px]',
    md: 'max-w-[600px]',
    lg: 'max-w-[800px]'
  }

  const colorClasses = {
    sky: 'bg-sky-500 hover:bg-sky-600',
    red: 'bg-red-500 hover:bg-red-600',
    green: 'bg-green-500 hover:bg-green-600',
    blue: 'bg-blue-500 hover:bg-blue-600'
  }

  return (
    <div
      className={`${modal ? 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm': 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50'}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out'
      }}
    >
      <div
        className="flex items-center justify-center z-50"
        style={{
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 0.2s ease-in-out'
        }}
      >
        <div className={`bg-white p-6 rounded-xl shadow-2xl ${sizeClasses[size]}`}>
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
              className="px-4 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 active:scale-95 transition"
              disabled={isLoading}
            >
              {cancelText}
            </button>

            <button
              onClick={handleConfirm}
              className={`px-4 py-1.5 rounded-md ${colorClasses[confirmColor]} text-white active:scale-95 transition flex items-center gap-2`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Đang xử lý...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
