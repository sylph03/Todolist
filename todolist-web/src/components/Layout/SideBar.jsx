import React from 'react'
import { ChevronLeft, Search, Sparkles, ChevronDown, FolderOpen } from 'lucide-react'

const SideBar = () => {
  return (
    <div className='z-1 absolute top-0 bottom-0 h-full max-w-WIDTH_SIDEBAR min-w-WIDTH_SIDEBAR bg-sky-500 dark:bg-gray-800 shadow-md overflow-y-auto animate-fadeOutLeft md:animate-none'>
      <div className='flex items-center justify-between w-full p-4 border-b border-gray-50'>
        <div className='flex items-center cursor-pointer hover:text-sky-100 dark:hover:text-gray-300 transition-all duration-300'>
          <img src='https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg' alt="User Avatar" className="h-8 w-8 rounded-full object-cover mr-2"/>
          <div className='font-medium'>
            Không gian làm việc
          </div>
        </div>
        <button className='justify-end p-1 rounded-md hover:bg-white/20'>
          <ChevronLeft />
        </button>
      </div>

      <div className='p-4 flex flex-col gap-2'>
        <div className="flex items-center bg-sky-500 dark:bg-gray-800 rounded-lg p-2 transition hover:bg-white/20 focus-within:bg-white/20 dark:focus-within:bg-gray-700 dark:hover:bg-gray-700 w-full group">
          <Search className="text-white dark:text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm ..."
            className="bg-transparent outline-none text-white dark:text-gray-100 placeholder-white dark:placeholder-gray-400 pl-3 w-full"
          />
        </div>
        <div className='p-2 hover:bg-white/20 rounded-lg flex items-center justify-between cursor-pointer dark:hover:bg-gray-700'>
          <div className='flex gap-2'>
            <Sparkles />
            Đã đánh dấu
          </div>
          <div>
            <ChevronDown />
          </div>
        </div>
        <div className='p-2 hover:bg-white/20 rounded-lg flex items-center justify-between cursor-pointer dark:hover:bg-gray-700'>
          <div className='flex gap-2'>
            <FolderOpen />
            Dự án
          </div>
          <div>
            <ChevronDown />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideBar
