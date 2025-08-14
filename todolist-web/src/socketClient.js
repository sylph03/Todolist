import { io } from 'socket.io-client'
import { API_ROOT } from './utils/constants'
export const socketIoInstance = io(API_ROOT, {
  reconnectionAttempts: 5, // Thử lại tối đa 5 lần
  reconnectionDelay: 5000, // Mỗi lần thử lại cách nhau 5 giây
  timeout: 20000, // Timeout mỗi lần connect là 20 giây
  transports: ['websocket', 'polling'] // Ưu tiên websocket
})
// import { io } from 'socket.io-client'
// import { API_ROOT } from './utils/constants'
// export const socketIoInstance = io(API_ROOT)