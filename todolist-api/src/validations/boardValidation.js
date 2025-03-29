import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(30).trim().strict().messages({
      'any.required' : 'Title is required',
      'string.empty' : 'Title is not allowed to be empty',
      'string.min' : 'Title length must be at least 3 characters long',
      'string.max' : 'Title length must be less than or equal to 30 characters long',
      'string.trim' : 'Title must not have leading or trailing whitespace',
    }), 
    description: Joi.string().required().min(3).max(255).trim().strict().messages({
      'any.required' : 'Title is required',
      'string.empty' : 'Title is not allowed to be empty',
      'string.min' : 'Title length must be at least 3 characters long',
      'string.max' : 'Title length must be less than or equal to 255 characters long',
      'string.trim' : 'Title must not have leading or trailing whitespace',
    })
  })

  try {
    // abortEarly: false Khi tìm thấy lỗi tiếp tục tìm lỗi để trả về
    await correctCondition.validateAsync(req.body, { abortEarly:false })
    // Validation ok thì cho request đi sang controller
    next()
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    })
  }
}

export const boardValidation = {
  createNew
}