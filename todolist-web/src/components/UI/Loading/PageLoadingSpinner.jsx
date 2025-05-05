import React from 'react'

const PageLoadingSpinner = ({ caption }) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">{caption}</p>
    </div>
  )
}

export default PageLoadingSpinner