import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(30).trim().strict().messages({
      'any.required' : 'Tiêu đề là bắt buộc',
      'string.empty' : 'Tiêu đề không được để trống',
      'string.min' : 'Tiêu đề phải có ít nhất 3 ký tự',
      'string.max' : 'Tiêu đề phải có ít hơn 30 ký tự',
      'string.trim' : 'Tiêu đề không được có khoảng trắng đầu hoặc cuối'
    }),
    description: Joi.string().max(255).trim().strict().allow('').optional(),
    columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
    favorite: Joi.boolean().default(false),
    backgroundColor: Joi.string().default('bg-sky-200')
  })

  try {
    // abortEarly: false Khi tìm thấy lỗi tiếp tục tìm lỗi để trả về
    await correctCondition.validateAsync(req.body, { abortEarly:false })
    // Validation ok thì cho request đi sang controller
    next()
  } catch (error) {
    // const errorMessage = new Error(error).message
    // const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async (req, res, next) => {
  // Không dùng required() trong trường hợp update
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(30).trim().strict(),
    description: Joi.string().max(255).trim().strict().allow('').optional(),
    columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),
    favorite: Joi.boolean(),
    backgroundColor: Joi.string()
  })

  try {
    // abortEarly: false Khi tìm thấy lỗi tiếp tục tìm lỗi để trả về
    await correctCondition.validateAsync(req.body, {
      abortEarly:false,
      allowUnknown: true
    })
    // Validation ok thì cho request đi sang controller
    next()
  } catch (error) {
    // const errorMessage = new Error(error).message
    // const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  const correctCondition = Joi.object({
    currentCardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

    prevColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderIds: Joi.array().required().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),

    nextColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array().required().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
  })

  try {
    // abortEarly: false Khi tìm thấy lỗi tiếp tục tìm lỗi để trả về
    await correctCondition.validateAsync(req.body, { abortEarly:false })
    // Validation ok thì cho request đi sang controller
    next()
  } catch (error) {
    // const errorMessage = new Error(error).message
    // const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const boardValidation = {
  createNew,
  update,
  moveCardToDifferentColumn
}