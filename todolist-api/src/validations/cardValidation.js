import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().allow('').optional(),
    status: Joi.string().valid('todo', 'prepare', 'in-progress', 'completed').required(),
    cover: Joi.string().uri().allow('').optional()
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

export const cardValidation = {
  createNew
}