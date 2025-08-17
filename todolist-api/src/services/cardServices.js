/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
// import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

const createNew = async (reqBody, cardCoverFile) => {
  try {
    // Xử lý logic dữ liệu tùy đặc thù dự án
    const newCard = {
      ...reqBody
    }

    // KIỂM TRA WIP LIMIT TRƯỚC KHI TẠO CARD
    if (newCard.boardId && newCard.columnId) {
      // Lấy thông tin board để kiểm tra WIP settings
      const board = await GET_DB().collection('boards').findOne({ 
        _id: new ObjectId(String(newCard.boardId)),
        _destroy: false 
      })
      
      if (board?.wipEnabled) {
        // Đếm số card hiện tại trong column (không tính archived cards)
        const currentCardCount = await GET_DB().collection('cards').countDocuments({
          columnId: new ObjectId(String(newCard.columnId)),
          isArchived: { $ne: true },
          _destroy: false
        })
        
        const wipLimit = board.wipLimit || 5
        
        // Nếu column đã đạt WIP limit, không cho phép tạo card mới
        if (currentCardCount >= wipLimit) {
          throw new ApiError(
            StatusCodes.FORBIDDEN, 
            `Không thể tạo task mới - cột đã đạt giới hạn WIP (${currentCardCount}/${wipLimit})!`
          )
        }
      }
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

    // KIỂM TRA WIP LIMIT KHI DI CHUYỂN CARD (columnId thay đổi)
    if (updateCard.columnId) {
      const targetCard = await cardModel.findOneById(cardId)
      if (targetCard && targetCard.columnId !== updateCard.columnId) {
        // Lấy thông tin board để kiểm tra WIP settings
        const board = await GET_DB().collection('boards').findOne({ 
          _id: targetCard.boardId,
          _destroy: false 
        })
        
        if (board?.wipEnabled) {
          // Đếm số card hiện tại trong column đích (không tính archived cards, không tính card đang di chuyển)
          const currentCardCount = await GET_DB().collection('cards').countDocuments({
            columnId: new ObjectId(String(updateCard.columnId)),
            _id: { $ne: new ObjectId(String(cardId)) },
            isArchived: { $ne: true },
            _destroy: false
          })
          
          const wipLimit = board.wipLimit || 5
          
          // Nếu column đích đã đạt WIP limit, không cho phép di chuyển
          if (currentCardCount >= wipLimit) {
            throw new ApiError(
              StatusCodes.FORBIDDEN, 
              `Không thể di chuyển task - cột đích đã đạt giới hạn WIP (${currentCardCount}/${wipLimit})!`
            )
          }
        }
      }
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