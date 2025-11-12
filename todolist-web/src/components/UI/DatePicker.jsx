import { useRef, useState, useEffect } from 'react'
import { CalendarDays } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import useClickOutside from '~/hooks/useClickOutside'

// CSS animation cho popup
const popupStyle = `
  @keyframes fadeInSlideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes fadeInSlideUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

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
  const popupRef = useRef(null)
  const [showPicker, setShowPicker] = useState(false)
  const [showAbove, setShowAbove] = useState(false)

  useClickOutside(pickerRef, () => setShowPicker(false), [])

  // Kiểm tra xem có đủ không gian ở dưới không, nếu không thì hiển thị ở trên
  useEffect(() => {
    if (!showPicker || !pickerRef.current) return

    const checkPosition = () => {
      if (!popupRef.current || !pickerRef.current) return
      
      const buttonRect = pickerRef.current.getBoundingClientRect()
      const popupRect = popupRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      // Kiểm tra xem popup có chạm bottom của viewport không
      const spaceBelow = viewportHeight - buttonRect.bottom
      const spaceAbove = buttonRect.top
      const popupHeight = popupRect.height || 350 // Ước tính chiều cao popup nếu chưa render

      // Nếu không đủ không gian ở dưới và có đủ không gian ở trên, hiển thị ở trên
      if (spaceBelow < popupHeight + 10 && spaceAbove > popupHeight + 10) {
        setShowAbove(true)
      } else {
        setShowAbove(false)
      }
    }

    // Đợi popup render xong rồi mới check (sử dụng setTimeout để đảm bảo DOM đã update)
    const timeoutId = setTimeout(() => {
      checkPosition()
    }, 0)

    // Check khi scroll/resize
    window.addEventListener('scroll', checkPosition, true)
    window.addEventListener('resize', checkPosition)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', checkPosition, true)
      window.removeEventListener('resize', checkPosition)
    }
  }, [showPicker])

  const handleSelect = (date) => {
    if (date) {
      const dateString = dateToString(date)
      onChange({ target: { value: dateString } })
    }
    setShowPicker(false)
  }

  return (
    <>
      <style>{popupStyle}</style>
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
        <div 
          ref={popupRef}
          className={`absolute z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg transition-all duration-200 ease-in-out ${
            showAbove ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
          style={{
            animation: showAbove 
              ? 'fadeInSlideUp 0.2s ease-in-out' 
              : 'fadeInSlideDown 0.2s ease-in-out'
          }}
        >
          <DayPicker
            mode="single"
            selected={stringToDate(value)}
            onSelect={handleSelect}
            disabled={disabled}
            className="p-2"
            classNames={{
              months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
              month: 'space-y-3',
              month_caption: 'flex justify-center pt-1 pb-3 relative items-center',
              caption_label: 'text-sm font-semibold text-gray-900 dark:text-gray-100 pointer-events-none',
              nav: 'space-x-1 flex items-center',
              button_previous: 'absolute left-2 top-2 h-8 w-8 bg-transparent p-0 opacity-60 hover:opacity-100 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center justify-center z-20 cursor-pointer pointer-events-auto',
              button_next: 'absolute right-2 top-2 h-8 w-8 bg-transparent p-0 opacity-60 hover:opacity-100 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center justify-center z-20 cursor-pointer pointer-events-auto',
              month_grid: 'w-full border-collapse',
              weekdays: 'flex mb-2',
              weekday: 'text-gray-500 dark:text-gray-400 rounded-md w-10 font-medium text-xs uppercase tracking-wider flex items-center justify-center',
              week: 'flex w-full mt-1',
              day: 'h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].range_end)]:rounded-r-md [&:has([aria-selected].outside)]:bg-gray-50 dark:[&:has([aria-selected].outside)]:bg-gray-800/50 [&:has([aria-selected])]:bg-sky-50 dark:[&:has([aria-selected])]:bg-sky-900/30 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
              day_button: 'h-10 w-10 p-0 font-medium aria-selected:opacity-100 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center justify-center',
              selected: 'bg-sky-500 dark:bg-sky-600 text-white hover:bg-sky-600 dark:hover:bg-sky-700 focus:bg-sky-600 dark:focus:bg-sky-700 font-semibold shadow-sm',
              today: 'bg-blue-50 dark:bg-blue-900/20 font-semibold text-blue-600 dark:text-blue-400',
              outside: 'text-gray-400 dark:text-gray-500 opacity-50',
              disabled: 'text-gray-300 dark:text-gray-600 opacity-50 cursor-not-allowed',
              range_middle: 'aria-selected:bg-sky-50 dark:aria-selected:bg-sky-900/30 aria-selected:text-gray-900 dark:aria-selected:text-gray-100',
              hidden: 'invisible',
            }}
          />
        </div>
      )}
      </div>
    </>
  )
}

export default DatePicker

