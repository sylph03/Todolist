/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
  try {
    // Xử lý logic dữ liệu tùy đặc thù dự án
    const newCard = {
      ...reqBody
    }

    // Gọi tới tầng model để xử lý lưu bản ghi newBoard vào trong Database
    const createdCard = await cardModel.createNew(newCard)

    // Lấy bản ghi board sau khi gọi (tùy mục đích dự án mà có cần bước này hay không)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    // Xử lý logic khác với các Collection khác tùy đặc thù dự án...
    // Bắn email, notification về cho admin khi có 1 cái board mới được tạo,...

    // Trả kết quả về, trong Service luôn phải có return

    if (getNewCard) {
      // Cập nhật mảng cardOrderIds trong collection column
      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) { throw error }
}

const deleteItem = async (cardId) => {
  try {
    const targetCard = await cardModel.findOneById(cardId)
    if (!targetCard) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found!')
    }
    // Xóa card
    await cardModel.deleteOneById(cardId)

    // Xóa cardId trong cardOrderIds của Board chứa nó
    await columnModel.pullCardOrderIds(targetCard)

    return { deleteResult: 'Nhiệm vụ đã được xóa thành công!' }
  } catch (error) { throw error }
}

export const cardService = {
  createNew,
  deleteItem
}