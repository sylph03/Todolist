import { useEffect } from 'react'

/**
 * Custom hook để xử lý sự kiện click outside
 * @param {Array} refs - Mảng các ref cần kiểm tra
 * @param {Function} callback - Callback function được gọi khi click outside
 * @param {Array} dependencies - Các dependencies cho useEffect
 */
export const useClickOutside = (refs, callback, dependencies = []) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra xem click có nằm ngoài tất cả các ref không
      const isOutside = refs.every(ref => 
        ref.current && !ref.current.contains(event.target)
      )
      
      if (isOutside) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [refs, callback, ...dependencies])
} 