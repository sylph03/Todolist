import { useEffect, useState } from 'react'
import { socketIoInstance } from '~/socketClient'

/**
 * Hook để quản lý danh sách users đang online trong board
 * @param {string} boardId - ID của board
 * @returns {Array} - Danh sách users đang online
 */
export const useBoardOnlineUsers = (boardId) => {
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    if (!boardId || !socketIoInstance) return

    // Lắng nghe event khi có thay đổi danh sách users online
    const handleUsersOnline = (data) => {
      if (String(data.boardId) === String(boardId)) {
        setOnlineUsers(data.onlineUsers || [])
      }
    }

    socketIoInstance.on('BE_BOARD_USERS_ONLINE', handleUsersOnline)

    // Cleanup
    return () => {
      socketIoInstance.off('BE_BOARD_USERS_ONLINE', handleUsersOnline)
    }
  }, [boardId])

  return onlineUsers
}

