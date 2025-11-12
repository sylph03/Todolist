import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Collection name & schema
const EVENT_COLLECTION_NAME = 'events'

const EVENT_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().max(100).trim().strict(),
  description: Joi.string().max(1000).trim().strict().allow('').optional(),
  startAt: Joi.date().timestamp('javascript').required(),
  endAt: Joi.date().timestamp('javascript').allow(null).default(null),
  allDay: Joi.boolean().default(false),
  timeText: Joi.string().max(50).trim().strict().allow('').optional(),
  color: Joi.string().max(30).trim().strict().allow('').optional(),
  createdBy: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).allow(null).default(null),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await EVENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (userId, data) => {
  const validData = await validateBeforeCreate({ ...data, createdBy: userId ? String(userId) : null })

  const newEventToAdd = {
    ...validData,
    boardId: new ObjectId(String(validData.boardId)),
    createdBy: validData.createdBy ? new ObjectId(String(validData.createdBy)) : null,
    startAt: new Date(validData.startAt),
    endAt: validData.endAt ? new Date(validData.endAt) : null
  }

  const result = await GET_DB().collection(EVENT_COLLECTION_NAME).insertOne(newEventToAdd)
  return result
}

const findOneById = async (id) => {
  const result = await GET_DB().collection(EVENT_COLLECTION_NAME).findOne({ _id: new ObjectId(String(id)) })
  return result
}

const findByBoardInRange = async (boardId, from, to) => {
  const query = { _destroy: false }

  if (boardId) query.boardId = new ObjectId(String(boardId))

  // If from/to provided, filter by startAt within [from, to]
  if (from || to) {
    query.startAt = {}
    if (from) query.startAt.$gte = new Date(from)
    if (to) query.startAt.$lte = new Date(to)
  }

  const results = await GET_DB().collection(EVENT_COLLECTION_NAME)
    .find(query)
    .sort({ startAt: 1 })
    .toArray()

  return results
}

// Tối ưu: Query events của nhiều boards cùng lúc (thay vì query từng board)
const findByBoardsInRange = async (boardIds, from, to) => {
  const query = { _destroy: false }

  if (boardIds && boardIds.length > 0) {
    query.boardId = { $in: boardIds.map(id => new ObjectId(String(id))) }
  }

  // If from/to provided, filter by startAt within [from, to]
  if (from || to) {
    query.startAt = {}
    if (from) query.startAt.$gte = new Date(from)
    if (to) query.startAt.$lte = new Date(to)
  }

  const results = await GET_DB().collection(EVENT_COLLECTION_NAME)
    .find(query)
    .sort({ startAt: 1 })
    .toArray()

  return results
}

const update = async (eventId, updateData) => {
  console.log('EventModel update - ID:', eventId, 'Data:', updateData)
  
  Object.keys(updateData).forEach((fieldName) => {
    if (INVALID_UPDATE_FIELDS.includes(fieldName)) delete updateData[fieldName]
  })

  if (updateData.boardId) updateData.boardId = new ObjectId(String(updateData.boardId))
  if (updateData.createdBy) updateData.createdBy = new ObjectId(String(updateData.createdBy))
  if (updateData.startAt) updateData.startAt = new Date(updateData.startAt)
  if (updateData.endAt) updateData.endAt = new Date(updateData.endAt)

  const objectId = new ObjectId(String(eventId))
  console.log('EventModel update - ObjectId:', objectId)
  
  const result = await GET_DB().collection(EVENT_COLLECTION_NAME).findOneAndUpdate(
    { _id: objectId },
    { $set: { ...updateData, updatedAt: Date.now() } },
    { returnDocument: 'after' }
  )
  console.log('EventModel update result:', result)
  return result
}

const deleteOneById = async (eventId) => {
  const result = await GET_DB().collection(EVENT_COLLECTION_NAME).deleteOne({ _id: new ObjectId(String(eventId)) })
  return result
}

export const eventModel = {
  EVENT_COLLECTION_NAME,
  EVENT_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findByBoardInRange,
  findByBoardsInRange,
  update,
  deleteOneById
}


