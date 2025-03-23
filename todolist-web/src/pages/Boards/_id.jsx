import React from 'react'
import AppBar from '~/components/Layout/AppBar'
import SideBar from '~/components/Layout/SideBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'

const Board = () => {
  return (
    <div className="h-screen w-screen dark:bg-gray-800 text-white dark:text-gray-100 flex flex-col">
      <AppBar />
      <div className="flex flex-1 h-full relative">
        <SideBar board={mockData?.board}/>
        <BoardContent board={mockData?.board}/>
      </div>
    </div>
  )
}

export default Board