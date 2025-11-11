import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnServices'
import { emitToBoard } from '~/utils/socketIO'

const createNew = async (req, res, next) => {
  try {
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
      const hasOtherUpdates = Object.keys(req.body).some(key => key !== 'cardOrderIds')
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