import React from 'react'

const PageLoadingSpinner = ({ caption = 'Loading...' }) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white dark:bg-gray-900">
      <div className="w-14 h-14 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        {caption}
      </p>
    </div>
  )
}

export default PageLoadingSpinner