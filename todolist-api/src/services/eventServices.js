/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { eventModel } from '~/models/eventModel'

const createNew = async (userId, reqBody) => {
  try {
    const created = await eventModel.createNew(userId, reqBody)
    const event = await eventModel.findOneById(created.insertedId)
    return event
  } catch (error) { throw error }
}

const getEvents = async (userId, boardId, from, to) => {
  try {
    // Nếu có boardId cụ thể, lấy events của board đó
    if (boardId) {
    const events = await eventModel.findByBoardInRange(boardId, from, to)
    return events
    }

    // Nếu không có boardId, lấy events của tất cả boards mà user là owner/member
    const { boardModel: boardModelModule } = await import('~/models/boardModel')
    const userBoardsResult = await boardModelModule.getBoardsForSidebar(userId)
    
    // Lấy tất cả boardIds mà user có quyền truy cập
    const boardIds = (userBoardsResult?.boards || []).map(board => board._id)
    
    // Tối ưu: Query tất cả events của các boards cùng lúc bằng $in operator (1 query thay vì N queries)
    if (boardIds.length === 0) {
      return []
    }
    
    const allEvents = await eventModel.findByBoardsInRange(boardIds, from, to)
    
    return allEvents
  } catch (error) { 
    console.error('getEvents error:', error)
    throw error 
  }
}

const update = async (eventId, reqBody) => {
  try {
    console.log('EventService update - ID:', eventId, 'Body:', reqBody)
    const updated = await eventModel.update(eventId, reqBody)
    console.log('EventService update result:', updated)
    if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Event not found')
    return updated
  } catch (error) {
    console.error('EventService update error:', error)
    throw error
  }
}

const deleteEvent = async (eventId) => {
  try {
    const result = await eventModel.deleteOneById(eventId)
    if (result.deletedCount === 0) throw new ApiError(StatusCodes.NOT_FOUND, 'Event not found')
    return { deleteResult: 'Event deleted' }
  } catch (error) { throw error }
}

export const eventService = {
  createNew,
  getEvents,
  update,
  deleteEvent
}


