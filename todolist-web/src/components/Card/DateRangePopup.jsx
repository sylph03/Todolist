import { useEffect, useRef, useState } from 'react'
import { XCircle, X } from 'lucide-react'
import 'react-day-picker/dist/style.css'
import useClickOutside from '~/hooks/useClickOutside'
import DatePicker from '../UI/DatePicker'
import TimePicker from '../UI/TimePicker'

const DateRangePopup = ({
  anchorRef,
  onClose,
  card,
  isUpdating,
  onStartDateChange,
  onDueDateChange,
  onClearDates,
  startDateValue,
  dueDateValue,
  dueTimeValue
}) => {
  const popupRef = useRef(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useClickOutside(popupRef, onClose, [anchorRef])

  const updatePosition = () => {
    if (!anchorRef?.current || !popupRef.current) return
    const anchorRect = anchorRef.current.getBoundingClientRect()
    const popupRect = popupRef.current.getBoundingClientRect()
    const GAP = 6
    const PADDING = 8

    let top = anchorRect.bottom + GAP
    let left = anchorRect.left

    if (top + popupRect.height > window.innerHeight - PADDING) {
      top = Math.max(PADDING, anchorRect.top - popupRect.height - GAP)
    }

    if (left + popupRect.width > window.innerWidth - PADDING) {
      left = Math.max(PADDING, window.innerWidth - popupRect.width - PADDING)
    }

    if (left < PADDING) left = PADDING

    setPosition({ top, left })
  }

  useEffect(() => {
    const raf = requestAnimationFrame(updatePosition)
    const handleResize = () => updatePosition()
    const handleScroll = () => updatePosition()
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [anchorRef, startDateValue, dueDateValue, dueTimeValue])

  return (
    <div
      ref={popupRef}
      className="fixed z-100 bg-white dark:bg-gray-900 rounded-xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-600 w-80 max-w-full animate-fadeIn"
      style={{ top: position.top, left: position.left }}
    >
      <div className="flex items-center justify-center relative py-3 px-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Mốc thời gian</h3>
        <div className="absolute right-2 flex items-center gap-2">
          {(card?.startDate || card?.dueDate) && (
            <button
              type="button"
              onClick={onClearDates}
              disabled={isUpdating}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
              title="Xóa hết"
            >
              <XCircle className="w-4 h-4 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-1 flex items-center gap-1">
              Ngày bắt đầu
            </label>
            <DatePicker
              value={startDateValue}
              onChange={onStartDateChange}
              disabled={isUpdating}
              placeholder="Chọn ngày"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-1 flex items-center gap-1">
              Hạn hoàn thành
            </label>
            <div className="grid grid-cols-2 gap-2">
              <DatePicker
                value={dueDateValue}
                onChange={(e) => onDueDateChange(e.target.value, dueTimeValue)}
                disabled={isUpdating}
                placeholder="Chọn ngày"
              />
              <TimePicker
                value={dueTimeValue}
                onChange={(e) => onDueDateChange(dueDateValue, e.target.value)}
                disabled={isUpdating}
                placeholder="Chọn giờ"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DateRangePopup

