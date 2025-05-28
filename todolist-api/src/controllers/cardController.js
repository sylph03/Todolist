import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardServices'

const createNew = async (req, res, next) => {
  try {
    const cardCoverFile = req.file
    const createdCard = await cardService.createNew(req.body, cardCoverFile)
    // Có kết quả trả về phía client
    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) { next(error) }
}

const deleteItem = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const result = await cardService.deleteItem(cardId)
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