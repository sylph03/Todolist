import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardServices'
import { emitToBoard } from '~/utils/socketIO'

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const createdBoard = await boardService.createNew(userId, req.body)
    // Có kết quả trả về phía client
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) { next(error) }
}

const getDetails = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const boardId = req.params.id
    const board = await boardService.getDetails(userId, boardId)
    // Có kết quả trả về phía client
    res.status(StatusCodes.OK).json(board)
  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updatedBoard = await boardService.update(boardId, req.body)
    
    // Emit real-time event khi di chuyển column (columnOrderIds thay đổi)
    if (req.body.columnOrderIds && Array.isArray(req.body.columnOrderIds)) {
      emitToBoard(boardId, 'BE_COLUMNS_REORDERED', {
        boardId: boardId,
        columnOrderIds: req.body.columnOrderIds
      })
    }
    
    // Có kết quả trả về phía client
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) { next(error) }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    // Lấy boardId từ column để emit real-time event
    let boardId = req.body.boardId
    if (!boardId) {
      const { columnModel } = await import('~/models/columnModel')
      const column = await columnModel.findOneById(req.body.nextColumnId || req.body.prevColumnId)
      if (column) {
        boardId = String(column.boardId)
      }
    }
    
    const result = await boardService.moveCardToDifferentColumn(req.body)
    
    // Emit real-time event cho di chuyển card giữa các column
    if (boardId) {
      emitToBoard(boardId, 'BE_CARD_MOVED_BETWEEN_COLUMNS', {
        ...req.body,
        boardId: boardId
      })
    }
    
    // Có kết quả trả về phía client
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    // page và itemsPerPage được lấy từ query url phía FE nên BE cần lấy từ req.query
    const { page, itemsPerPage, q } = req.query
    const queryFilters = q

    const result = await boardService.getBoards(userId, page, itemsPerPage, queryFilters)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const getBoardsForSidebar = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const result = await boardService.getBoardsForSidebar(userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const deleteBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const result = await boardService.deleteBoard(boardId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const updateLastAccessed = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const result = await boardService.updateLastAccessed(boardId)
    res.status(StatusCodes.OK).json({ success: true, board: result })
  } catch (error) { next(error) }
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards,
  getBoardsForSidebar,
  deleteBoard,
  updateLastAccessed
}