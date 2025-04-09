import React, { useEffect, useState } from 'react'
import AppBar from '~/components/Layout/AppBar'
import SideBar from '~/components/Layout/SideBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI } from '~/apis'

const Board = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tạm fix cứng boardId, sau sẽ sử dụng react-router-dom để lấy chuẩn boardId từ url
    const boardId = '67ecdefd14d463f21785ed6c'

    fetchBoardDetailsAPI(boardId).then(board => {
      setBoard(board)
    })
  }, [])

  return (
    <div className="h-screen w-screen dark:bg-gray-800 text-white dark:text-gray-100 flex flex-col">
      <AppBar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}/>
      <div className="flex flex-1 h-full relative">
        <SideBar board={mockData.board} isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}/>
        <BoardContent board={mockData.board} isSidebarOpen={isSidebarOpen}/>
      </div>
    </div>
  )
}

export default Board