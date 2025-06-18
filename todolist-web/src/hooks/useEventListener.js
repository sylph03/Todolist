import { useEffect, useRef } from 'react'

/**
 * Custom hook để xử lý event listener
 * @param {string} eventName - Tên sự kiện
 * @param {Function} handler - Callback function xử lý sự kiện
 * @param {Element} element - Element cần lắng nghe sự kiện (mặc định là window)
 * @param {boolean} useCapture - Có sử dụng capture phase hay không
 */
export const useEventListener = (
  eventName,
  handler,
  element = window,
  useCapture = false
) => {
  // Lưu trữ handler mới nhất
  const savedHandler = useRef()

  // Cập nhật ref.current khi handler thay đổi
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    // Kiểm tra element có hỗ trợ addEventListener không
    const isSupported = element && element.addEventListener
    if (!isSupported) return

    // Tạo event listener
    const eventListener = (event) => savedHandler.current(event)
    element.addEventListener(eventName, eventListener, useCapture)

    // Cleanup
    return () => {
      element.removeEventListener(eventName, eventListener, useCapture)
    }
  }, [eventName, element, useCapture])
} 