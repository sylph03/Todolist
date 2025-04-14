import React, { useEffect, useState } from 'react'
import AppBar from '~/components/Layout/AppBar'
import SideBar from '~/components/Layout/SideBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { createNewCardAPI, fetchBoardDetailsAPI } from '~/apis'
import { toast } from 'react-toastify'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

const Board = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tạm fix cứng boardId, sau sẽ sử dụng react-router-dom để lấy chuẩn boardId từ url
    const boardId = '67f923d9b0287286d736dbb7'

    fetchBoardDetailsAPI(boardId).then(board => {
      // Xử lý vấn đề kéo thả card vào column rỗng
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
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

  return (
    <div className="h-screen w-screen dark:bg-gray-800 text-white dark:text-gray-100 flex flex-col">
      <AppBar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}/>
      <div className="flex flex-1 h-full relative">
        <SideBar board={board} isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}/>
        <BoardContent createNewCard={createNewCard} board={board} isSidebarOpen={isSidebarOpen}/>
      </div>
    </div>
  )
}

export default Board