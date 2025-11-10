import { StatusCodes } from 'http-status-codes'
import { eventService } from '~/services/eventServices'

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded?._id
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
    const eventId = req.params.id
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
    const eventId = req.params.id
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


