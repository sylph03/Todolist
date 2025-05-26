import { CircleCheck, Plus } from 'lucide-react'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { CARD_MEMBER_ACTION } from '~/utils/constants'
import MembersPopover from './MembersPopover'

const UserGroup = ({ cardMemberIds = [], onUpdateCardMembers }) => {
  const [isOpenPopover, setIsOpenPopover] = useState(false)
  const containerRef = useRef(null)
  const toggleButtonRef = useRef(null)

  // Mục đích lấy full thông tin user qua field: FE_allUsers (vì BoardUsers chỉ có id)
  const board = useSelector(selectCurrentActiveBoard)
  // Thành viên trong card sẽ là tập con thành viên board
  // const FE_CardMembers_2 = board?.FE_allUsers?.filter(user => cardMemberIds.includes(user._id)) // hiển thị theo board (sai vị trí)
  const FE_CardMembers = cardMemberIds.map(id => board?.FE_allUsers?.find(user => user._id === id))

  const handleUpdateCardMembers = (incomingMemberInfo) => {
    onUpdateCardMembers(incomingMemberInfo)
  }

  const handleClosePopover = useCallback(() => {
    setIsOpenPopover(false)
  }, [])

  const handleTogglePopover = useCallback((e) => {
    e.stopPropagation() // Prevent event bubbling
    setIsOpenPopover(prev => !prev)
  }, [])

  useEffect(() => {
    if (!isOpenPopover) return

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        handleClosePopover()
      }
    }

    const handleClickOutside = (e) => {
      // Check if click is outside both container and toggle button
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
  }, [isOpenPopover, handleClosePopover])

  return (
    <div className="relative px-6 mb-4">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
        <span>Thành viên</span>
      </div>
      <div className="flex items-center flex-wrap gap-0.5">
        {/* Hiển thị các user là thành viên của card */}
        {FE_CardMembers.map((user, index) =>
          <div key={index} className="relative group">
            <img
              src={user?.avatar || '/src/assets/users/default avatar.jpg'}
              alt={user?.displayName || 'default avatar'}
              title={user?.displayName || 'default avatar'}
              className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-800 object-cover
                transition-all duration-200 cursor-pointer
                hover:ring-2 hover:ring-sky-500 dark:hover:ring-sky-400
                shadow-sm hover:shadow-md"
            />
            {/* <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5
              bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100
              transition-all duration-200 ease-in-out whitespace-nowrap z-50
              shadow-lg pointer-events-none">
              {user?.displayName}
            </div> */}
          </div>
        )}

        <button
          ref={toggleButtonRef}
          className={`relative w-9 h-9 rounded-full border-2 border-white dark:border-gray-800 
            ${isOpenPopover ? 'bg-sky-500 text-white focus:ring-2 focus:ring-sky-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white focus:ring-0'} 
            flex items-center justify-center text-sm font-medium
            cursor-pointer hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500
            transition-all duration-200
            focus:outline-none
            shadow-sm hover:shadow-md`}
          onClick={handleTogglePopover}
          aria-label="Add members"
        >
          <Plus className="w-5 h-5" />
        </button>

        <MembersPopover
          isOpen={isOpenPopover}
          onClose={handleClosePopover}
          containerRef={containerRef}
          toggleButtonRef={toggleButtonRef}
          cardMemberIds={cardMemberIds}
          allUsers={board?.FE_allUsers || []}
          onUpdateCardMembers={handleUpdateCardMembers}
        />
      </div>
    </div>
  )
}

export default UserGroup