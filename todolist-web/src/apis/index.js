import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

// Catch lỗi tập trung tại một nơi bằng cách sử dụng axios đó là Interceptors

// Boards
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // axios trả kết quả về property của nó là data
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  // axios trả kết quả về property của nó là data
  return response.data
}

// Columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  // axios trả kết quả về property của nó là data
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  // axios trả kết quả về property của nó là data
  return response.data
}

// Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  // axios trả kết quả về property của nó là data
  return response.data
}