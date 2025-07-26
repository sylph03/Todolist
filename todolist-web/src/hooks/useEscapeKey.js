import { useEffect } from "react"

/**
 * Custom hook xử lý sự kiện nhấn phím Escape
 * 
 * @param {Function} callback - Hàm được gọi khi nhấn phím Escape
 * @param {boolean} enabled - Nếu là false thì hook sẽ không hoạt động (tuỳ chọn, mặc định true)
 */
export default function useEscapeKey(callback, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [callback, enabled])
}
