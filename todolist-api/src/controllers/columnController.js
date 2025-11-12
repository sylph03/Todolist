import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnServices'
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { emitToBoard } from '~/utils/socketIO'

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const boardId = req.body.boardId
    
    // Kiểm tra quyền: chỉ Owner mới được tạo column mới
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Không tìm thấy Board.' })
    }
    
    const ownerIds = (board.ownerIds || []).map(id => String(id))
    const userIdStr = String(userId)
    
    if (!ownerIds.includes(userIdStr)) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: 'Chỉ Owner mới được tạo Cột mới.' })
    }
    
    const createdColumn = await columnService.createNew(req.body)
    
    // Emit real-time event khi tạo column mới
    if (createdColumn && createdColumn.boardId) {
      emitToBoard(String(createdColumn.boardId), 'BE_COLUMN_CREATED', {
        column: createdColumn,
        boardId: String(createdColumn.boardId)
      })
    }
    
    // Có kết quả trả về phía client
    res.status(StatusCodes.CREATED).json(createdColumn)
  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const columnId = req.params.id
    const userId = req.jwtDecoded._id
    
    // Lấy column để kiểm tra board
    const column = await columnModel.findOneById(columnId)
    if (!column) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Không tìm thấy Cột.' })
    }
    
    // Lấy board để kiểm tra quyền
    const board = await boardModel.findOneById(column.boardId)
    if (!board) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Không tìm thấy Board.' })
    }
    
    const ownerIds = (board.ownerIds || []).map(id => String(id))
    const memberIds = (board.memberIds || []).map(id => String(id))
    const userIdStr = String(userId)
    const isOwner = ownerIds.includes(userIdStr)
    const isMember = memberIds.includes(userIdStr) && !isOwner
    
    // Kiểm tra xem có phải chỉ cập nhật cardOrderIds không (và updatedAt được tự động thêm)
    const updateKeys = Object.keys(req.body).filter(key => key !== 'updatedAt')
    const isOnlyCardOrderIdsUpdate = updateKeys.length === 1 && updateKeys[0] === 'cardOrderIds'
    
    // Nếu cập nhật các field khác (không phải chỉ cardOrderIds), chỉ owner mới được phép
    if (!isOnlyCardOrderIdsUpdate && !isOwner) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        error: 'Chỉ Owner mới được cập nhật thông tin Cột.' 
      })
    }
    
    // Nếu chỉ cập nhật cardOrderIds, cho phép cả owner và member
    if (isOnlyCardOrderIdsUpdate && !isOwner && !isMember) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        error: 'Bạn không có quyền truy cập Board này.' 
      })
    }
    
    const updatedColumn = await columnService.update(columnId, req.body)
    
    if (updatedColumn && updatedColumn.boardId) {
      // Emit real-time event khi di chuyển card trong cùng column (cardOrderIds thay đổi)
      if (req.body.cardOrderIds) {
        emitToBoard(String(updatedColumn.boardId), 'BE_CARD_MOVED_IN_COLUMN', {
          columnId: columnId,
          cardOrderIds: req.body.cardOrderIds,
          boardId: String(updatedColumn.boardId)
        })
      }
      
      // Emit real-time event khi cập nhật column (title, màu sắc, etc.) - trừ cardOrderIds
      const hasOtherUpdates = Object.keys(req.body).some(key => key !== 'cardOrderIds' && key !== 'updatedAt')
      if (hasOtherUpdates) {
        emitToBoard(String(updatedColumn.boardId), 'BE_COLUMN_UPDATED', {
          column: updatedColumn,
          boardId: String(updatedColumn.boardId)
        })
      }
    }
    
    // Có kết quả trả về phía client
    res.status(StatusCodes.OK).json(updatedColumn)
  } catch (error) { next(error) }
}

const deleteItem = async (req, res, next) => {
  try {
    const columnId = req.params.id
    const userId = req.jwtDecoded._id
    
    const targetColumn = await columnModel.findOneById(columnId)
    if (!targetColumn) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Không tìm thấy cột!' })
    }
    
    // Kiểm tra quyền: chỉ owner mới được xóa column
    const board = await boardModel.findOneById(targetColumn.boardId)
    if (!board) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Không tìm thấy Board.' })
    }
    
    const ownerIds = (board.ownerIds || []).map(id => String(id))
    const userIdStr = String(userId)
    
    if (!ownerIds.includes(userIdStr)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        error: 'Chỉ Owner mới được xóa Cột.' 
      })
    }
    
    const result = await columnService.deleteItem(columnId)
    
    // Emit real-time event khi xóa column
    if (result && result.boardId) {
      emitToBoard(String(result.boardId), 'BE_COLUMN_DELETED', {
        columnId: columnId,
        boardId: String(result.boardId)
      })
    }
    
    // Có kết quả trả về phía client
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const columnController = {
  createNew,
  update,
  deleteItem
}