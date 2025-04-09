import React from 'react'
import { Plus, Search, Archive, CircleCheck } from 'lucide-react'

const BoardActions = () => {
  return (
    <div className="flex flex-row justify-between items-center w-full h-HEIGHT_BOARD_BAR sticky top-0 left-0 z-10 bg-inherit gap-3">

      {/* Các nút chức năng */}
      <div className="flex gap-3 w-full md:justify-start">
        {/* Nút Thêm nhiệm vụ */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-medium shadow-sm transition-all duration-200" title="Thêm nhiệm vụ" aria-label="Thêm nhiệm vụ" >
          <Plus className="w-5 h-5" />
          <span className="hidden xl:inline text-sm">Thêm nhiệm vụ</span>
        </button>

        {/* Nút Lưu nhiệm vụ */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium shadow-sm transition-all duration-200 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white" title="Lưu nhiệm vụ" aria-label="Lưu nhiệm vụ" >
          <Archive className="w-5 h-5" />
          <span className="hidden xl:inline text-sm">Lưu nhiệm vụ</span>
        </button>

        {/* Nút Đã hoàn thành */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm transition-all duration-200" title="Xem nhiệm vụ đã hoàn thành" aria-label="Đã hoàn thành" >
          <CircleCheck className="w-5 h-5" />
          <span className="hidden xl:inline text-sm">Đã hoàn thành</span>
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="flex items-center bg-white dark:bg-gray-600 rounded-lg px-3 py-2 shadow-md hover:shadow-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-sky-500 dark:focus-within:ring-2 dark:focus-within:ring-gray-500 max-w-full md:max-w-[250px] w-full">
        <Search className="text-gray-400 dark:text-gray-300 w-5 h-5" />
        <input
          type="text"
          placeholder="Tìm kiếm nhiệm vụ..."
          className="bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 pl-2 w-full"
          aria-label="Tìm kiếm nhiệm vụ"
        />
      </div>
    </div>
  )
}

export default BoardActions
