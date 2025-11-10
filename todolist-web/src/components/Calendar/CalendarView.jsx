import React, { useState, useMemo, useRef, useEffect } from 'react'
import { createEventAPI, getEventsAPI, updateEventAPI, deleteEventAPI } from '~/apis'
import { useConfirm } from '~/Context/ConfirmProvider'
import { MoveLeft, ChevronLeft , ChevronRight, Plus, X, LayoutGrid, Calendar as CalendarIcon, Clock, ArrowRight, ExternalLink, Trash2, Edit3, Save, CalendarDays, MapPin, Users, Tag, AlertCircle, CheckCircle2, MoreVertical, ChevronDown, ChevronUp, Check, Palette } from 'lucide-react'
import ColorPickerPopup, { colorOptions } from '~/components/Project/ColorPickerPopup'
import useClickOutside from '~/hooks/useClickOutside'

const CalendarView = ({ boards = [] }) => {
  const { confirm } = useConfirm()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false)
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [selectedBoard, setSelectedBoard] = useState(null)
  const [eventTitle, setEventTitle] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [eventColor, setEventColor] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const pickerRef = useRef(null)
  const addEventModalRef = useRef(null)
  const dayEventsModalRef = useRef(null)
  const eventDetailModalRef = useRef(null)
  // Modal xem tất cả sự kiện trong ngày
  const [showDayEventsModal, setShowDayEventsModal] = useState(false)
  const [modalDayEvents, setModalDayEvents] = useState([])
  const [modalDay, setModalDay] = useState(null)
  // Modal chi tiết sự kiện (editable)
  const [showEventDetailModal, setShowEventDetailModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [detailTitle, setDetailTitle] = useState('')
  const [detailTime, setDetailTime] = useState('')
  const [detailDescription, setDetailDescription] = useState('')
  const [detailColor, setDetailColor] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showAddEventColorPicker, setShowAddEventColorPicker] = useState(false)
  const [colorPickerPosition, setColorPickerPosition] = useState(null)
  const [addEventColorPickerPosition, setAddEventColorPickerPosition] = useState(null)
  const colorButtonRef = useRef(null)
  const colorPickerRef = useRef(null)
  const addEventColorButtonRef = useRef(null)
  // Track which event is displayed for each day (dateString -> eventId)
  // Load from localStorage on mount
  const [displayedEventId, setDisplayedEventId] = useState(() => {
    try {
      const saved = localStorage.getItem('calendar_displayed_event_id')
      return saved ? JSON.parse(saved) : {}
    } catch (e) {
      return {}
    }
  })

  // Save to localStorage whenever displayedEventId changes
  useEffect(() => {
    try {
      localStorage.setItem('calendar_displayed_event_id', JSON.stringify(displayedEventId))
    } catch (e) {
      console.error('Failed to save displayedEventId to localStorage:', e)
    }
  }, [displayedEventId])

  // Chuẩn hóa id (string | {$oid})
  const getIdString = (val) => {
    if (!val) return ''
    if (typeof val === 'string') return val
    if (typeof val === 'object' && val.$oid) return val.$oid
    if (typeof val === 'object' && val.toString) return val.toString()
    try { 
      const str = String(val)
      return str
    } catch (e) { 
      console.error('getIdString error:', e, 'for value:', val)
      return '' 
    }
  }
  // Parse "9:00 AM - 10:30 AM" or "09:00-10:30" into Date ranges on selectedDate
  const parseTimeRangeOnDate = (date, input) => {
    if (!input || !input.trim()) return { startAt: new Date(date), endAt: null, allDay: true }
    const normalized = input.replace(/\s+/g, ' ').trim()
    const [startStr, endStr] = normalized.split(/\s*-\s*/)

    const toDate = (baseDate, timeStr) => {
      if (!timeStr) return null
      // Handle AM/PM
      const ampmMatch = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i)
      let hours, minutes
      if (ampmMatch) {
        hours = parseInt(ampmMatch[1], 10)
        minutes = parseInt(ampmMatch[2] || '0', 10)
        const isPM = /PM/i.test(ampmMatch[3])
        if (hours === 12) hours = isPM ? 12 : 0
        else if (isPM) hours += 12
      } else {
        const m = timeStr.match(/(\d{1,2})(?::(\d{2}))?/)
        hours = parseInt(m?.[1] || '0', 10)
        minutes = parseInt(m?.[2] || '0', 10)
      }
      const d = new Date(baseDate)
      d.setHours(hours, minutes, 0, 0)
      return d
    }

    const startAt = toDate(date, startStr)
    const endAt = toDate(date, endStr)
    if (!startAt) return { startAt: new Date(date), endAt: null, allDay: true }
    return { startAt, endAt: endAt || null, allDay: false }
  }


  // Lấy thông tin tháng hiện tại
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Events từ API
  const [events, setEvents] = useState([])

  // Tạo lịch cho tháng hiện tại
  const calendarData = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7 // Chuyển từ CN=0 sang T2=0
    const daysInMonth = lastDayOfMonth.getDate()
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

    const days = []

    // Thêm ngày từ tháng trước
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      days.push({
        date: new Date(currentYear, currentMonth - 1, day),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      })
    }

    // Thêm ngày trong tháng hiện tại
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const isToday = date.toDateString() === new Date().toDateString()
      const isSelected = date.toDateString() === selectedDate.toDateString()

      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        isSelected
      })
    }

    // Thêm ngày từ tháng sau để đủ 6 tuần
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, day),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      })
    }

    return days
  }, [currentMonth, currentYear, selectedDate])

  // Lấy sự kiện cho một ngày cụ thể
  const getEventsForDate = (date) => {
    return events.filter((evt) => {
      const start = new Date(evt.startAt)
      const end = evt.endAt ? new Date(evt.endAt) : start
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const s = new Date(start.getFullYear(), start.getMonth(), start.getDate())
      const e = new Date(end.getFullYear(), end.getMonth(), end.getDate())
      return d >= s && d <= e
    })
  }

  // Chuyển tháng
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  // Xử lý thêm sự kiện
  const handleAddEvent = () => {
    setShowAddEventModal(true)
  }

  const handleCloseModal = () => {
    setShowAddEventModal(false)
    setSelectedBoard(null)
    setEventTitle('')
    setEventDescription('')
    setEventColor('')
    setStartTime('09:00')
    setEndTime('10:00')
    setShowAddEventColorPicker(false)
    setAddEventColorPickerPosition(null)
  }

  const handleSelectBoard = (board) => {
    setSelectedBoard(board)
    // Tự động chuyển sang bước tiếp theo sau khi chọn board
  }




  const handleOpenEventDetail = (event) => {
    setSelectedEvent(event)
    setDetailTitle(event.title || '')
    setDetailTime(event.timeText || '')
    setDetailDescription(event.description || '')
    setDetailColor(event.color || '')
    setIsEditing(false)
    setIsSaving(false)
    setShowColorPicker(false)
    setColorPickerPosition(null)
    setShowEventDetailModal(true)
  }

  const handleCloseEventDetail = () => {
    setShowEventDetailModal(false)
    setSelectedEvent(null)
    setDetailTitle('')
    setDetailTime('')
    setDetailDescription('')
    setDetailColor('')
    setIsEditing(false)
    setIsSaving(false)
    setShowColorPicker(false)
    setColorPickerPosition(null)
  }

  const handleSaveEvent = async () => {
    if (!selectedEvent) return
    
    setIsSaving(true)
    try {
      const eventId = getIdString(selectedEvent._id)
      
      const updates = {}
      
      if (detailTitle !== selectedEvent.title) {
        updates.title = detailTitle
      }
      
      if (detailTime !== (selectedEvent.timeText || '')) {
        updates.timeText = detailTime
        const baseDate = new Date(selectedEvent.startAt)
        const { startAt, endAt, allDay } = parseTimeRangeOnDate(baseDate, detailTime)
        updates.startAt = startAt ? startAt.getTime() : null
        updates.endAt = endAt ? endAt.getTime() : null
        updates.allDay = allDay
      }
      
      if (detailDescription !== (selectedEvent.description || '')) {
        updates.description = detailDescription
      }
      
      if (detailColor !== (selectedEvent.color || '')) {
        updates.color = detailColor
      }
      
      if (Object.keys(updates).length > 0) {
        const result = await updateEventAPI(eventId, updates)
        setSelectedEvent({ ...selectedEvent, ...updates })
        setEvents(prev => prev.map(e => 
          getIdString(e._id) === eventId 
            ? { ...e, ...updates }
            : e
        ))
      }
      
      setIsEditing(false)
    } catch (e) {
      console.error('Save event failed', e)
      console.error('Event ID that failed:', getIdString(selectedEvent._id))
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmitEvent = async () => {
    if (!selectedBoard || !eventTitle || !startTime || !endTime) return
    try {
      const timeText = `${startTime} - ${endTime}`
      const { startAt, endAt, allDay } = parseTimeRangeOnDate(selectedDate, timeText)
      
      // Convert Date objects to timestamps (milliseconds)
      const payload = {
        boardId: selectedBoard._id,
        title: eventTitle,
        description: eventDescription || '',
        color: eventColor || '',
        timeText,
        startAt: startAt ? startAt.getTime() : null,
        endAt: endAt ? endAt.getTime() : null,
        allDay
      }
      
      const created = await createEventAPI(payload)
      setEvents((prev) => [...prev, created])
      handleCloseModal()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Create event failed', e)
    }
  }

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ]

  const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN']

  // Use click outside hook for month/year picker
  useClickOutside(pickerRef, () => {
    if (showMonthYearPicker) {
      setShowMonthYearPicker(false)
    }
  })

  // Use click outside hook for add event modal
  useClickOutside(addEventModalRef, () => {
    if (showAddEventModal) {
      handleCloseModal()
    }
  })

  // Use click outside hook for day events modal
  useClickOutside(dayEventsModalRef, () => {
    if (showDayEventsModal) {
      setShowDayEventsModal(false)
      setModalDayEvents([])
      setModalDay(null)
    }
  })

  // Use click outside hook for event detail modal
  useClickOutside(eventDetailModalRef, () => {
    if (showEventDetailModal && !isEditing) {
      handleCloseEventDetail()
    }
  })

  // Xử lý click outside cho color picker
  useEffect(() => {
    if (!showColorPicker) return

    const handleClickOutside = (e) => {
      // Không đóng nếu click vào color picker popup
      if (e.target.closest('.color-picker-popup')) {
        return
      }
      // Không đóng nếu click vào button mở color picker
      if (colorButtonRef.current?.contains(e.target)) {
        return
      }
      // Không đóng nếu click vào chính color picker (qua ref)
      if (colorPickerRef.current?.contains(e.target)) {
        return
      }
      // Các trường hợp khác thì đóng
      setShowColorPicker(false)
    }

    // Sử dụng setTimeout để đảm bảo event listener được thêm sau khi DOM được render
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showColorPicker])

  // Xử lý click outside cho color picker (add event modal)
  useEffect(() => {
    if (!showAddEventColorPicker) return

    const handleClickOutside = (e) => {
      if (e.target.closest('.color-picker-popup')) return
      if (addEventColorButtonRef.current?.contains(e.target)) return
      if (colorPickerRef.current?.contains(e.target)) return
      setShowAddEventColorPicker(false)
    }

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAddEventColorPicker])

  // Cập nhật vị trí color picker khi scroll trong modal
  useEffect(() => {
    if (!showColorPicker || !colorButtonRef.current || !showEventDetailModal) return

    const updatePosition = () => {
      if (colorButtonRef.current) {
        const button = colorButtonRef.current
        const rect = button.getBoundingClientRect()

        const top = rect.bottom + 8
        const left = rect.left

        setColorPickerPosition(prev => {
          if (prev?.top !== top || prev?.left !== left) {
            return { top, left }
          }
          return prev
        })
      }
    }

    // Cập nhật khi scroll trong modal
    const modalElement = document.querySelector('.event-detail-modal')
    if (modalElement) {
      modalElement.addEventListener('scroll', updatePosition)
    }

    // Cập nhật khi scroll window
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      if (modalElement) {
        modalElement.removeEventListener('scroll', updatePosition)
      }
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [showColorPicker, showEventDetailModal])

  // Fetch events theo tháng đang hiển thị
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const monthStart = new Date(currentYear, currentMonth, 1)
        const monthEnd = new Date(currentYear, currentMonth + 1, 0)
        const eventsData = await getEventsAPI({
          from: monthStart.toISOString(),
          to: new Date(monthEnd.getFullYear(), monthEnd.getMonth(), monthEnd.getDate(), 23, 59, 59, 999).toISOString()
        })
        setEvents(Array.isArray(eventsData) ? eventsData : [])
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Fetch events failed', e)
        setEvents([])
      }
    }
    fetchEvents()
  }, [currentMonth, currentYear])

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousMonth}
                className="w-9 h-9 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-sm"
                aria-label="Tháng trước"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={goToNextMonth}
                className="w-9 h-9 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-sm"
                aria-label="Tháng sau"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div className="flex items-center gap-2 relative" ref={pickerRef}>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Chọn năm"
              >
                {showMonthYearPicker ? (
                  <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                )}
              </button>

              {showMonthYearPicker && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md z-50 p-2 min-w-[140px] max-h-72 overflow-y-auto">
                  <div className="space-y-1">
                    {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          setCurrentDate(new Date(year, currentMonth, 1))
                          setShowMonthYearPicker(false)
                        }}
                        className={`w-full px-4 py-2.5 text-sm rounded-lg transition-all duration-200 text-left ${
                          year === currentYear
                            ? 'bg-sky-500 text-white shadow-sm font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={goToToday}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-sm flex-1 sm:flex-none"
            >
              Hôm nay
            </button>
            <button
              onClick={handleAddEvent}
              className="bg-sky-500 text-white px-5 py-2.5 rounded-lg hover:bg-sky-600 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md font-medium flex-1 sm:flex-none justify-center"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Thêm sự kiện</span>
              <span className="sm:hidden">Thêm</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          {dayNames.map((day, idx) => (
            <div 
              key={day} 
              className={`p-4 text-center text-sm font-semibold ${
                idx === 6 
                  ? 'text-red-500 dark:text-red-400' 
                  : 'text-gray-600 dark:text-gray-400'
              } bg-gray-50 dark:bg-gray-700/50`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarData.map((day, index) => {
            const dayEvents = getEventsForDate(day.date)
            const isCurrentMonth = day.isCurrentMonth
            const isToday = day.isToday
            const isSelected = day.isSelected
            const dateKey = day.date.toISOString().split('T')[0]
            const selectedEventId = displayedEventId[dateKey]
            // Find displayed event: either selected one or first event
            const displayedEvent = dayEvents.find(e => getIdString(e._id) === selectedEventId) || dayEvents[0]

            return (
              <div
                key={index}
                className={`min-h-[120px] md:min-h-[140px] border-r border-b border-gray-200 dark:border-gray-700 p-3 cursor-pointer transition-all duration-200 ${
                  isCurrentMonth 
                    ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30' 
                    : 'bg-gray-50/50 dark:bg-gray-900/50 opacity-60'
                } ${
                  isToday 
                    ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-400 dark:ring-blue-600' 
                    : ''
                } ${
                  isSelected && !isToday
                    ? 'ring-2 ring-sky-500 dark:ring-sky-400 bg-sky-50 dark:bg-sky-900/20' 
                    : ''
                }`}
                onClick={() => setSelectedDate(day.date)}
              >
                <div className={`text-sm font-semibold mb-2.5 flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
                  isCurrentMonth
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-600'
                } ${
                  isToday 
                    ? 'bg-sky-500 text-white shadow-sm' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}>
                  {day.date.getDate()}
                </div>

                <div className="space-y-1.5">
                  {displayedEvent && (
                    <div
                      key={displayedEvent._id}
                      className={`text-xs p-2 rounded-md truncate cursor-pointer transition-all duration-200 hover:shadow-sm border-l ${
                        displayedEvent.color
                          ? `${displayedEvent.color} text-gray-800 dark:text-gray-200 border-gray-400 dark:border-gray-500`
                          : 'bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-200 border-sky-500 dark:border-sky-400'
                      }`}
                      title={`${displayedEvent.title} - ${displayedEvent.timeText || 'Cả ngày'}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenEventDetail(displayedEvent)
                      }}
                    >
                      <span className="font-medium">{displayedEvent.title}</span>
                      {displayedEvent.timeText && (
                        <span className="block text-[10px] mt-0.5 opacity-75 truncate">
                          {displayedEvent.timeText}
                        </span>
                      )}
                    </div>
                  )}
                  {dayEvents.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setModalDayEvents(dayEvents)
                        setModalDay(day.date)
                        setShowDayEventsModal(true)
                      }}
                      className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:text-sky-700 dark:hover:text-sky-300 transition-colors px-1.5 py-0.5 rounded hover:bg-sky-50 dark:hover:bg-sky-900/20"
                    >
                      +{dayEvents.length - 1} sự kiện
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showAddEventModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div ref={addEventModalRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-fadeInDown">
            {/* Modal Header */}
            <div className="relative bg-sky-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Thêm sự kiện mới</h3>
                    <p className="text-sm text-sky-100 mt-0.5">Tạo sự kiện cho board của bạn</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  aria-label="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto flex-1">
              {!selectedBoard ? (
                /* Bước 1: Chọn Board */
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    <LayoutGrid className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    Chọn Board
                  </label>
                  {!boards || boards.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <LayoutGrid className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-semibold">Chưa có board nào</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Tạo board mới để thêm sự kiện</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {boards.map((board) => (
                      <button
                        key={board._id}
                        onClick={() => handleSelectBoard(board)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                            selectedBoard?._id === board._id
                              ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 shadow-sm ring-1 ring-sky-200 dark:ring-sky-800'
                              : 'border-gray-200 dark:border-gray-600 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-5 h-5 rounded-full flex-shrink-0 shadow-sm ring-2 ring-white dark:ring-gray-700"
                              style={{ backgroundColor: board.backgroundColor || '#3b82f6' }}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                {board.title}
                              </h4>
                              {board.description && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                  {board.description}
                                </p>
                              )}
                            </div>
                            {selectedBoard?._id === board._id && (
                              <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center shadow-sm">
                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Bước 2: Điền thông tin sự kiện */
                <div className="space-y-6">
                  {/* Hiển thị board đã chọn */}
                  <div className="p-3 bg-sky-50 dark:bg-sky-900/20 rounded-xl border border-sky-200 dark:border-sky-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: selectedBoard.backgroundColor || '#3b82f6' }}
                        ></div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Board đã chọn</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedBoard.title}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedBoard(null)}
                        className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium"
                      >
                        Thay đổi
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      <Tag className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      Tiêu đề sự kiện
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      placeholder="Nhập tiêu đề sự kiện..."
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-1 focus:ring-sky-400/50 focus:border-sky-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        Thời gian bắt đầu
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-1 focus:ring-sky-400/50 focus:border-sky-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        Thời gian kết thúc
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-1 focus:ring-sky-400/50 focus:border-sky-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      <CalendarIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      Ngày
                    </label>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2 font-medium">
                        <CalendarIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        <span>
                          {selectedDate.toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      <Edit3 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      Mô tả
                    </label>
                    <textarea
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      placeholder="Nhập mô tả sự kiện (tùy chọn)..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-1 focus:ring-sky-400/50 focus:border-sky-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 resize-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      <Palette className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      Màu nền
                    </label>
                    <button
                      type="button"
                      ref={addEventColorButtonRef}
                      onClick={() => {
                        if (!showAddEventColorPicker && addEventColorButtonRef.current) {
                          const button = addEventColorButtonRef.current
                          const rect = button.getBoundingClientRect()
                          const top = rect.bottom + 8
                          const left = rect.left
                          setAddEventColorPickerPosition({ top, left })
                        }
                        setShowAddEventColorPicker(!showAddEventColorPicker)
                      }}
                      className={`w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 hover:border-sky-500 dark:hover:border-sky-500 transition-all duration-200 ${
                        showAddEventColorPicker ? 'border-sky-500 dark:border-sky-500' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-md ${eventColor || 'bg-sky-100 dark:bg-sky-900/30'}`}></span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {eventColor ? colorOptions.find(c => c.value === eventColor)?.name || 'Tùy chỉnh' : 'Mặc định (Sky)'}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${showAddEventColorPicker ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              {!selectedBoard ? (
                /* Footer khi chọn board */
                <div className="w-full flex justify-end">
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-sm"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                /* Footer khi điền thông tin */
                <>
                    <button
                      onClick={() => setSelectedBoard(null)}
                      className="group flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-transparent rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                    >
                      <MoveLeft className="w-4 h-4 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors duration-200" />
                      <span className="group-hover:text-sky-500 dark:group-hover:text-sky-400 group-hover:underline transition-all duration-200">Quay lại</span>
                    </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCloseModal}
                      className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-sm"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSubmitEvent}
                      disabled={!eventTitle || !startTime || !endTime}
                      className="px-6 py-3 text-sm font-semibold text-white bg-sky-500 rounded-xl hover:bg-sky-600 disabled:bg-sky-200 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none"
                    >
                      Thêm sự kiện
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showDayEventsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div ref={dayEventsModalRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-md w-full overflow-hidden flex flex-col animate-fadeInDown">
            {/* Modal Header */}
            <div className="relative bg-sky-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Sự kiện trong ngày</h3>
                    {modalDay && (
                      <p className="text-sm text-sky-100 mt-0.5">
                        {modalDay.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowDayEventsModal(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  aria-label="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Events List */}
            <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
              {modalDayEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarDays className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Không có sự kiện nào</p>
                </div>
              ) : (
                modalDayEvents.map((evt) => {
                  const dateKey = modalDay ? modalDay.toISOString().split('T')[0] : ''
                  const isDisplayed = displayedEventId[dateKey] === getIdString(evt._id)
                  return (
                    <div
                      key={evt._id}
                      className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:border-sky-400 dark:hover:border-sky-600 hover:shadow-sm transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (dateKey) {
                              setDisplayedEventId(prev => ({
                                ...prev,
                                [dateKey]: getIdString(evt._id)
                              }))
                            }
                          }}
                          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isDisplayed
                              ? 'bg-sky-500 border-sky-500'
                              : 'border-gray-300 dark:border-gray-600 hover:border-sky-400 dark:hover:border-sky-500'
                          }`}
                          title={isDisplayed ? 'Đang hiển thị' : 'Chọn để hiển thị'}
                        >
                          {isDisplayed && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </button>
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => {
                            setShowDayEventsModal(false)
                            handleOpenEventDetail(evt)
                          }}
                        >
                          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{evt.title}</div>
                          {evt.timeText && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{evt.timeText}</span>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowDayEventsModal(false)
                            handleOpenEventDetail(evt)
                          }}
                          className="flex-shrink-0 mt-1"
                        >
                          <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors" />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}

      {showEventDetailModal && selectedEvent && (
        <div className="fixed inset-0 h-full bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div ref={eventDetailModalRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-fadeInDown event-detail-modal">
            {/* Header */}
            <div className="relative bg-sky-500 p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Chi tiết sự kiện</h3>
                    <p className="text-sky-100 text-sm mt-0.5">Quản lý thông tin sự kiện</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                    title={isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
                    aria-label={isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCloseEventDetail}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                    title="Đóng"
                    aria-label="Đóng"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto flex-1 min-h-0">
              {/* Event Title */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Tag className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  Tiêu đề sự kiện
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={detailTitle}
                    onChange={(e) => setDetailTitle(e.target.value)}
                    placeholder="Nhập tiêu đề sự kiện..."
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-1 focus:ring-sky-400/50 focus:border-sky-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedEvent.title || 'Chưa có tiêu đề'}
                    </h4>
                  </div>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <CalendarIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    Ngày
                  </label>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(selectedEvent.startAt).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    Thời gian
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={detailTime}
                      onChange={(e) => setDetailTime(e.target.value)}
                      placeholder="VD: 9:00 AM - 10:30 AM"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-1 focus:ring-sky-400/50 focus:border-sky-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedEvent.timeText || 'Cả ngày'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Status Indicators */}
              <div className="flex items-center gap-3 flex-wrap">
                {selectedEvent.allDay && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">Cả ngày</span>
                  </div>
                )}
                {selectedEvent.recurring && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-semibold">Lặp lại</span>
                  </div>
                )}
              </div>

              {/* Event Color */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Palette className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  Màu nền
                </label>
                {isEditing ? (
                  <button
                    type="button"
                    ref={colorButtonRef}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!showColorPicker && colorButtonRef.current) {
                        const button = colorButtonRef.current
                        const rect = button.getBoundingClientRect()

                        // Popup hiển thị ngay dưới input và sát bên trái
                        const top = rect.bottom + 8
                        const left = rect.left

                        setColorPickerPosition({ top, left })
                      }
                      setShowColorPicker(!showColorPicker)
                    }}
                    className={`w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 hover:border-sky-500 dark:hover:border-sky-500 transition-all duration-200 ${
                      showColorPicker ? 'border-sky-500 dark:border-sky-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-md ${detailColor || 'bg-sky-100'}`}></span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {detailColor ? colorOptions.find(c => c.value === detailColor)?.name || 'Tùy chỉnh' : 'Mặc định (Sky)'}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${showColorPicker ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-md ${selectedEvent.color || 'bg-sky-100'}`}></span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedEvent.color ? colorOptions.find(c => c.value === selectedEvent.color)?.name || 'Tùy chỉnh' : 'Mặc định (Sky)'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {/* Description */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Edit3 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  Mô tả
                </label>
                {isEditing ? (
                  <textarea
                    value={detailDescription}
                    onChange={(e) => setDetailDescription(e.target.value)}
                    placeholder="Nhập mô tả sự kiện..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-1 focus:ring-sky-400/50 focus:border-sky-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 resize-none"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl min-h-[100px] border border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                      {selectedEvent.description || 'Chưa có mô tả'}
                    </p>
                  </div>
                )}
              </div>

              {/* Board Information */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <LayoutGrid className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  Thuộc Board
                </label>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 shadow-sm ring-2 ring-white dark:ring-gray-700"
                        style={{ 
                          backgroundColor: boards.find(b => getIdString(b._id) === getIdString(selectedEvent.boardId))?.backgroundColor || '#3b82f6' 
                        }}
                      ></div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {(() => {
                          const boardId = getIdString(selectedEvent.boardId)
                          const board = boards.find(b => getIdString(b._id) === boardId)
                          return board?.title || 'Board không xác định'
                        })()}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const boardId = getIdString(selectedEvent.boardId)
                        if (boardId) window.location.href = `/boards/${boardId}`
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-all duration-200 hover:shadow-sm flex-shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Mở Board
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <button
                onClick={async () => {
                  const result = await confirm({
                    title: 'Xóa sự kiện',
                    message: 'Bạn có chắc chắn muốn xóa sự kiện này? Hành động này không thể hoàn tác.',
                    modal: true
                  })

                  if (result) {
                    try {
                      const id = getIdString(selectedEvent._id)
                      await deleteEventAPI(id)
                      setEvents(prev => prev.filter(e => getIdString(e._id) !== id))
                      handleCloseEventDetail()
                    } catch (e) { 
                      console.error('Delete event failed', e) 
                    }
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 hover:shadow-sm border border-red-200 dark:border-red-900"
              >
                <Trash2 className="w-4 h-4" />
                Xóa sự kiện
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCloseEventDetail}
                  className="px-6 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-sm"
                >
                  Đóng
                </button>
                {isEditing && (
                  <button
                    onClick={handleSaveEvent}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-sky-500 rounded-xl hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Color Picker Popup (Event Detail Modal) */}
      {showColorPicker && (
        <ColorPickerPopup
          ref={colorPickerRef}
          position={colorPickerPosition}
          selectedColor={detailColor}
          onColorChange={(color) => {
            setDetailColor(color)
            setShowColorPicker(false)
          }}
        />
      )}

      {/* Color Picker Popup (Add Event Modal) */}
      {showAddEventColorPicker && (
        <ColorPickerPopup
          ref={colorPickerRef}
          position={addEventColorPickerPosition}
          selectedColor={eventColor}
          onColorChange={(color) => {
            setEventColor(color)
            setShowAddEventColorPicker(false)
          }}
        />
      )}
    </div>
  )
}

export default CalendarView
