import { useEffect } from 'react'

/**
 * Custom hook để xử lý sự kiện scroll và resize
 * @param {Function} callback - Callback function được gọi khi scroll hoặc resize
 * @param {Array} dependencies - Các dependencies cho useEffect
 * @param {boolean} useCapture - Có sử dụng capture phase hay không
 */
export const useScrollPosition = (callback, dependencies = [], useCapture = true) => {
  useEffect(() => {
    const handleScroll = () => {
      callback()
    }

    const handleResize = () => {
      callback()
    }

    window.addEventListener('scroll', handleScroll, useCapture)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll, useCapture)
      window.removeEventListener('resize', handleResize)
    }
  }, [callback, useCapture, ...dependencies])
} 