import { useEffect } from 'react'

/**
 * Custom hook để xử lý sự kiện nhấn phím Escape
 * @param {Function} callback - Callback function được gọi khi nhấn Escape
 * @param {Array} dependencies - Các dependencies cho useEffect
 */
export const useEscapeKey = (callback, dependencies = []) => {
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        callback()
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [callback, ...dependencies])
} 