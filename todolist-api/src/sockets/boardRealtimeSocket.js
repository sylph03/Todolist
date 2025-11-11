// Socket handler cho real-time updates của board, đặc biệt là di chuyển card
export const boardRealtimeSocket = (socket) => {
  // Client join vào room của board khi vào trang board
  socket.on('FE_JOIN_BOARD', (boardId) => {
    socket.join(`board:${boardId}`)
    console.log(`User joined board: ${boardId}`)
  })

  // Client leave room khi rời khỏi board
  socket.on('FE_LEAVE_BOARD', (boardId) => {
    socket.leave(`board:${boardId}`)
    console.log(`User left board: ${boardId}`)
  })
}

