import { useRef, useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import useClickOutside from '~/hooks/useClickOutside'

const TimePicker = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'Chọn giờ',
  className = ''
}) => {
  const pickerRef = useRef(null)
  const hoursScrollRef = useRef(null)
  const minutesScrollRef = useRef(null)
  const [showPicker, setShowPicker] = useState(false)
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
        <div className="absolute z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3 min-w-[200px]">
          <div className="flex gap-2 items-center justify-center">
            {/* Hours */}
            <div className="flex flex-col">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 text-center">Giờ</div>
              <div 
                ref={hoursScrollRef}
                className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
              >
                {generateHours().map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => handleTimeSelect(hour, parseInt(minutes))}
                    className={`w-12 py-1.5 text-sm rounded-md transition-colors ${
                      parseInt(hours) === hour
                        ? 'bg-sky-500 dark:bg-sky-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {String(hour).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xl font-semibold text-gray-500 dark:text-gray-400 py-4">:</div>

            {/* Minutes */}
            <div className="flex flex-col">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 text-center">Phút</div>
              <div 
                ref={minutesScrollRef}
                className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
              >
                {generateMinutes().map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    onClick={() => handleTimeSelect(parseInt(hours), minute)}
                    className={`w-12 py-1.5 text-sm rounded-md transition-colors ${
                      parseInt(minutes) === minute
                        ? 'bg-sky-500 dark:bg-sky-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
  )
}

export default TimePicker

