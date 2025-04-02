import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardServices'

const createNew = async (req, res, next) => {
  try {
    const createdBoard = await boardService.createNew(req.body)
    // Có kết quả trả về phía client
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) { next(error) }
}

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const board = await boardService.getDetails(boardId)
    // Có kết quả trả về phía client
    res.status(StatusCodes.OK).json(board)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew,
  getDetails
}