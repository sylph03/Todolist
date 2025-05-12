import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Pagination = ({ count, page, path }) => {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5 // Maximum number of page buttons to show

    if (count <= maxVisiblePages) {
      // If total pages is less than max visible, show all pages
      for (let i = 1; i <= count; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of visible pages
      let start = Math.max(2, page - 1)
      let end = Math.min(count - 1, page + 1)

      // Adjust if at the start
      if (page <= 2) {
        end = 4
      }
      // Adjust if at the end
      if (page >= count - 1) {
        start = count - 3
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...')
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (end < count - 1) {
        pages.push('...')
      }

      // Always show last page
      pages.push(count)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="mt-8 flex items-center justify-center pt-4">
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <Link
          to={`${path}${page - 1 === 1 ? '' : `?page=${page - 1}`}`}
          className={`inline-flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
            page <= 1
              ? 'opacity-50 cursor-not-allowed pointer-events-none border-gray-200 dark:border-gray-700'
              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md active:scale-95'
          }`}
        >
          <ChevronLeft className="w-5 h-5 dark:text-gray-300" />
        </Link>

        {/* Page numbers */}
        <div className="flex items-center space-x-2">
          {pageNumbers.map((pageNum, index) => (
            pageNum === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400 dark:text-gray-500">...</span>
            ) : (
              <Link
                key={pageNum}
                to={`${path}${pageNum === 1 ? '' : `?page=${pageNum}`}`}
                className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-full transition-all duration-200 ${
                  pageNum === page
                    ? 'bg-sky-500 text-white shadow-md hover:bg-sky-600 active:scale-95'
                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md active:scale-95'
                }`}
              >
                {pageNum}
              </Link>
            )
          ))}
        </div>

        {/* Next button */}
        <Link
          to={`${path}?page=${page + 1}`}
          className={`inline-flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
            page >= count
              ? 'opacity-50 cursor-not-allowed pointer-events-none border-gray-200 dark:border-gray-700'
              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md active:scale-95'
          }`}
        >
          <ChevronRight className="w-5 h-5 dark:text-gray-300" />
        </Link>
      </div>
    </div>
  )
}

export default Pagination
