/* eslint-disable no-useless-catch */
import { columnModel } from '~/models/columnModel'

const createNew = async (reqBody) => {
  try {
    // Xử lý logic dữ liệu tùy đặc thù dự án
    const newColumn = {
      ...reqBody
    }

    // Gọi tới tầng model để xử lý lưu bản ghi newBoard vào trong Database
    const createdColumn = await columnModel.createNew(newColumn)

    // Lấy bản ghi board sau khi gọi (tùy mục đích dự án mà có cần bước này hay không)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    // Xử lý logic khác với các Collection khác tùy đặc thù dự án...
    // Bắn email, notification về cho admin khi có 1 cái board mới được tạo,...

    // Trả kết quả về, trong Service luôn phải có return
    return getNewColumn
  } catch (error) { throw error }
}

export const columnService = {
  createNew
}