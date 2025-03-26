import React from 'react'
import { Plus, Search, Archive, CircleCheck } from 'lucide-react'

const BoardActions = () => {
  return (
    <div className='flex justify-between items-center w-full h-HEIGHT_BOARD_BAR sticky top-0 left-0 z-10 bg-inherit gap-2.5 md:gap-3.5'>
      <div className='flex gap-2.5 md:gap-3.5'>
        <button className='button'>
          <Plus/>
          <span className='ml-1.5 hidden xl:inline'>
            Thêm nhiệm vụ
          </span>
        </button>
        <button className='button'>
          <Archive/>
          <span className='ml-1.5 hidden xl:inline'>
              Lưu nhiệm vụ
          </span>
        </button>
        <button className='button'>
          <CircleCheck/>
          <span className='ml-1.5 hidden xl:inline'>
            Các Nhiệm vụ đã hoàn thành
          </span>
        </button>
      </div>

      {/* <div className='uppercase font-semibold'>Today</div> */}

      <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg px-3 py-1.5 md:px-4 md:py-2 shadow-md hover:shadow-lg transition focus-within:ring-1 focus-within:ring-sky-500 dark:focus-within:ring-gray-500 max-w-[240px]">
        <Search className="text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Tìm kiếm nhiệm vụ..."
          className="bg-transparent outline-none text-black dark:text-gray-100 placeholder-gray-400 pl-2 md:pl-3 w-[165px] "
        />
      </div>
    </div>
  )
}

export default BoardActions