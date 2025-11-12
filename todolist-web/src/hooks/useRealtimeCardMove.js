import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { socketIoInstance } from '~/socketClient'
import { 
  updateCurrentActiveBoard, 
  updateCardInBoard,
  selectCurrentActiveBoard,
  fetchBoardDetailsAPI
} from '~/redux/activeBoard/activeBoardSlice'
import { updateCurrentActiveCard, selectCurrentActiveCard, hideActiveCard, clearCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { cloneDeep } from 'lodash'
import { mapOrder } from '~/utils/sort'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

// Hook để xử lý real-time updates cho di chuyển card
export const useRealtimeCardMove = (boardId) => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const activeCard = useSelector(selectCurrentActiveCard)
  const currentUser = useSelector(selectCurrentUser)

  useEffect(() => {
    if (!boardId || !socketIoInstance) return

    // Join board room khi vào trang board, gửi kèm thông tin user
    const userInfo = currentUser ? {
      _id: currentUser._id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      email: currentUser.email
    } : null

    socketIoInstance.emit('FE_JOIN_BOARD', {
      boardId,
      user: userInfo
    })

    // Listen cho di chuyển card giữa các column
    const handleCardMovedBetweenColumns = (data) => {
      if (String(data.boardId) === String(boardId) && board) {
        // Refetch board để đảm bảo data đồng bộ hoàn toàn
        dispatch(fetchBoardDetailsAPI(boardId))
      }
    }

    // Listen cho di chuyển card trong cùng column
    const handleCardMovedInColumn = (data) => {
      if (String(data.boardId) === String(boardId) && board) {
        const newBoard = cloneDeep(board)
        const column = newBoard.columns.find(col => String(col._id) === String(data.columnId))
        
        if (column && data.cardOrderIds) {
          // Sắp xếp lại cards theo cardOrderIds mới
          column.cards = mapOrder(column.cards, data.cardOrderIds, '_id')
          column.cardOrderIds = data.cardOrderIds
          
          dispatch(updateCurrentActiveBoard(newBoard))
        }
      }
    }

    // Listen cho di chuyển column (sắp xếp lại thứ tự columns)
    const handleColumnsReordered = (data) => {
      if (String(data.boardId) === String(boardId) && board && data.columnOrderIds) {
        const newBoard = cloneDeep(board)
        // Sắp xếp lại columns theo columnOrderIds mới
        newBoard.columns = mapOrder(newBoard.columns, data.columnOrderIds, '_id')
        newBoard.columnOrderIds = data.columnOrderIds
        
        dispatch(updateCurrentActiveBoard(newBoard))
      }
    }

    // Listen cho tạo card mới
    const handleCardCreated = (data) => {
      if (String(data.boardId) === String(boardId) && board && data.card) {
        const newBoard = cloneDeep(board)
        const column = newBoard.columns.find(col => String(col._id) === String(data.card.columnId))
        
        if (column) {
          // Kiểm tra xem card đã tồn tại chưa (tránh duplicate khi user tự tạo)
          const cardExists = column.cards.some(card => String(card._id) === String(data.card._id))
          if (cardExists) {
            return // Card đã tồn tại, không cần thêm lại
          }
          
          // Xóa placeholder card nếu có
          const hasPlaceholder = column.cards.some(card => card.FE_PlaceholderCard)
          if (hasPlaceholder) {
            column.cards = column.cards.filter(card => !card.FE_PlaceholderCard)
            column.cardOrderIds = column.cardOrderIds.filter(id => !String(id).includes('placeholder'))
          }
          
          // Thêm card mới vào đầu danh sách (giống logic trong FormCreateCard)
          column.cards.unshift(data.card)
          
          // Cập nhật cardOrderIds
          if (!column.cardOrderIds) {
            column.cardOrderIds = []
          }
          column.cardOrderIds.unshift(data.card._id)
          
          dispatch(updateCurrentActiveBoard(newBoard))
        }
      }
    }

    // Listen cho cập nhật card (sửa card)
    const handleCardUpdated = (data) => {
      if (String(data.boardId) === String(boardId) && board && data.card) {
        // Sử dụng action updateCardInBoard để cập nhật card trong board
        dispatch(updateCardInBoard(data.card))
        
        // Cập nhật activeCard nếu card đang được mở trong modal
        if (activeCard && String(activeCard._id) === String(data.card._id)) {
          dispatch(updateCurrentActiveCard(data.card))
        }
      }
    }

    // Listen cho xóa card
    const handleCardDeleted = (data) => {
      if (String(data.boardId) === String(boardId) && board) {
        const newBoard = cloneDeep(board)
        const column = newBoard.columns.find(col => String(col._id) === String(data.columnId))
        
        if (column) {
          // Xóa card khỏi column
          column.cards = column.cards.filter(card => String(card._id) !== String(data.cardId))
          column.cardOrderIds = column.cardOrderIds.filter(id => String(id) !== String(data.cardId))
          
          // Thêm placeholder card nếu column trở nên rỗng (không có active cards)
          const activeCards = column.cards.filter(card => !card.isArchived && !card.FE_PlaceholderCard)
          if (isEmpty(activeCards)) {
            const hasPlaceholder = column.cards.some(card => card.FE_PlaceholderCard)
            if (!hasPlaceholder) {
              const placeholderCard = generatePlaceholderCard(column)
              column.cards.push(placeholderCard)
              column.cardOrderIds.push(placeholderCard._id)
            }
          }
          
          dispatch(updateCurrentActiveBoard(newBoard))
        }
        
        // Đóng ActiveCard modal nếu card đang được mở bị xóa
        if (activeCard && String(activeCard._id) === String(data.cardId)) {
          dispatch(hideActiveCard())
          dispatch(clearCurrentActiveCard())
        }
      }
    }

    // Listen cho tạo column mới
    const handleColumnCreated = (data) => {
      if (String(data.boardId) === String(boardId) && board && data.column) {
        const newBoard = cloneDeep(board)
        
        // Kiểm tra xem column đã tồn tại chưa (tránh duplicate khi user tự tạo)
        const columnExists = newBoard.columns.some(col => String(col._id) === String(data.column._id))
        if (columnExists) {
          return // Column đã tồn tại, không cần thêm lại
        }
        
        // Thêm column mới vào board
        newBoard.columns.push(data.column)
        
        // Cập nhật columnOrderIds
        if (!newBoard.columnOrderIds) {
          newBoard.columnOrderIds = []
        }
        newBoard.columnOrderIds.push(data.column._id)
        
        // Thêm placeholder card vào column mới (giống logic trong FormCreateColumn)
        const placeholderCard = generatePlaceholderCard(data.column)
        const newColumnIndex = newBoard.columns.length - 1
        newBoard.columns[newColumnIndex].cards = [placeholderCard]
        newBoard.columns[newColumnIndex].cardOrderIds = [placeholderCard._id]
        
        dispatch(updateCurrentActiveBoard(newBoard))
      }
    }

    // Listen cho cập nhật column (sửa column)
    const handleColumnUpdated = (data) => {
      if (String(data.boardId) === String(boardId) && board && data.column) {
        const newBoard = cloneDeep(board)
        const columnIndex = newBoard.columns.findIndex(col => String(col._id) === String(data.column._id))
        
        if (columnIndex !== -1) {
          // Cập nhật column trong board, giữ nguyên cards và cardOrderIds
          newBoard.columns[columnIndex] = {
            ...newBoard.columns[columnIndex],
            ...data.column,
            // Giữ nguyên cards và cardOrderIds từ column hiện tại
            cards: newBoard.columns[columnIndex].cards,
            cardOrderIds: newBoard.columns[columnIndex].cardOrderIds
          }
          
          dispatch(updateCurrentActiveBoard(newBoard))
        }
      }
    }

    // Listen cho xóa column
    const handleColumnDeleted = (data) => {
      if (String(data.boardId) === String(boardId) && board) {
        const newBoard = cloneDeep(board)
        
        // Xóa column khỏi board
        newBoard.columns = newBoard.columns.filter(col => String(col._id) !== String(data.columnId))
        
        // Cập nhật columnOrderIds
        if (newBoard.columnOrderIds) {
          newBoard.columnOrderIds = newBoard.columnOrderIds.filter(id => String(id) !== String(data.columnId))
        }
        
        dispatch(updateCurrentActiveBoard(newBoard))
        
        // Đóng ActiveCard modal nếu card đang được mở thuộc column bị xóa
        if (activeCard && activeCard.columnId && String(activeCard.columnId) === String(data.columnId)) {
          dispatch(hideActiveCard())
          dispatch(clearCurrentActiveCard())
        }
      }
    }

    // Register event listeners
    socketIoInstance.on('BE_CARD_MOVED_BETWEEN_COLUMNS', handleCardMovedBetweenColumns)
    socketIoInstance.on('BE_CARD_MOVED_IN_COLUMN', handleCardMovedInColumn)
    socketIoInstance.on('BE_COLUMNS_REORDERED', handleColumnsReordered)
    socketIoInstance.on('BE_CARD_CREATED', handleCardCreated)
    socketIoInstance.on('BE_CARD_UPDATED', handleCardUpdated)
    socketIoInstance.on('BE_CARD_DELETED', handleCardDeleted)
    socketIoInstance.on('BE_COLUMN_CREATED', handleColumnCreated)
    socketIoInstance.on('BE_COLUMN_UPDATED', handleColumnUpdated)
    socketIoInstance.on('BE_COLUMN_DELETED', handleColumnDeleted)

    // Cleanup: leave room và remove listeners
    return () => {
      socketIoInstance.emit('FE_LEAVE_BOARD', boardId)
      socketIoInstance.off('BE_CARD_MOVED_BETWEEN_COLUMNS', handleCardMovedBetweenColumns)
      socketIoInstance.off('BE_CARD_MOVED_IN_COLUMN', handleCardMovedInColumn)
      socketIoInstance.off('BE_COLUMNS_REORDERED', handleColumnsReordered)
      socketIoInstance.off('BE_CARD_CREATED', handleCardCreated)
      socketIoInstance.off('BE_CARD_UPDATED', handleCardUpdated)
      socketIoInstance.off('BE_CARD_DELETED', handleCardDeleted)
      socketIoInstance.off('BE_COLUMN_CREATED', handleColumnCreated)
      socketIoInstance.off('BE_COLUMN_UPDATED', handleColumnUpdated)
      socketIoInstance.off('BE_COLUMN_DELETED', handleColumnDeleted)
    }
  }, [boardId, board, activeCard, dispatch, currentUser])
}

