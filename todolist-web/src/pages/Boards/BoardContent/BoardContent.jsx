import React from 'react'
import { Plus, Search, Archive, CircleCheck } from 'lucide-react'

const BoardContent = () => {
  return (
    <div className='w-full h-full'>
      <div className="md:pl-PL_BOARD_CONTENT p-SPACE_BOARD_CONTENT text-white dark:bg-gray-700 bg-sky-100 transition-all duration-300 flex flex-col gap-SPACE_BOARD_CONTENT overflow-auto">
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

        <div className="flex gap-SPACE_BOARD_CONTENT h-HEIGHT_BOARD_COLUMN min-w-5xl md:min-w-7xl">
          <div className='relative basis-1/3 h-full rounded-xl shadow-md bg-red-100'>
            <div className='flex items-center justify-center bg-red-400 h-HEIGHT_COLUMN_TITLE rounded-t-xl font-bold uppercase'>
              Nhiệm vụ
            </div>
            <div className='w-full h-HEIGHT_COLUMN_CONTENT pr-1'>
              <div className='py-4 pl-4 pr-3 space-y-4 overflow-auto w-full h-full'>
                <div className='w-full h-20 rounded-2xl p-4 shadow-md bg-white text-black'>
                  Card
                </div>
                <div className='w-full h-20 rounded-2xl p-4 shadow-md bg-white text-black'>
                  Card
                </div>
                <div className='w-full h-20 rounded-2xl p-4 shadow-md bg-white text-black'>
                  Card
                </div>
                <div className='w-full h-20 rounded-2xl p-4 shadow-md bg-white text-black'>
                  Card
                </div>
                <div className='w-full h-20 rounded-2xl p-4 shadow-md bg-white text-black'>
                  Card
                </div>
                <div className='w-full h-20 rounded-2xl p-4 shadow-md bg-white text-black'>
                  Card
                </div>
                <div className='w-full h-20 rounded-2xl p-4 shadow-md bg-white text-black'>
                  Card
                </div>
                <div className='w-full h-20 rounded-2xl p-4 shadow-md bg-white text-black'>
                  Card
                </div>
                <div className='w-full h-20 rounded-2xl p-4 shadow-md bg-white text-black'>
                  Card
                </div>
                <div className='w-full h-20 rounded-2xl p-4 shadow-md bg-white text-black'>
                  Card
                </div>
                <div className='w-full h-20 rounded-2xl p-4 shadow-md bg-white text-black'>
                  Card
                </div>
              </div>
            </div>
          </div>
          <div className='relative basis-1/3 h-full rounded-xl shadow-md bg-yellow-100'>
            <div className='flex items-center justify-center bg-yellow-400 h-HEIGHT_COLUMN_TITLE rounded-t-xl font-bold uppercase'>
              Đang làm
            </div>
            <div className='w-full h-HEIGHT_COLUMN_CONTENT pr-1'>
              <div className='py-4 pl-4 pr-3 space-y-4 overflow-auto w-full h-full'>
                <div className='w-full h-20 rounded-2xl p-4 shadow-md bg-white text-black'>
                  Card
                </div>
              </div>
            </div>
          </div>
          <div className='relative basis-1/3 h-full rounded-xl shadow-md bg-green-100'>
            <div className='flex items-center justify-center bg-green-400 h-HEIGHT_COLUMN_TITLE rounded-t-xl font-bold uppercase'>
              Nhiệm vụ
            </div>
            <div className='w-full h-HEIGHT_COLUMN_CONTENT pr-1'>
              <div className='py-4 pl-4 pr-3 space-y-4 overflow-auto w-full h-full'>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardContent