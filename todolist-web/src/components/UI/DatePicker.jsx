import { useRef, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import useClickOutside from '~/hooks/useClickOutside'

// Helper functions to convert between string (YYYY-MM-DD) and Date
const stringToDate = (dateString) => {
  if (!dateString) return undefined
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? undefined : date
}

const dateToString = (date) => {
  if (!date) return ''
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const DatePicker = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'Chọn ngày',
  className = ''
}) => {
  const pickerRef = useRef(null)
  const [showPicker, setShowPicker] = useState(false)

  useClickOutside(pickerRef, () => setShowPicker(false), [])

  const handleSelect = (date) => {
    if (date) {
      const dateString = dateToString(date)
      onChange({ target: { value: dateString } })
    }
    setShowPicker(false)
  }

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        disabled={disabled}
        className="w-full p-2 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-600 transition-all hover:border-sky-400 dark:hover:border-sky-500 disabled:opacity-60 text-left flex items-center gap-2"
      >
        <CalendarDays className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span>{value || placeholder}</span>
      </button>
      {showPicker && (
        <div className="absolute z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          <DayPicker
            mode="single"
            selected={stringToDate(value)}
            onSelect={handleSelect}
            disabled={disabled}
            className="p-2"
            classNames={{
              months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
              month: 'space-y-4',
              caption: 'flex justify-center pt-1 relative items-center',
              caption_label: 'text-sm font-medium text-gray-900 dark:text-gray-100',
              nav: 'space-x-1 flex items-center',
              nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-gray-900 dark:text-gray-100',
              nav_button_previous: 'absolute left-1',
              nav_button_next: 'absolute right-1',
              table: 'w-full border-collapse space-y-1',
              head_row: 'flex',
              head_cell: 'text-gray-500 dark:text-gray-400 rounded-md w-9 font-normal text-[0.8rem]',
              row: 'flex w-full mt-2',
              cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100 dark:[&:has([aria-selected].day-outside)]:bg-gray-800 [&:has([aria-selected])]:bg-sky-50 dark:[&:has([aria-selected])]:bg-sky-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
              day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md',
              day_selected: 'bg-sky-500 dark:bg-sky-600 text-white hover:bg-sky-600 dark:hover:bg-sky-700 focus:bg-sky-600 dark:focus:bg-sky-700',
              day_today: 'bg-gray-100 dark:bg-gray-800 font-semibold',
              day_outside: 'text-gray-400 dark:text-gray-500 opacity-50',
              day_disabled: 'text-gray-300 dark:text-gray-600 opacity-50',
              day_range_middle: 'aria-selected:bg-sky-50 dark:aria-selected:bg-sky-900/50 aria-selected:text-gray-900 dark:aria-selected:text-gray-100',
              day_hidden: 'invisible',
            }}
          />
        </div>
      )}
    </div>
  )
}

export default DatePicker

