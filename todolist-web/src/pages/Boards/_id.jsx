import React, { useEffect, useState } from 'react'
import AppBar from '~/components/Layout/AppBar'
import SideBar from '~/components/Layout/SideBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { createNewCardAPI, fetchBoardDetailsAPI, updateBoardDetailsAPI, updateColumnDetailsAPI } from '~/apis'
import { toast } from 'react-toastify'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sort'

const Board = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tạm fix cứng boardId, sau sẽ sử dụng react-router-dom để lấy chuẩn boardId từ url
    const boardId = '67f923d9b0287286d736dbb7'

    fetchBoardDetailsAPI(boardId).then(board => {
      // Sắp xếp thứ tự các column ở đây trước khi đưa dữ liệu xuống bên dưới các component con
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        // Xử lý vấn đề kéo thả card vào column rỗng
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } {
          // Sắp xếp thứ tự các cards ở đây trước khi đưa dữ liệu xuống bên dưới các component con
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      setBoard(board)
    })
  }, [])

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI(newCardData)

    // Cập nhật state board
    // Tự set lại state board thay vì gọi fetch BoardApi
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      toast.success('Thêm nhiệm vụ mới thành công!')
      columnToUpdate.cards.unshift(createdCard)
      columnToUpdate.cardOrderIds.unshift(createdCard._id)
    }
    setBoard(newBoard)
  }

  // Gọi API và xử lý khi kéo thả column xong xuôi
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(column => column._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API update Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    setBoard(newBoard)

    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardsIds })
  }

  if (!board) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
        <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen dark:bg-gray-800 text-white dark:text-gray-100 flex flex-col">
      <AppBar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}/>
      <div className="flex flex-1 h-full relative">
        <SideBar board={board} isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}/>
        <BoardContent createNewCard={createNewCard} board={board} moveColumns={moveColumns} moveCardInTheSameColumn={moveCardInTheSameColumn} isSidebarOpen={isSidebarOpen}/>
      </div>
    </div>
  )
}

export default Board