import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { columnModel } from '~/models/columnModel'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().max(50).trim().strict().messages({
      'any.required': 'Tiêu đề là bắt buộc',
      'string.empty': 'Tiêu đề không được để trống',
      'string.max': 'Tiêu đề phải có ít hơn 50 ký tự',
      'string.trim': 'Tiêu đề không được có khoảng trắng đầu hoặc cuối'
    }),
    bgColumn: Joi.string().max(255).default('bg-sky-100 dark:bg-sky-900/20'),
    bgTitleColumn: Joi.string().max(255).default('bg-sky-500 dark:bg-sky-600')
  })

  try {
    // Validate schema
    await correctCondition.validateAsync(req.body, { abortEarly: false })

    // Check for duplicate title
    const duplicateColumn = await columnModel.findDuplicateTitle(req.body.boardId, req.body.title)
    if (duplicateColumn) {
      throw new ApiError(StatusCodes.CONFLICT, 'Tên cột đã tồn tại trong bảng này')
    }

    // Validation ok thì cho request đi sang controller
    next()
  } catch (error) {
    if (error instanceof ApiError) {
      next(error)
    } else {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
  }
}

const update = async (req, res, next) => {
  // Không dùng required() trong trường hợp update
  const correctCondition = Joi.object({
    // Nếu có tính năng di chuyển column sang board khác thì mới thêm validate
    // boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().max(50).trim().strict().messages({
      'string.empty': 'Tiêu đề không được để trống',
      'string.max': 'Tiêu đề phải có ít hơn 50 ký tự',
      'string.trim': 'Tiêu đề không được có khoảng trắng đầu hoặc cuối'
    }),
    bgColumn: Joi.string().max(255),
    bgTitleColumn: Joi.string().max(255),
    cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([])
  })

  try {
    // Validate schema
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })

    // Check for duplicate title if title is being updated
    if (req.body.title) {
      const column = await columnModel.findOneById(req.params.id)
      if (!column) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy cột')
      }

      const duplicateColumn = await columnModel.findDuplicateTitle(column.boardId, req.body.title)
      if (duplicateColumn && duplicateColumn._id.toString() !== req.params.id) {
        throw new ApiError(StatusCodes.CONFLICT, 'Tên cột đã tồn tại trong bảng này')
      }
    }

    // Validation ok thì cho request đi sang controller
    next()
  } catch (error) {
    if (error instanceof ApiError) {
      next(error)
    } else {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
  }
}

const deleteItem = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  })

  try {
    await correctCondition.validateAsync(req.params)
    // Validation ok thì cho request đi sang controller
    next()
  } catch (error) {
    // const errorMessage = new Error(error).message
    // const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const columnValidation = {
  createNew,
  update,
  deleteItem
}