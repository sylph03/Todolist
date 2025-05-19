import React, { useState, useRef, useEffect } from 'react'

const BoardUserGroup = ({ boardUsers = [], limit = 3 }) => {
  const [isOpenPopover, setIsOpenPopover] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpenPopover(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleTogglePopover = () => {
    setIsOpenPopover(!isOpenPopover)
  }

  return (
    <div className="flex items-center relative" ref={containerRef}>
      {/* Hiển thị các user là thành viên của card */}
      {boardUsers.map((user, index) => {
        if (index < limit) {
          return (
            <img
              key={index}
              src={user?.avatar || '/src/assets/users/default avatar.jpg'}
              alt={user?.displayName || 'default avatar'}
              title={user?.displayName || 'default avatar'}
              className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover -ml-1 hover:scale-110 transition-transform duration-200 cursor-pointer"
            />
          )
        }
      })}

      {/* Nếu số lượng users nhiều hơn limit thì hiện thêm + number */}
      {boardUsers.length > limit && (
        <div
          className={`w-8 h-8 rounded-full border-2 border-white ${isOpenPopover ? 'bg-gray-300 dark:bg-gray-600 scale-110' : 'bg-gray-200'} dark:border-gray-800 text-gray-700 dark:bg-gray-700 dark:text-white flex items-center justify-center text-sm font-medium -ml-1 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-110`}
          title={`${boardUsers.length - limit} người khác`}
          onClick={handleTogglePopover}
        >
          +{boardUsers.length - limit}
        </div>
      )}

      {/* Popover hiển thị danh sách users còn lại */}
      {isOpenPopover && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-50 min-w-[200px] max-w-[300px] animate-fadeIn">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Thành viên khác
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {boardUsers.length - limit} người
            </span>
          </div>
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-2 pr-1">
              {boardUsers.slice(limit).map((user, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg  dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <img
                    src={user?.avatar || '/src/assets/users/default avatar.jpg'}
                    alt={user?.displayName || 'default avatar'}
                    title={user?.displayName || 'default avatar'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                      {user?.displayName || 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email || 'No email'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BoardUserGroup