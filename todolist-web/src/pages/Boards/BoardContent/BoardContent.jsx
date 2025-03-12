import React from 'react'
import { Plus, Search, Archive } from 'lucide-react'

const BoardContent = () => {
  return (
    <div className="flex-1 px-6 py-4 text-white overflow-auto dark:bg-gray-700 bg-sky-100 h-full">

      <div className='flex mb-4 justify-between flex-col lg:flex-row'>
        <div className='flex gap-3.5'>
          <button className='button'>
            <Plus className='mr-1' />
            Thêm nhiệm vụ
          </button>
          <button className='button'>
            <Archive className='mr-1' />
            Lưu nhiệm vụ
          </button>
        </div>

        {/* <div className='uppercase font-semibold'>Today</div> */}

        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition focus-within:ring-1 focus-within:ring-sky-500 dark:focus-within:ring-gray-500 max-w-[240px] mt-4 lg:mt-0">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm nhiệm vụ..."
            className="bg-transparent outline-none text-black dark:text-gray-100 placeholder-gray-400 pl-3"
          />
        </div>
      </div>

      <div className="flex gap-5 w-fit lg:w-full">
        <div className='relative basis-1/3 h-[calc(100vh-220px)] lg:h-[calc(100vh-148px)] rounded-xl shadow-md bg-red-100'>
          <div className='flex items-center justify-center bg-red-400 h-10 rounded-t-xl font-bold uppercase min-w-[220px]'>
            Nhiệm vụ
          </div>
          <div className='p-4 space-y-4 '>
            <div className='w-full h-20 rounded-2xl p-4 shadow-md bg-white text-black'>
              Card
            </div>
          </div>
        </div>
        <div className='relative basis-1/3 h-[calc(100vh-220px)] lg:h-[calc(100vh-148px)] rounded-xl shadow-md bg-yellow-100'>
          <div className='flex items-center justify-center bg-yellow-400 h-10 rounded-t-xl font-bold uppercase min-w-[220px]'>
            Đang làm
          </div>
        </div>
        <div className='relative basis-1/3 h-[calc(100vh-220px)] lg:h-[calc(100vh-148px)] rounded-xl shadow-md bg-green-100'>
          <div className='flex items-center justify-center bg-green-400 h-10 rounded-t-xl font-bold uppercase min-w-[220px]'>
            Hoàn thành
          </div>
          <div className='p-4 space-y-4'>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardContent