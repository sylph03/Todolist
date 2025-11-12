import { StatusCodes } from 'http-status-codes'
import { eventService } from '~/services/eventServices'
import { boardModel } from '~/models/boardModel'

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded?._id
    const { boardId } = req.body

    // Kiểm tra quyền: chỉ Owner mới được thêm event
    if (boardId) {
      const board = await boardModel.findOneById(boardId)
      if (!board) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Không tìm thấy Board.' })
      }

      const ownerIds = (board.ownerIds || []).map(id => String(id))
      const userIdStr = String(userId)

      if (!ownerIds.includes(userIdStr)) {
        return res.status(StatusCodes.FORBIDDEN).json({ 
          error: 'Chỉ Owner mới được thêm sự kiện vào Board này.' 
        })
      }
    }

    const event = await eventService.createNew(userId, req.body)
    res.status(StatusCodes.CREATED).json(event)
  } catch (error) { next(error) }
}

const getEvents = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded?._id
    const { boardId, from, to } = req.query
    const events = await eventService.getEvents(userId, boardId, from, to)
    res.status(StatusCodes.OK).json(events)
  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded?._id
    const eventId = req.params.id

    // Lấy event để kiểm tra board
    const { eventModel } = await import('~/models/eventModel')
    const event = await eventModel.findOneById(eventId)
    if (!event) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Không tìm thấy sự kiện.' })
    }

    // Kiểm tra quyền: chỉ Owner mới được sửa event
    const board = await boardModel.findOneById(event.boardId)
    if (!board) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Không tìm thấy Board.' })
    }

    const ownerIds = (board.ownerIds || []).map(id => String(id))
    const userIdStr = String(userId)

    if (!ownerIds.includes(userIdStr)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        error: 'Chỉ Owner mới được sửa sự kiện này.' 
      })
    }

    console.log('Event update request - ID:', eventId, 'Body:', req.body)
    const updated = await eventService.update(eventId, req.body)
    console.log('Event update result:', updated)
    res.status(StatusCodes.OK).json(updated)
  } catch (error) { 
    console.error('Event update error:', error)
    next(error) 
  }
}

const deleteEvent = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded?._id
    const eventId = req.params.id

    // Lấy event để kiểm tra board
    const { eventModel } = await import('~/models/eventModel')
    const event = await eventModel.findOneById(eventId)
    if (!event) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Không tìm thấy sự kiện.' })
    }

    // Kiểm tra quyền: chỉ Owner mới được xóa event
    const board = await boardModel.findOneById(event.boardId)
    if (!board) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Không tìm thấy Board.' })
    }

    const ownerIds = (board.ownerIds || []).map(id => String(id))
    const userIdStr = String(userId)

    if (!ownerIds.includes(userIdStr)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        error: 'Chỉ Owner mới được xóa sự kiện này.' 
      })
    }

    const result = await eventService.deleteEvent(eventId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const eventController = {
  createNew,
  getEvents,
  update,
  deleteEvent
}


