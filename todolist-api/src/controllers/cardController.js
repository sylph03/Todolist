import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardServices'

const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.createNew(req.body)
    // Có kết quả trả về phía client
    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) { next(error) }
}

export const cardController = {
  createNew
}