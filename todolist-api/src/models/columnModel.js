import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  bgColumn: Joi.string().max(255).default('bg-sky-100 dark:bg-sky-900/20'),
  bgTitleColumn: Joi.string().max(255).default('bg-sky-500 dark:bg-sky-600'),

  // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn
  cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)

    // Biến đổi một số dữ liệu liên quan tới ObjectId chuẩn chỉnh để lưu vào DB
    const newColumntoAdd = {
      ...validData,
      boardId: new ObjectId(String(validData.boardId))
    }

    const createdColumn = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newColumntoAdd)
    return createdColumn
  } catch (error) { throw new Error(error) }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(String(id)) })
    return result
  } catch (error) { throw new Error (error) }
}

// Thêm giá trị cardId và cuối mảng cardOrderIds
const pushCardOrderIds = async (card) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(card.columnId)) },
      {
        $push: {
          cardOrderIds: {
            $each: [new ObjectId(String(card._id))],
            $position: 0
          }
        }
      },
      { returnDocument: 'after' } // Lấy bản ghi sau khi cập nhật
    )

    return result
  } catch (error) { throw new Error(error) }
}

// Lấy phần tử cardId ra khỏi mảng cardOrderIds
const pullCardOrderIds = async (card) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(card.columnId)) },
      { $pull: { cardOrderIds: new ObjectId(String(card._id)) } },
      { returnDocument: 'after' } // Lấy bản ghi sau khi cập nhật
    )

    return result
  } catch (error) { throw new Error(error) }
}

const update = async (columnId, updateData) => {
  try {
    // Lọc những trường (field) không cho phép cập nhật linh tinh
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    // Đối với những dữ liệu liên quan đến ObjectId, biến đổi ở đây
    if (updateData.cardOrderIds) {
      updateData.cardOrderIds = updateData.cardOrderIds.map(_id => (new ObjectId(String(_id))))
    }

    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(columnId)) },
      { $set: updateData },
      { returnDocument: 'after' } // Lấy bản ghi sau khi cập nhật
    )

    return result
  } catch (error) { throw new Error(error) }
}

const deleteOneById = async (columnId) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).deleteOne({ _id: new ObjectId(String(columnId)) })
    return result
  } catch (error) { throw new Error (error) }
}

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds,
  update,
  deleteOneById,
  pullCardOrderIds
}