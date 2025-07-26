import React, { useEffect } from "react"

/**
  * @param {React.RefObject} ref - ref của phần tử cần kiểm tra
  * @param {Function} callback - hàm được gọi khi click outside
  * @param {React.RefObject[]} ignoreRefs - mảng ref cần bỏ qua
*/

export default function useClickOutside(ref, callback, ignoreRefs = []) {
  useEffect(() => {
    const handleClick = (event) => {
      const clickedInsideIgnored = ignoreRefs.some(
        (ignoreRef) =>
          ignoreRef.current && ignoreRef.current.contains(event.target)
      );

      if (clickedInsideIgnored) return;
      
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
