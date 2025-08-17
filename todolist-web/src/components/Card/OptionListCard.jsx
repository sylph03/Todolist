import { CreditCard, MoveRight, Archive, Trash2, Image } from 'lucide-react'
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
import { useRef } from 'react'

const OptionListCard = ({ card, setShowPopup, updateCardTitle, isLeftPosition, setShowMoveCardPopup, showMoveCardPopup }) => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const moveButtonRef = useRef(null)

  const { confirm } = useConfirm()

  const handleOpenCard = () => {
    dispatch(updateCurrentActiveCard(card))
    dispatch(showActiveCard())
    setShowPopup(false)
  }


  const handleShowMoveCardPopup = () => {
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

  const options = [
    { icon: <CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-300" />, label: 'Mở thẻ', onClick: handleOpenCard },
    { icon: <MoveRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />, label: 'Di chuyển', onClick: handleShowMoveCardPopup },
    { 
      icon: <Archive className="w-4 h-4 text-gray-600 dark:text-gray-300" />, 
      label: card.isArchived ? 'Khôi phục' : 'Lưu trữ', 
      onClick: card.isArchived ? handleUnarchiveCard : handleArchiveCard 
    },
    { icon: <Image className="w-4 h-4 text-gray-600 dark:text-gray-300" />, label: 'Ảnh bìa', onClick: onUpdateCardCover, isFileUpload: true },
    { icon: <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />, label: 'Xóa', onClick: handleDeleteCard, isDanger: true }
  ]

  return (
    <div className="flex flex-col gap-2">
      {options.map((item, index) => (
        <OptionItemCard
          key={index}
          icon={item.icon}
          label={item.label}
          isDanger={item.isDanger}
          onClick={item.onClick}
          isFileUpload={item.isFileUpload}
          isLeftPosition={isLeftPosition}
          ref={item.label === 'Di chuyển' ? moveButtonRef : null}
          showMoveCardPopup={item.label === 'Di chuyển' ? showMoveCardPopup : undefined}
        />
      ))}

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
