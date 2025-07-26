import { useEffect } from 'react'

/**
 * Hook lắng nghe cả sự kiện scroll và resize
 * 
 * @param {Function} callback - Hàm được gọi khi scroll hoặc resize
 * @param {boolean} active - Có kích hoạt hay không (tuỳ chọn)
 */
export default function useScrollAndResize(callback, active = true) {
  useEffect(() => {
    if (!active) return

    const handleEvent = (event) => {
      callback(event)
    }

    window.addEventListener('scroll', handleEvent, true)
    window.addEventListener('resize', handleEvent)

    return () => {
      window.removeEventListener('scroll', handleEvent, true)
      window.removeEventListener('resize', handleEvent)
    }
  }, [callback, active])
}
