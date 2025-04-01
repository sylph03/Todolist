import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardServices'

const createNew = async (req, res, next) => {
  try {
    const createdBoard = await boardService.createNew(req.body)
    // Có kết quả trả về phía client
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew
}