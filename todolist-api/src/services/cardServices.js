/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

const createNew = async (reqBody, cardCoverFile) => {
  try {
    // Xử lý logic dữ liệu tùy đặc thù dự án
    const newCard = {
      ...reqBody
    }

    let createdCard = {}

    if (cardCoverFile) {
      // Trường hợp upload file lên Cloudinary
      const uploadResult = await CloudinaryProvider.streamUpload(cardCoverFile.buffer, 'card-covers')
      // Lưu lại url (secure_url) của file vào DB
      createdCard = await cardModel.createNew({
        ...newCard,
        cover: uploadResult.secure_url
      })
    } else {
      // Các trường hợp tạo mới chung
      createdCard = await cardModel.createNew(newCard)
    }

    // Lấy bản ghi card sau khi tạo
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
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy thẻ!')
    }
    // Xóa card
    await cardModel.deleteOneById(cardId)

    // Xóa cardId trong cardOrderIds của Column chứa nó
    await columnModel.pullCardOrderIds(targetCard)

    return { deleteResult: 'Nhiệm vụ đã được xóa thành công!' }
  } catch (error) { throw error }
}

const update = async (cardId, reqBody, cardCoverFile, userInfo) => {
  try {
    const updateCard = {
      ...reqBody,
      updatedAt: Date.now()
    }

    let updatedCard = {}

    if (cardCoverFile) {
      // Trường hợp upload file lên Cloudinary
      const uploadResult = await CloudinaryProvider.streamUpload(cardCoverFile.buffer, 'card-covers')
      // Lưu lại url (secure_url) của file vào DB
      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url
      })
    } else if (updateCard.commentToAdd) {
      // Tạo dữ liệu comment để thêm vào db, cần bổ sung những trường cần thiết
      const commentData = {
        ...updateCard.commentToAdd,
        commentedAt: Date.now(),
        userId: userInfo._id,
        userEmail: userInfo.email
      }
      updatedCard = await cardModel.unshiftNewComment(cardId, commentData)
    } else if (updateCard.incomingMemberInfo) {
      // Trường hợp add hoặc remove thành viên trong card
      updatedCard = await cardModel.updateMembers(cardId, updateCard.incomingMemberInfo)
    } else {
      // Các trường hợp update chung
      updatedCard = await cardModel.update(cardId, updateCard)
    }

    return updatedCard
  } catch (error) { throw error }
}

const getCards = async (userId, queryFilters) => {
  try {

    const results = await cardModel.getCards(userId, queryFilters)

    return results
  } catch (error) { throw error }
}

export const cardService = {
  createNew,
  deleteItem,
  update,
  getCards
}