import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardServices'
import { boardModel } from '~/models/boardModel'
import { userModel } from '~/models/userModel'
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
    const userId = req.jwtDecoded._id

    // Only owners can update a board
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Không tìm thấy Board.' })
    }
    
    const isOwner = board?.ownerIds?.map(id => String(id)).includes(String(userId))
    if (!isOwner) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: 'Chỉ Owner mới được cập nhật Board này.' })
    }

    const updatedBoard = await boardService.update(boardId, req.body)
    
    // Emit real-time event khi di chuyển column (columnOrderIds thay đổi)
    if (req.body.columnOrderIds && Array.isArray(req.body.columnOrderIds)) {
      emitToBoard(boardId, 'BE_COLUMNS_REORDERED', {
        boardId: boardId,
        columnOrderIds: req.body.columnOrderIds
      })
    }
    
    // Emit real-time event khi board được cập nhật (title, description, backgroundColor, etc.)
    // Chỉ emit khi có thay đổi các field khác ngoài columnOrderIds
    const hasOtherFieldsChanged = Object.keys(req.body).some(key => key !== 'columnOrderIds')
    if (hasOtherFieldsChanged) {
      emitToBoard(boardId, 'BE_BOARD_UPDATED', {
        boardId: boardId,
        board: updatedBoard
      })
    }
    
    // Có kết quả trả về phía client
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) { next(error) }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    
    // Lấy boardId từ column để kiểm tra quyền và emit real-time event
    let boardId = req.body.boardId
    if (!boardId) {
      const { columnModel } = await import('~/models/columnModel')
      const column = await columnModel.findOneById(req.body.nextColumnId || req.body.prevColumnId)
      if (column) {
        boardId = String(column.boardId)
      }
    }
    
    // Kiểm tra quyền: owner hoặc member đều được phép di chuyển card
    if (boardId) {
      const board = await boardModel.findOneById(boardId)
      if (board) {
        const ownerIds = (board.ownerIds || []).map(id => String(id))
        const memberIds = (board.memberIds || []).map(id => String(id))
        const userIdStr = String(userId)
        
        if (!ownerIds.includes(userIdStr) && !memberIds.includes(userIdStr)) {
          return res.status(StatusCodes.FORBIDDEN).json({ 
            error: 'Bạn không có quyền truy cập Board này.' 
          })
        }
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
    const userId = req.jwtDecoded._id

    // Only owners can delete a board
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Không tìm thấy Board.' })
    }
    
    const isOwner = board?.ownerIds?.map(id => String(id)).includes(String(userId))
    if (!isOwner) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: 'Chỉ Owner mới được xóa Board này.' })
    }

    const result = await boardService.deleteBoard(boardId)
    
    // Emit real-time event khi board bị xóa
    emitToBoard(boardId, 'BE_BOARD_DELETED', {
      boardId: boardId
    })
    
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

const toggleFavorite = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const boardId = req.params.id
    
    // Kiểm tra user có quyền truy cập board không (owner hoặc member)
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Không tìm thấy Board.' })
    }
    
    const ownerIds = (board.ownerIds || []).map(id => String(id))
    const memberIds = (board.memberIds || []).map(id => String(id))
    const userIdStr = String(userId)
    
    if (!ownerIds.includes(userIdStr) && !memberIds.includes(userIdStr)) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: 'Bạn không có quyền truy cập Board này.' })
    }
    
    const result = await userModel.toggleFavoriteBoard(userId, boardId)
    res.status(StatusCodes.OK).json({ success: true, isFavorite: result.isFavorite })
  } catch (error) { next(error) }
}

const leaveBoard = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const boardId = req.params.id
    
    // Kiểm tra board có tồn tại không
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Không tìm thấy Board.' })
    }
    
    const ownerIds = (board.ownerIds || []).map(id => String(id))
    const memberIds = (board.memberIds || []).map(id => String(id))
    const userIdStr = String(userId)
    
    // Chỉ member mới được rời khỏi board (không phải owner)
    if (ownerIds.includes(userIdStr)) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: 'Owner không thể rời khỏi Board. Vui lòng xóa Board nếu muốn.' })
    }
    
    if (!memberIds.includes(userIdStr)) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: 'Bạn không phải là member của Board này.' })
    }
    
    // Lấy thông tin user đang rời khỏi để gửi thông báo
    const leavingUser = await userModel.findOneById(userId)
    
    // Xóa userId khỏi memberIds
    await boardModel.pullMemberIds(boardId, userId)
    
    // Gửi thông báo cho owners khi member rời khỏi board
    if (ownerIds.length > 0 && leavingUser) {
      const boardIdStr = String(boardId)
      emitToBoard(boardIdStr, 'BE_MEMBER_LEFT_BOARD', {
        boardId: boardIdStr,
        boardTitle: board.title,
        ownerIds: ownerIds, // Gửi kèm ownerIds để frontend có thể kiểm tra
        leavingUserId: userIdStr,
        leavingUser: {
          _id: leavingUser._id,
          username: leavingUser.username,
          displayName: leavingUser.displayName,
          avatar: leavingUser.avatar
        },
        message: `${leavingUser.displayName || leavingUser.username} đã rời khỏi bảng "${board.title}"`
      })
    }
    
    res.status(StatusCodes.OK).json({ success: true, message: 'Đã rời khỏi Board thành công.' })
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
  updateLastAccessed,
  toggleFavorite,
  leaveBoard
}