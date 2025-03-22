import React from 'react'
import { Plus, Search, Archive, CircleCheck } from 'lucide-react'

const BoardActions = () => {
  return (
    <div className='flex justify-between w-WIDTH_BOARD_CONTENT h-HEIGHT_BOARD_BAR min-w-5xl md:min-w-7xl'>
      <div className='flex gap-3.5'>
        <button className='button'>
          <Plus className='mr-1.5' />
          Thêm nhiệm vụ
        </button>
        <button className='button'>
          <Archive className='mr-1.5' />
          Lưu nhiệm vụ
        </button>
        <button className='button'>
          <CircleCheck className='mr-1.5' />
          Các Nhiệm vụ đã hoàn thành
        </button>
      </div>

      {/* <div className='uppercase font-semibold'>Today</div> */}

      <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition focus-within:ring-1 focus-within:ring-sky-500 dark:focus-within:ring-gray-500 max-w-[240px]">
        <Search className="text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Tìm kiếm nhiệm vụ..."
          className="bg-transparent outline-none text-black dark:text-gray-100 placeholder-gray-400 pl-3"
        />
      </div>
    </div>
  )
}

export default BoardActions