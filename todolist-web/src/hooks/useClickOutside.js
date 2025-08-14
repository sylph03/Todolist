import React, { useEffect } from 'react'

/**
  * @param {React.RefObject} ref - ref của phần tử cần kiểm tra
  * @param {Function} callback - hàm được gọi khi click outside
  * @param {React.RefObject[]} ignoreRefs - mảng ref cần bỏ qua
*/

export default function useClickOutside(ref, callback, ignoreRefs = []) {
  useEffect(() => {
    const handleClick = (event) => {
      // Kiểm tra click có phải trên scrollbar không
      const isScrollbarClick = isClickOnScrollbar(event)
      if (isScrollbarClick) {
        return
      }

      const clickedInsideIgnored = ignoreRefs.some(
        (ignoreRef) =>
          ignoreRef.current && ignoreRef.current.contains(event.target)
      )

      if (clickedInsideIgnored) return

      // Nếu DOM đã gán thành công (ref.current tồn tại) và click xảy ra bên ngoài phần tử đó → thì thực hiện hành động đóng component (callback)
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [ref, callback, ignoreRefs])
}

// Hàm kiểm tra scrollbar
const isClickOnScrollbar = (event) => {
  const element = event.target

  // Kiểm tra nếu element có scrollbar
  if (element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth) {

    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Kiểm tra vertical scrollbar
    if (element.scrollHeight > element.clientHeight) {
      const scrollbarWidth = element.offsetWidth - element.clientWidth
      if (x > element.clientWidth - scrollbarWidth) {
        return true
      }
    }

    // Kiểm tra horizontal scrollbar
    if (element.scrollWidth > element.clientWidth) {
      const scrollbarHeight = element.offsetHeight - element.clientHeight
      if (y > element.clientHeight - scrollbarHeight) {
        return true
      }
    }
  }

  return false
}