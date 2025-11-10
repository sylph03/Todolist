import React, { forwardRef } from 'react'
import { Search } from 'lucide-react'

const BoardsSearchBar = forwardRef(({ 
  searchQuery, 
  isSearching, 
  onSearchChange, 
  onSearchBlur 
}, ref) => {
  return (
    <div className="relative w-full sm:w-72">
      <input
        ref={ref}
        type="text"
        placeholder="Tìm kiếm bảng..."
        value={searchQuery}
        onChange={onSearchChange}
        onBlur={onSearchBlur}
        className="pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 w-full transition-all duration-200"
      />
      <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-2.5" />
      {isSearching && (
        <div className="absolute right-3 top-2.5">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-sky-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  )
})

BoardsSearchBar.displayName = 'BoardsSearchBar'

export default BoardsSearchBar
