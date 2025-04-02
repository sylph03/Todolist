import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

// Catch lỗi tập trung tại một nơi bằng cách sử dụng axios đó là Interceptors

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // axios trả kết quả về property của nó là data
  return response.data
}