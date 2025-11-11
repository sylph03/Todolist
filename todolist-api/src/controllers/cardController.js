import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardServices'
import { emitToBoard } from '~/utils/socketIO'

const createNew = async (req, res, next) => {
  try {
    const cardCoverFile = req.file
    const createdCard = await cardService.createNew(req.body, cardCoverFile)
    
    // Emit real-time event khi tạo card mới
    if (createdCard && createdCard.boardId) {
      emitToBoard(String(createdCard.boardId), 'BE_CARD_CREATED', {
        card: createdCard,
        boardId: String(createdCard.boardId)
      })
    }
    
    // Có kết quả trả về phía client
    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) { next(error) }
}

const deleteItem = async (req, res, next) => {
  try {
    const cardId = req.params.id
    
    // Lấy thông tin card trước khi xóa để có boardId
    const { cardModel } = await import('~/models/cardModel')
    const targetCard = await cardModel.findOneById(cardId)
    
    const result = await cardService.deleteItem(cardId)
    
    // Emit real-time event khi xóa card
    if (targetCard && targetCard.boardId) {
      emitToBoard(String(targetCard.boardId), 'BE_CARD_DELETED', {
        cardId: cardId,
        columnId: String(targetCard.columnId),
        boardId: String(targetCard.boardId)
      })
    }
    
    // Có kết quả trả về phía client
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const cardCoverFile = req.file
    const userInfo = req.jwtDecoded
    const updatedCard = await cardService.update(cardId, req.body, cardCoverFile, userInfo)
    
    // Emit real-time event khi cập nhật card
    if (updatedCard && updatedCard.boardId) {
      emitToBoard(String(updatedCard.boardId), 'BE_CARD_UPDATED', {
        card: updatedCard,
        boardId: String(updatedCard.boardId)
      })
    }
    
    res.status(StatusCodes.OK).json(updatedCard)
  } catch (error) { next(error) }
}

const getCards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    // Lấy query parameters từ request
    const { q } = req.query
    // Parse query string thành object nếu có
    const queryFilters = q ? JSON.parse(q) : null

    const result = await cardService.getCards(userId, queryFilters)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const cardController = {
  createNew,
  deleteItem,
  update,
  getCards
}