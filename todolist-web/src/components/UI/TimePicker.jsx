import { useRef, useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
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
  .time-picker-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .time-picker-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .time-picker-scroll::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.5);
    border-radius: 3px;
  }
  .time-picker-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.7);
  }
  .dark .time-picker-scroll::-webkit-scrollbar-thumb {
    background: rgba(71, 85, 105, 0.5);
  }
  .dark .time-picker-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(71, 85, 105, 0.7);
  }
`

const TimePicker = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'Chọn giờ',
  className = ''
}) => {
  const pickerRef = useRef(null)
  const popupRef = useRef(null)
  const hoursScrollRef = useRef(null)
  const minutesScrollRef = useRef(null)
  const [showPicker, setShowPicker] = useState(false)
  const [showAbove, setShowAbove] = useState(false)
  const [hours, setHours] = useState('00')
  const [minutes, setMinutes] = useState('00')

  useClickOutside(pickerRef, () => setShowPicker(false), [])

  // Parse time value (HH:MM format)
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':')
      setHours(h || '00')
      setMinutes(m || '00')
    } else {
      setHours('00')
      setMinutes('00')
    }
  }, [value])

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
      const popupHeight = popupRect.height || 300 // Ước tính chiều cao popup nếu chưa render

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

  // Scroll to selected time when picker opens
  useEffect(() => {
    if (showPicker && hoursScrollRef.current && minutesScrollRef.current) {
      const hourIndex = parseInt(hours) || 0
      const minuteIndex = parseInt(minutes) || 0
      
      // Scroll hours
      const hourButton = hoursScrollRef.current.children[hourIndex]
      if (hourButton) {
        hourButton.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
      
      // Scroll minutes
      const minuteButton = minutesScrollRef.current.children[minuteIndex]
      if (minuteButton) {
        minuteButton.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
    }
  }, [showPicker, hours, minutes])

  const handleTimeSelect = (h, m) => {
    const timeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    onChange({ target: { value: timeString } })
    setShowPicker(false)
  }

  const formatTime = (timeValue) => {
    if (!timeValue) return placeholder
    const [h, m] = timeValue.split(':')
    return `${h}:${m}`
  }

  const generateHours = () => {
    return Array.from({ length: 24 }, (_, i) => i)
  }

  const generateMinutes = () => {
    return Array.from({ length: 60 }, (_, i) => i)
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
        <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span>{formatTime(value)}</span>
      </button>
      {showPicker && (
        <div 
          ref={popupRef}
          className={`absolute z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl p-4 transition-all duration-200 ease-in-out ${
            showAbove ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
          style={{
            animation: showAbove 
              ? 'fadeInSlideUp 0.2s ease-in-out' 
              : 'fadeInSlideDown 0.2s ease-in-out'
          }}
        >
          <div className="flex gap-4 items-start justify-center">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Giờ
              </div>
              <div 
                ref={hoursScrollRef}
                className="time-picker-scroll max-h-64 overflow-y-auto px-2 py-1 flex flex-col gap-0.5"
                style={{
                  scrollBehavior: 'smooth'
                }}
              >
                {generateHours().map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => handleTimeSelect(hour, parseInt(minutes))}
                    className={`w-14 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                      parseInt(hours) === hour
                        ? 'bg-sky-500 dark:bg-sky-600 text-white shadow-md scale-105'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                    }`}
                  >
                    {String(hour).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-2xl font-bold text-gray-400 dark:text-gray-500 pt-8 pb-2">:</div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Phút
              </div>
              <div 
                ref={minutesScrollRef}
                className="time-picker-scroll max-h-64 overflow-y-auto px-2 py-1 flex flex-col gap-0.5"
                style={{
                  scrollBehavior: 'smooth'
                }}
              >
                {generateMinutes().map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    onClick={() => handleTimeSelect(parseInt(hours), minute)}
                    className={`w-14 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                      parseInt(minutes) === minute
                        ? 'bg-sky-500 dark:bg-sky-600 text-white shadow-md scale-105'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                    }`}
                  >
                    {String(minute).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}

export default TimePicker

