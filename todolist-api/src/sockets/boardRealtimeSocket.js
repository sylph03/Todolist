// Socket handler cho real-time updates của board, đặc biệt là di chuyển card
export const boardRealtimeSocket = (socket) => {
  // Helper function để lấy danh sách users online trong board
  const getOnlineUsersInBoard = (boardId) => {
    const io = socket.server
    const room = io.sockets.adapter.rooms.get(`board:${boardId}`)
    
    if (!room) return []

    const onlineUsers = []
    const seenUserIds = new Set()

    // Lấy thông tin user từ socket data
    for (const socketId of room) {
      const clientSocket = io.sockets.sockets.get(socketId)
      if (clientSocket && clientSocket.user) {
        const userId = String(clientSocket.user._id)
        // Tránh duplicate users (nếu user có nhiều tab/multiple connections)
        if (!seenUserIds.has(userId)) {
          seenUserIds.add(userId)
          onlineUsers.push(clientSocket.user)
        }
      }
    }

    return onlineUsers
  }

  // Client join vào room của board khi vào trang board
  socket.on('FE_JOIN_BOARD', (data) => {
    const boardId = typeof data === 'string' ? data : data.boardId
    const user = typeof data === 'string' ? null : data.user

    socket.join(`board:${boardId}`)
    
    // Lưu thông tin user vào socket nếu có
    if (user) {
      socket.user = user
    }

    // Lấy danh sách users online sau khi join
    const onlineUsers = getOnlineUsersInBoard(boardId)

    // Emit danh sách users online đến tất cả clients trong board
    socket.to(`board:${boardId}`).emit('BE_BOARD_USERS_ONLINE', {
      boardId,
      onlineUsers
    })

    // Emit lại cho chính user vừa join để cập nhật danh sách
    socket.emit('BE_BOARD_USERS_ONLINE', {
      boardId,
      onlineUsers
    })

    console.log(`User joined board: ${boardId}, Online users: ${onlineUsers.length}`)
  })

  // Client leave room khi rời khỏi board
  socket.on('FE_LEAVE_BOARD', (boardId) => {
    socket.leave(`board:${boardId}`)

    // Lấy danh sách users online sau khi leave
    const onlineUsers = getOnlineUsersInBoard(boardId)

    // Emit danh sách users online đến tất cả clients còn lại trong board
    socket.to(`board:${boardId}`).emit('BE_BOARD_USERS_ONLINE', {
      boardId,
      onlineUsers
    })

    console.log(`User left board: ${boardId}, Remaining online users: ${onlineUsers.length}`)
  })

  // Xử lý khi socket disconnect
  socket.on('disconnect', () => {
    // Lấy tất cả rooms mà socket này đang tham gia (trước khi socket bị remove khỏi rooms)
    const rooms = Array.from(socket.rooms).filter(room => room.startsWith('board:'))

    for (const room of rooms) {
      const boardId = room.replace('board:', '')
      
      // Socket.io tự động remove socket khỏi room khi disconnect
      // Nên cần lấy danh sách users online sau khi socket đã bị remove
      // Sử dụng setTimeout để đảm bảo socket đã được remove khỏi room
      setTimeout(() => {
        const onlineUsers = getOnlineUsersInBoard(boardId)

        // Emit danh sách users online đến tất cả clients còn lại trong room
        const io = socket.server
        io.to(room).emit('BE_BOARD_USERS_ONLINE', {
          boardId,
          onlineUsers
        })
      }, 0)
    }
  })
}

