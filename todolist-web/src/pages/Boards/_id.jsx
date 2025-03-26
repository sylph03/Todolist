import React, { useState } from 'react'
import AppBar from '~/components/Layout/AppBar'
import SideBar from '~/components/Layout/SideBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'

const Board = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="h-screen w-screen dark:bg-gray-800 text-white dark:text-gray-100 flex flex-col">
      <AppBar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}/>
      <div className="flex flex-1 h-full relative">
        <SideBar board={mockData?.board} isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}/>
        <BoardContent board={mockData?.board} isSidebarOpen={isSidebarOpen}/>
      </div>
    </div>
  )
}

export default Board