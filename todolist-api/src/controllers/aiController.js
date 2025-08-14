import { StatusCodes } from 'http-status-codes'
import { groqProvider } from '~/providers/GroqProvider'
import ApiError from '~/utils/ApiError'

const generateTaskSuggestions = async (req, res, next) => {
  try {
    const { userInput, context } = req.body
    if (!userInput || !userInput.trim()) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Người dùng phải nhập thông tin')
    }
    const data = await groqProvider.generateTaskSuggestions(userInput, context)
    res.status(StatusCodes.OK).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const aiController = { generateTaskSuggestions }