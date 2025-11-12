import React from 'react'
import { Link } from 'react-router-dom'
import { Star, ChevronRight } from 'lucide-react'

const BoardGrid = ({ 
  boards, 
  onBoardAccess 
}) => {
  if (!boards || boards.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {boards.map((board) => (
        <Link
          to={`/boards/${board?._id}`}
          onClick={() => onBoardAccess(board?._id)}
          key={board?._id} 
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 border border-gray-100 dark:border-gray-700"
        >
          <div className={`h-16 sm:h-22 ${board?.backgroundColor || 'bg-sky-200'} relative`}>
            {board?.isFavorite && (
              <button className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-current" />
              </button>
            )}
          </div>
          <div className="p-3 sm:p-4">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                {board?.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">
              {board?.description}
            </p>
            <p 
              className="flex items-center text-xs sm:text-sm text-sky-500 dark:text-sky-300 hover:text-sky-600 dark:hover:text-sky-300 transition-colors"
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Đi tới bảng
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default BoardGrid
