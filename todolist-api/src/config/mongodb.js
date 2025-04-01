// sylph203
// gQ8TKpbCWzyipNex

import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'

// Khởi tạo một đối tượng todolistDatabaseInstance ban đầu là null vì chưa kết nối (connect)
let todolistDatabaseInstance = null

// Khởi tạo một đối tượng mongodbClientInstance để kết nối (connect) tới MongoDB
const mongodbClientInstance = new MongoClient(env.MONGODB_URI, {
  // ServerApi có từ phiên bản MongoDB 5 trở lên, có thể không dùng nó, nếu dùng sẽ chỉ định một cái Stable API version của MongoDB
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  // Gọi kết nối tới MongoDB Atlas với URI đã khai báo trong thân của clientInstance
  await mongodbClientInstance.connect()

  // Kết nối thành công thì lấy Database theo tên và gán ngược nó lại vào biến todolistDatabaseInstance
  todolistDatabaseInstance = mongodbClientInstance.db(env.DATABASE_NAME)
}

// Đóng kết nối tới MongoDB khi cần
export const CLOSE_DB = async () => {
  await mongodbClientInstance.close()
}

// Function không async này có nhiệm vụ export todolistDatabaseInstance sau khi đã connect thành công tới MongoDB để sử dụng ở nhiều nơi khác
// Đảm bảo chỉ luôn gọi GET_DB sau khi đã kết nối thành công tới MongoDB
export const GET_DB = () => {
  if (!todolistDatabaseInstance) throw new Error('Must connect to Database first!')
  return todolistDatabaseInstance
}
