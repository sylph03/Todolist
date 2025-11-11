// Utility để emit socket events từ bất kỳ đâu trong ứng dụng
let ioInstance = null

export const setSocketIOInstance = (io) => {
  ioInstance = io
}

export const getSocketIOInstance = () => {
  return ioInstance
}

// Helper functions để emit events
export const emitToBoard = (boardId, eventName, data) => {
  if (ioInstance) {
    // Emit đến tất cả clients đang trong room của board này
    ioInstance.to(`board:${boardId}`).emit(eventName, data)
  }
}

export const emitToAll = (eventName, data) => {
  if (ioInstance) {
    ioInstance.emit(eventName, data)
  }
}

