// Param socket sẽ được lấy từ thư viện socket.io
export const inviteUserToBoardSocket = (socket) => {
  // Lắng nghe sự kiện mà Client emit lên có tên là FE_USER_INVITED_TO_BOARD
  socket.on('FE_USER_INVITED_TO_BOARD', (invitation) => {
    // Gửi sự kiện đến Client có tên là BE_USER_INVITED_TO_BOARD
    socket.broadcast.emit('BE_USER_INVITED_TO_BOARD', invitation)
  })
}