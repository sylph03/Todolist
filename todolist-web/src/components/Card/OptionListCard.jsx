import { CreditCard, MoveRight, Archive, Trash2, Image, CalendarDays, Clock } from 'lucide-react'
import OptionItemCard from './OptionItemCard'
import { useConfirm } from '~/Context/ConfirmProvider'
import { deleteCardDetailsAPI, updateCardDetailsAPI } from '~/apis'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import { singleFileValidator } from '~/utils/validators'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { showActiveCard } from '~/redux/activeCard/activeCardSlice'
import MoveCardPopup from './MoveCardPopup'
import DateRangePopup from './DateRangePopup'
import { useEffect, useRef, useState } from 'react'

const getDateInputValue = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(Number(timestamp))
  if (Number.isNaN(date.getTime())) return ''
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const getDateTimeInputValue = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(Number(timestamp))
  if (Number.isNaN(date.getTime())) return ''
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

const getDateValue = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(Number(timestamp))
  if (Number.isNaN(date.getTime())) return ''
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const getTimeValue = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(Number(timestamp))
  if (Number.isNaN(date.getTime())) return ''
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${min}`
}

const toTimestamp = (value, endOfDay = false) => {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  const date = new Date(year, month - 1, day, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0)
  return date.getTime()
}

const toTimestampFromDateTime = (value) => {
  if (!value) return null
  // Format: YYYY-MM-DDTHH:mm
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.getTime()
}

const toTimestampFromDateAndTime = (dateValue, timeValue) => {
  if (!dateValue) return null
  if (!timeValue) {
    // Nếu không có time, set về cuối ngày
    const [year, month, day] = dateValue.split('-').map(Number)
    if (!year || !month || !day) return null
    const date = new Date(year, month - 1, day, 23, 59, 59, 999)
    return date.getTime()
  }
  // Ghép date và time
  const [year, month, day] = dateValue.split('-').map(Number)
  const [hours, minutes] = timeValue.split(':').map(Number)
  if (!year || !month || !day || hours === undefined || minutes === undefined) return null
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0)
  return date.getTime()
}

const OptionListCard = ({
  card,
  setShowPopup,
  updateCardTitle,
  isLeftPosition,
  setShowMoveCardPopup,
  showMoveCardPopup,
  showDatePicker,
  setShowDatePicker
}) => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const moveButtonRef = useRef(null)
  const dateButtonRef = useRef(null)
  const [isUpdatingDates, setIsUpdatingDates] = useState(false)

  const { confirm } = useConfirm()

  const handleOpenCard = () => {
    dispatch(updateCurrentActiveCard(card))
    dispatch(showActiveCard())
    setShowPopup(false)
  }


  const handleShowMoveCardPopup = () => {
    setShowDatePicker(false)
    setShowMoveCardPopup(prev => !prev) // Cập nhật trạng thái cho TaskCard
  }

  const handleCloseMoveCardPopup = () => {
    setShowMoveCardPopup(false) // Cập nhật trạng thái cho TaskCard
  }

  const handleArchiveCard = async () => {
    const response = await updateCardDetailsAPI(card._id, {
      isArchived: true,
      archivedAt: Date.now()
    })
    if (response) {
      // Cập nhật card trong board
      dispatch(updateCardInBoard(response))
      
      // Tạo board mới với dữ liệu đã cập nhật
      const newBoard = cloneDeep(board)
      const targetColumn = newBoard.columns.find(column => column.cardOrderIds.includes(card._id))
      
      if (targetColumn) {
        // Cập nhật card trong targetColumn với dữ liệu mới
        const cardIndex = targetColumn.cards.findIndex(c => c._id === card._id)
        if (cardIndex !== -1) {
          targetColumn.cards[cardIndex] = { ...targetColumn.cards[cardIndex], isArchived: true, archivedAt: Date.now() }
        }
        
        // Đếm số active cards (không archived, không placeholder) với dữ liệu mới
        const activeCards = targetColumn.cards.filter(c => !c.isArchived && !c.FE_PlaceholderCard)
        
        // Nếu không còn active cards nào, thêm placeholder
        if (activeCards.length === 0) {
          const placeholderCard = generatePlaceholderCard(targetColumn)
          targetColumn.cards.push(placeholderCard)
          targetColumn.cardOrderIds.push(placeholderCard._id)
          
          // Cập nhật board với placeholder
          dispatch(updateCurrentActiveBoard(newBoard))
        }
      }
      
      toast.success('Đã lưu trữ nhiệm vụ!')
      setShowPopup(false)
    }
  }

  // mặc dù khi lưu trữ nhiệm vụ, thẻ không hiện thị những để đây vẫn có thể khôi phục
  const handleUnarchiveCard = async () => {
    // Kiểm tra WIP limit trước khi khôi phục
    if (board?.wipEnabled) {
      const targetColumn = board.columns.find(column => column.cardOrderIds.includes(card._id))
      if (targetColumn) {
        // Đếm số active cards hiện tại (không archived, không placeholder)
        const currentActiveCards = targetColumn.cards.filter(c => !c.isArchived && !c.FE_PlaceholderCard)
        const wipLimit = board?.wipLimit || 5
        
        // Nếu column đã đạt WIP limit, không cho phép khôi phục
        if (currentActiveCards.length >= wipLimit) {
          toast.error(`Không thể khôi phục nhiệm vụ! Cột "${targetColumn.title}" đã đạt giới hạn WIP (${currentActiveCards.length}/${wipLimit})`)
          return
        }
      }
    }

    const response = await updateCardDetailsAPI(card._id, {
      isArchived: false,
      archivedAt: null
    })
    if (response) {
      // Cập nhật card trong board
      dispatch(updateCardInBoard(response))
      
      // Tạo board mới với dữ liệu đã cập nhật
      const newBoard = cloneDeep(board)
      const targetColumn = newBoard.columns.find(column => column.cardOrderIds.includes(card._id))
      
      if (targetColumn) {
        // Cập nhật card trong targetColumn với dữ liệu mới
        const cardIndex = targetColumn.cards.findIndex(c => c._id === card._id)
        if (cardIndex !== -1) {
          targetColumn.cards[cardIndex] = { ...targetColumn.cards[cardIndex], isArchived: false, archivedAt: null }
        }
        
        // Xóa FE_PlaceholderCard nếu có (vì đã có active card)
        targetColumn.cards = targetColumn.cards.filter(c => !c.FE_PlaceholderCard)
        targetColumn.cardOrderIds = targetColumn.cardOrderIds.filter(id => !id.includes('placeholder'))
        
        // Cập nhật board
        dispatch(updateCurrentActiveBoard(newBoard))
      }
      
      toast.success('Đã khôi phục nhiệm vụ!')
      setShowPopup(false)
    }
  }

  const onUpdateCardCover = (event) => {
    const error = singleFileValidator(event.target.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target.files[0])

    // Gọi API
    toast.promise(
      updateCardDetailsAPI(card._id, reqData)
        .then(res => {
          // Cập nhật lại bản ghi card trong activeBoard (nested data)
          dispatch(updateCardInBoard(res))
        })
        .finally(() => event.target.value = ''),
      { pending: 'Đang cập nhật ảnh bìa...' }
    )
  }

  const handleDeleteCard = async () => {
    const result = await confirm({
      title: 'Xoá nhiệm vụ',
      message: 'Hành động này sẽ xóa vĩnh viễn nhiệm vụ của bạn! Bạn có chắc chắn không?',
      modal: true
    })
    if (result) {
      // Cannot assign to read only property 'cards' of object
      // Trường hợp Immutability ở đây đã đụng tới giá trị cards đang được coi là chỉ đọc read only (nested object - can thiệp sâu dữ liệu)
      // const newBoard = { ...board }
      const newBoard = cloneDeep(board)
      const targetColumn = newBoard.columns.find(column => column.cardOrderIds.includes(card._id))

      if (targetColumn) {
        targetColumn.cards = targetColumn.cards.filter(c => c._id !== card._id)
        targetColumn.cardOrderIds = targetColumn.cardOrderIds.filter(_id => _id !== card._id)

        if (isEmpty(targetColumn.cards)) {
          const placeholderCard = generatePlaceholderCard(targetColumn)
          targetColumn.cards = [placeholderCard]
          targetColumn.cardOrderIds = [placeholderCard._id]
        }
        // setBoard(newBoard)
        dispatch(updateCurrentActiveBoard(newBoard))
      }

      deleteCardDetailsAPI(card._id).then(res => {
        toast.success(res?.deleteResult)
      })
    } else {
      console.log('Hủy xóa!')
    }
  }

  const toggleDatePicker = () => {
    setShowMoveCardPopup(false)
    setShowDatePicker(prev => !prev)
  }

  const handleUpdateDates = async (payload, successMessage) => {
    setIsUpdatingDates(true)
    try {
      const response = await updateCardDetailsAPI(card._id, payload)
      dispatch(updateCardInBoard(response))
      toast.success(successMessage)
    } catch (error) {
      console.error(error)
      toast.error('Cập nhật ngày thất bại!')
    } finally {
      setIsUpdatingDates(false)
    }
  }

  const handleStartDateChange = async (event) => {
    const value = event.target.value
    const timestamp = value ? toTimestamp(value) : null
    const currentDue = card?.dueDate ? Number(card.dueDate) : null
    if (timestamp && currentDue && timestamp > currentDue) {
      toast.error('Ngày bắt đầu không thể sau hạn hoàn thành hiện tại!')
      return
    }
    await handleUpdateDates({ startDate: timestamp }, timestamp ? 'Đã cập nhật ngày bắt đầu!' : 'Đã xoá ngày bắt đầu!')
  }

  const handleDueDateChange = async (dateValue, timeValue) => {
    const timestamp = toTimestampFromDateAndTime(dateValue, timeValue)
    const currentStart = card?.startDate ? Number(card.startDate) : null
    if (timestamp && currentStart && timestamp < currentStart) {
      toast.error('Hạn hoàn thành không thể trước ngày bắt đầu!')
      return
    }
    await handleUpdateDates({ dueDate: timestamp }, timestamp ? 'Đã cập nhật hạn hoàn thành!' : 'Đã xoá hạn hoàn thành!')
  }

  const handleClearDates = async () => {
    if (!card?.startDate && !card?.dueDate) return
    await handleUpdateDates({ startDate: null, dueDate: null }, 'Đã xoá bộ ngày!')
  }

  useEffect(() => {
    if (!showDatePicker) return
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowDatePicker(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showDatePicker])

  const options = [
    { icon: <CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-300" />, label: 'Mở thẻ', onClick: handleOpenCard },
    { icon: <MoveRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />, label: 'Di chuyển', onClick: handleShowMoveCardPopup },
    { 
      icon: <Archive className="w-4 h-4 text-gray-600 dark:text-gray-300" />, 
      label: card.isArchived ? 'Khôi phục' : 'Lưu trữ', 
      onClick: card.isArchived ? handleUnarchiveCard : handleArchiveCard 
    },
    { icon: <CalendarDays className="w-4 h-4 text-gray-600 dark:text-gray-300" />, label: 'Ngày', onClick: toggleDatePicker },
    { icon: <Image className="w-4 h-4 text-gray-600 dark:text-gray-300" />, label: 'Ảnh bìa', onClick: onUpdateCardCover, isFileUpload: true },
    { icon: <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />, label: 'Xóa', onClick: handleDeleteCard, isDanger: true }
  ]

  return (
    <div className="flex flex-col gap-2">
      {options.map((item, index) => {
        const itemRef =
          item.label === 'Di chuyển'
            ? moveButtonRef
            : item.label === 'Ngày'
              ? dateButtonRef
              : null
        const isActive =
          item.label === 'Di chuyển'
            ? showMoveCardPopup
            : item.label === 'Ngày'
              ? showDatePicker
              : false
        return (
          <OptionItemCard
            key={index}
            icon={item.icon}
            label={item.label}
            isDanger={item.isDanger}
            onClick={item.onClick}
            isFileUpload={item.isFileUpload}
            isLeftPosition={isLeftPosition}
            ref={itemRef}
            isActive={isActive}
          />
        )
      })}

      {showDatePicker && (
        <DateRangePopup
          anchorRef={dateButtonRef}
          onClose={() => setShowDatePicker(false)}
          card={card}
          isUpdating={isUpdatingDates}
          onStartDateChange={handleStartDateChange}
          onDueDateChange={handleDueDateChange}
          onClearDates={handleClearDates}
          startDateValue={getDateInputValue(card?.startDate)}
          dueDateValue={getDateValue(card?.dueDate)}
          dueTimeValue={getTimeValue(card?.dueDate)}
        />
      )}

      <div
        onClick={updateCardTitle}
        className={`flex items-center justify-center px-4 py-2 rounded-md ${isLeftPosition ? 'ml-auto' : ''} font-medium cursor-pointer
                   bg-sky-500 hover:bg-sky-600 text-white
                   w-fit transition-all duration-200 ease-in-out
                   shadow-sm hover:shadow-md dark:shadow-gray-900/50
                   dark:border dark:border-gray-700`}
      >
        Lưu
      </div>

      {/* Popup move card */}
      {showMoveCardPopup && (
        <MoveCardPopup
          onClose={handleCloseMoveCardPopup}
          board={board}
          card={card}
          moveButtonRef={moveButtonRef}
          setShowPopup={setShowPopup}
        />
      )}
    </div>
  )
}

export default OptionListCard
