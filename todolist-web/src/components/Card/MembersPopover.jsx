import React, { useRef, useEffect, useCallback } from 'react'
import { CircleCheck, X } from 'lucide-react'
import { CARD_MEMBER_ACTION } from '~/utils/constants'

const MembersPopover = ({
  isOpen,
  onClose,
  containerRef,
  toggleButtonRef,
  cardMemberIds = [],
  allUsers = [],
  onUpdateCardMembers,
  className = ''
}) => {
  const handleClosePopover = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        handleClosePopover()
      }
    }

    const handleClickOutside = (e) => {
      if (containerRef.current && 
          !containerRef.current.contains(e.target) && 
          toggleButtonRef.current && 
          !toggleButtonRef.current.contains(e.target)) {
        handleClosePopover()
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, handleClosePopover, containerRef, toggleButtonRef])

  if (!isOpen) return null

  return (
    <div
      ref={containerRef}
      className={`absolute top-full mt-2 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 
        min-w-[320px] max-w-[360px] animate-fadeIn border border-gray-200 dark:border-gray-700
        z-[100] transform origin-top-left backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 ${className}`}
    >
      {/* Header with title and close button */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          Thành viên
        </h3>
        <button
          onClick={handleClosePopover}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="max-h-[284px] md:max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
        {/* Thành viên thẻ */}
        {cardMemberIds.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">
              Thành viên thẻ
            </h4>
            <div className="flex flex-col gap-2">
              {cardMemberIds.map((memberId, index) => {
                const user = allUsers.find(user => user._id === memberId)
                if (!user) return null
                return (
                  <button
                    key={index}
                    onClick={() => onUpdateCardMembers({
                      userId: user._id,
                      action: CARD_MEMBER_ACTION.REMOVE
                    })}
                    className="flex items-center gap-3 p-2.5 rounded-lg w-full text-left
                      hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out
                      focus:outline-none"
                  >
                    <div className="relative">
                      <img
                        src={user?.avatar || '/src/assets/users/default avatar.jpg'}
                        alt={user?.displayName || 'default avatar'}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 object-cover
                          shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5
                        shadow-md">
                        <CircleCheck className="w-4 h-4 text-sky-500" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {user?.displayName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Thành viên bảng */}
        {allUsers.filter(user => !cardMemberIds.includes(user?._id)).length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">
              Thành viên bảng
            </h4>
            <div className="flex flex-col gap-2">
              {allUsers
                .filter(user => !cardMemberIds.includes(user._id))
                .map((user, index) => (
                  <button
                    key={index}
                    onClick={() => onUpdateCardMembers({
                      userId: user._id,
                      action: CARD_MEMBER_ACTION.ADD
                    })}
                    className="flex items-center gap-3 p-2.5 rounded-lg w-full text-left
                      hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out
                      focus:outline-none"
                  >
                    <div className="relative">
                      <img
                        src={user?.avatar || '/src/assets/users/default avatar.jpg'}
                        alt={user?.displayName || 'default avatar'}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 object-cover
                          shadow-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {user?.displayName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MembersPopover