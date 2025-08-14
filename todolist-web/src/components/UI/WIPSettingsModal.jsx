import React, { useState, useEffect, useRef } from 'react'
import { X, Settings, BadgeInfo } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import useClickOutside from '~/hooks/useClickOutside'
import useEscapeKey from '~/hooks/useEscapeKey'

const WIPSettingsModal = ({ isOpen, onClose, onSave, currentSettings }) => {
  const board = useSelector(selectCurrentActiveBoard)
  const [wipEnabled, setWipEnabled] = useState(currentSettings?.enabled || false)
  const [wipLimit, setWipLimit] = useState(currentSettings?.limit || 5)
  const [validationError, setValidationError] = useState('')

  const WIPSettingsModalRef = useRef(null)

  // Reset validation error khi thay đổi settings
  useEffect(() => {
    setValidationError('')
  }, [wipEnabled, wipLimit])

  // Kiểm tra validation trước khi lưu
  const validateWIPSettings = () => {
    if (!wipEnabled) return true

    // Kiểm tra xem có cột nào đang vượt quá limit mới không
    const overLimitColumns = board?.columns?.filter(column => 
      (column.cards?.length || 0) > wipLimit
    )

    if (overLimitColumns.length > 0) {
      const columnNames = overLimitColumns.map(col => col.title).join(', ')
      setValidationError(`Không thể giảm WIP limit xuống ${wipLimit}! Các cột sau đang chứa nhiều task hơn: ${columnNames}`)
      return false
    }

    return true
  }

  const handleSave = () => {
    if (!validateWIPSettings()) return

    onSave({ enabled: wipEnabled, limit: wipLimit })
    onClose()
  }

  // Hiển thị warning nếu có cột vượt quá limit hiện tại
  const renderWIPWarning = () => {
    if (!wipEnabled || !board?.columns) return null

    const overLimitColumns = board.columns.filter(column => 
      (column.cards?.length || 0) > wipLimit
    )

    if (overLimitColumns.length > 0) {
      return (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
            <div className="text-sm text-red-700 dark:text-red-300">
              <p className="font-medium mb-1">Cảnh báo: Giới hạn WIP quá thấp!</p>
              <p className="text-xs">
                Các cột sau đang chứa nhiều task hơn giới hạn {wipLimit}:
              </p>
              <ul className="text-xs mt-1 space-y-0.5">
                {overLimitColumns.map(column => (
                  <li key={column._id} className="flex items-center justify-between">
                    <span>• {column.title}</span>
                    <span className="font-medium">{column.cards?.length || 0} task</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  useClickOutside(WIPSettingsModalRef, () => {
    onClose()
  })
  useEscapeKey(() => onClose())

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div ref={WIPSettingsModalRef} className="bg-white dark:bg-gray-900 rounded-xl p-6 w-96 max-w-[90vw] animate-fadeIn shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
              <Settings className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Cài đặt WIP
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Toggle WIP */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bật giới hạn WIP
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Giới hạn số lượng nhiệm vụ trong mỗi cột
              </p>
            </div>
            <button
              onClick={() => setWipEnabled(!wipEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                wipEnabled ? 'bg-sky-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  wipEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* WIP Limit Input */}
          {wipEnabled && (
            <div className="p-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-200 dark:border-sky-800">
              <label className="block text-sm font-medium text-sky-700 dark:text-sky-300 mb-3">
                Số lượng tối đa mỗi cột
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={wipLimit}
                onChange={(e) => setWipLimit(parseInt(e.target.value) || 1)}
                className="w-full p-3 border border-sky-300 dark:border-sky-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-gray-100 text-center font-medium text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Nhập số lượng tối đa"
              />
              <p className="text-xs text-sky-600 dark:text-sky-400 mt-2 text-center">
                Khi cột đạt giới hạn này, không thể thêm task mới
              </p>
            </div>
          )}

          {/* WIP Warning - HIỂN THỊ KHI CÓ CỘT VƯỢT QUÁ */}
          {renderWIPWarning()}

          {/* Validation Error */}
          {validationError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                <span className="text-sm text-red-700 dark:text-red-300">
                  {validationError}
                </span>
              </div>
            </div>
          )}

          {/* Help Info */}
          <div className="p-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-sky-100 dark:bg-sky-800 rounded-lg">
                <BadgeInfo className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div className="text-sm text-sky-700 dark:text-sky-300">
                <h4 className="font-medium mb-2">Lợi ích của WIP Limit:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Tập trung hoàn thành nhiệm vụ hiện tại</li>
                  <li>• Phát hiện sớm nút thắt trong quy trình</li>
                  <li>• Tăng tốc độ xử lý và chất lượng công việc</li>
                  <li>• Giảm áp lực, tránh quá tải cho team</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={!!validationError}
            className="flex-1 px-4 py-3 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-sm hover:shadow-md"
          >
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  )
}

export default WIPSettingsModal
