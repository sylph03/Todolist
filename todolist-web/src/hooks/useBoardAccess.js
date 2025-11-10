import { useCallback } from 'react'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const useBoardAccess = () => {
  // Cập nhật lastAccessedAt khi user truy cập board
  const handleBoardAccess = useCallback(async (boardId) => {
    try {
      await authorizedAxiosInstance.patch(`${API_ROOT}/v1/boards/${boardId}/access`)
    } catch (error) {
      console.error('Error updating lastAccessedAt:', error)
    }
  }, [])

  return {
    handleBoardAccess
  }
}
